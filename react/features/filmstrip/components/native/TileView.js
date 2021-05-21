// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import type { Dispatch } from 'redux';

import { IN_FOCUS_COMMAND, RoleTypeId } from '../../../base/conference';
import { connect } from '../../../base/redux';
import { swipeEvent } from '../../actions.native';
import {
    PHONE_GALLERY_COLUMN_COUNT,
    TABLET_GALLERY_COLUMN_COUNT,
    THUMBNAIL_ASPECT_RATIO,
    TILE_MARGIN
} from '../../constants';

import InFocusView from './InFocusView';
import TapView from './TapView';
import constructPhoneGalleryView from './phoneGalleryViewGenerator';
import styles from './styles';
import constructTabletGalleryView from './tabletGalleryViewGenerator';

type Props = {
    dispatch: Dispatch<any>,
    _actualStoreSlideIndex: number,
    _height: number,
    _isSimplifiedConference: boolean,
    _isTabletDesignEnabled: boolean,
    _participants: Array<Object>,
    _placeholderImageUrl: string,
    _width: number
};

class TileView extends Component<Props> {
    totalPages: number;

    constructor() {
        super();
        this._calculatePageSize = this._calculatePageSize.bind(this);
        this._renderFullPage = this._renderFullPage.bind(this);
        this._onSwipe = this._onSwipe.bind(this);
    }

    componentDidMount() {
        if (this.props._actualStoreSlideIndex !== (this.totalPages - 1)) {
            this.props.dispatch(swipeEvent(this.props._actualStoreSlideIndex, this.totalPages));
        }
    }

    render() {
        const pages = [];
        const sortedParticipants = this._getSortedParticipants();

        pages.push(<InFocusView
            inFocusUser = { this.props?._participants.find(p => p[IN_FOCUS_COMMAND]) }
            isTabletDesignEnabled = { this.props._isTabletDesignEnabled }
            localUser = { this.props._participants.find(participant => participant.local) } />);

        if (!this.props._isSimplifiedConference) {
            this.props._isTabletDesignEnabled
                ? pages.push(
                ...constructTabletGalleryView(
                    sortedParticipants,
                    this.props?._placeholderImageUrl,
                    this._getThumbnailDimensions(),
                    this._calculateGalleryRowCount()))
                : pages.push(
                ...constructPhoneGalleryView(
                    sortedParticipants,
                    this._getThumbnailDimensions(),
                    this._calculateGalleryRowCount()));
        }

        pages.push(<TapView />);

        this.totalPages = pages.length;

        return (
            <View
                style = {{
                    ...styles.tileView,
                    height: this.props._height,
                    width: this.props._width
                }}>
                <FlatList
                    data = { pages }
                    getItemLayout = { this._calculatePageSize }
                    horizontal = { true }
                    initialScrollIndex = { this.props._actualStoreSlideIndex }
                    onMomentumScrollEnd = { this._onSwipe }
                    pagingEnabled = { true }
                    renderItem = { this._renderFullPage }
                    showsHorizontalScrollIndicator = { false } />
            </View>);
    }

    /**
     * Send page data to native after successful swipe action.
     *
     * @param {number} e - Current event.
     * @private
     * @returns {void}
     */
    _onSwipe(e) {
        const index
            = Math.min(Math.floor((e.nativeEvent.contentOffset.x + 1) / Dimensions.get('window').width)
                , this.totalPages);

        if (!isNaN(index) && this.totalPages) {
            this.props._actualStoreSlideIndex = index;
            this.props.dispatch(swipeEvent(index, this.totalPages));
        }
    }

    _calculatePageSize(data, index) {
        return { length: Dimensions.get('window').width,
            offset: Dimensions.get('window').width * index,
            index };
    }

    _renderFullPage({ item }) {
        return (<View style = {{ width: Dimensions.get('window').width }}>
            {item}
        </View>);
    }

    _getSortedParticipants() {
        const stylist = this.props._participants
            .find(participant => participant.vipType === RoleTypeId.CABI_STYLIST);
        const localUser = this.props._participants
            .find(participant => participant.local);
        const hostess = this.props._participants
            .find(participant => participant.vipType === RoleTypeId.CABI_HOSTESS && !participant.local);
        const cohostess = this.props._participants
            .find(participant => participant.vipType === RoleTypeId.CABI_COHOSTESS && !participant.local);
        const otherParticipants = this.props._participants
            .filter(
                participant =>
                    !participant.local
                    && participant.vipType !== RoleTypeId.CABI_STYLIST
                    && participant.vipType !== RoleTypeId.CABI_HOSTESS
                    && participant.vipType !== RoleTypeId.CABI_COHOSTESS)
            .sort((a, b) => {
                // Sometimes display names are set late. To prevent comparing too many undefined values,
                // we'll use participant ids as a fallback method.
                if (_.isString(a.name) && _.isString(b.name)) {
                    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                }

                return a.id > b.id ? 1 : -1;
            });

        const participants = [];

        participants.push(...this._sortVipUsers(stylist, hostess, cohostess, localUser));
        participants.push(...otherParticipants);

        return participants;
    }

    _sortVipUsers(stylist, hostess, cohostess, localUser) {
        return this.props._isTabletDesignEnabled
            ? [ stylist, hostess, cohostess, localUser ].filter(user => !_.isNil(user))
            : [ stylist, localUser, hostess, cohostess ].filter(user => !_.isNil(user));
    }

    _getThumbnailDimensions() {
        const columns = this._calculateGalleryColumnCount();
        const tileWidth = (this.props._width / columns) - TILE_MARGIN;

        return {
            height: tileWidth * THUMBNAIL_ASPECT_RATIO,
            width: tileWidth
        };
    }

    _calculateGalleryColumnCount() {
        return this.props._isTabletDesignEnabled
            ? TABLET_GALLERY_COLUMN_COUNT
            : PHONE_GALLERY_COLUMN_COUNT;
    }

    _calculateGalleryRowCount() {
        const heightToUse = this.props._height;
        const tileHeight = this._getThumbnailDimensions().height;

        return Math.floor(heightToUse / tileHeight);
    }
}

function _mapStateToProps(state) {
    const responsiveUi = state['features/base/responsive-ui'];
    const participants = state['features/base/participants'];
    const { isSimplifiedConference, tabletDesignEnabled
    } = state['features/base/conference'];
    const { placeholderData } = state['features/filmstrip'];

    return {
        _actualStoreSlideIndex: responsiveUi.currentSwiperIndex,
        _height: responsiveUi.clientHeight,
        _isSimplifiedConference: isSimplifiedConference,
        _isTabletDesignEnabled: tabletDesignEnabled,
        _participants: participants,
        _placeholderImageUrl: placeholderData.imageUrl,
        _width: responsiveUi.clientWidth
    };
}

export default connect(_mapStateToProps)(TileView);
