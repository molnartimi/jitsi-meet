// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Swiper from 'react-native-swiper';
import type { Dispatch } from 'redux';

import { RoleTypeId } from '../../../base/conference';
import { connect } from '../../../base/redux';
import {
    swipeEvent,
    setTileViewDimensions
} from '../../actions.native';
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

/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
type Props = {

    /**
     * Application's viewport height.
     */
    _height: number,

    /**
     * The participants in the conference.
     */
    _participants: Array<Object>,
    _placeholderImageUrl: string,

    /**
     * Application's viewport height.
     */
    _width: number,

    /**
     * Override swiper's current index.
     */
    _currentIndex: number,

    /**
     * Is the conference we're in a simplified conference?
     */
    _isSimplifiedConference: boolean,

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: Dispatch<any>,

    /**
     * Callback to invoke when tile view is tapped.
     */
    _onClick: Function,

    _isTabletDesignEnabled: boolean
};


/**
 * Implements a React {@link Component} which displays thumbnails in a two
 * dimensional grid.
 *
 * @extends Component
 */
class TileView extends Component<Props> {
    swiperRef: Swiper;
    totalPages: number;
    lastHandledForceIndex = -1;
    firstIndexSlide = 0;

    /**
     * TileView constructor.
     */
    constructor() {
        super();
        this._onSwipe = this._onSwipe.bind(this);
        this.swiperRef = React.createRef();
    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateReceiverQuality();
        this._onSwipe(0);
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const pages = [];
        const sortedParticipants = this._getSortedParticipants();

        pages.push(<InFocusView
            inFocusUser = { this.props?._participants.find(p => p.currentfocus) }
            isTabletDesignEnabled = { this.props._isTabletDesignEnabled }
            key = 'in-focus-view'
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

        if (this.props._currentIndex >= 0 && this.swiperRef && this.swiperRef.current
                && this.lastHandledForceIndex !== this.props._currentIndex) {
            this.firstIndexSlide = this.props._currentIndex;
            this.lastHandledForceIndex = this.props._currentIndex;
        }

        return (
            <TouchableWithoutFeedback
                onPress = { this.props._onClick }
                style = {{
                    ...styles.tileView,
                    height: this.props._height,
                    width: this.props._width
                }}>
                <Swiper
                    index = { this.firstIndexSlide }
                    loop = { false }
                    onIndexChanged = { this._onSwipe }
                    ref = { this.swiperRef }
                    showsButtons = { false }
                    showsPagination = { false }>
                    {pages}
                </Swiper>
            </TouchableWithoutFeedback>
        );
    }

    /**
     * Send page data to native after successful swipe action.
     *
     * @param {number} index - Current page index.
     * @private
     * @returns {void}
     */
    _onSwipe(index: number) {
        if (!isNaN(index) && this.totalPages) {
            this.props.dispatch(swipeEvent(index, this.totalPages));
        }
    }

    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
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
            .sort((a, b) => a.name > b.name ? 1 : -1);

        const participants = [];

        if (!_.isEmpty(stylist)) {
            participants.push(stylist);
        }

        participants.push(localUser);

        if (!_.isEmpty(hostess)) {
            participants.push(hostess);
        }

        if (!_.isEmpty(cohostess)) {
            participants.push(cohostess);
        }

        participants.push(...otherParticipants);

        return participants;
    }

    /**
     * Calculate the height and width for the tiles.
     *
     * @private
     * @returns {Object}
     */
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

    /**
     * Sets the receiver video quality based on the dimensions of the thumbnails
     * that are displayed.
     *
     * @private
     * @returns {void}
     */
    _updateReceiverQuality() {
        const { height, width } = this._getThumbnailDimensions();

        this.props.dispatch(setTileViewDimensions({
            thumbnailSize: {
                height,
                width
            }
        }));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const responsiveUi = state['features/base/responsive-ui'];
    const participants = state['features/base/participants'];
    const { isSimplifiedConference, tabletDesignEnabled
    } = state['features/base/conference'];
    const { placeholderData } = state['features/filmstrip'];

    return {
        _height: responsiveUi.clientHeight,
        _width: responsiveUi.clientWidth,
        _currentIndex: responsiveUi.currentSwiperIndex,
        _participants: participants,
        _placeholderImageUrl: placeholderData.imageUrl,
        _isSimplifiedConference: isSimplifiedConference,
        _isTabletDesignEnabled: tabletDesignEnabled
    };
}

export default connect(_mapStateToProps)(TileView);
