// @flow
import React, { Component } from 'react';
import {
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Swiper from 'react-native-swiper';
import type { Dispatch } from 'redux';

import { connect } from '../../../base/redux';
import {
    swipeEvent,
    setTileViewDimensions
} from '../../actions.native';

import InFocusView from './InFocusView';
import TapView from './TapView';
import Thumbnail from './Thumbnail';
import styles from './styles';

/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
type Props = {

    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol,

    /**
     * Application's viewport height.
     */
    _height: number,

    /**
     * The participants in the conference.
     */
    _participants: Array<Object>,

    /**
     * Application's viewport height.
     */
    _width: number,

    /**
     * Override swiper's current index.
     */
    _currentIndex: number,

    /**
     * Show wrap-up buttons.
     */
    _showWrapUpButtons: number,

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: Dispatch<any>,

    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: Function,
    inFocusUser: Object
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 10;

/**
 * The aspect ratio the tiles should display in.
 *
 * @private
 * @type {number}
 */
const TILE_ASPECT_RATIO = 1;

const COLUMN_COUNT = 2;

/**
 * Implements a React {@link Component} which displays thumbnails in a two
 * dimensional grid.
 *
 * @extends Component
 */
class TileView extends Component<Props> {
    swiperRef: Swiper;
    totalPages: number;

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
        const { _height, _width, onClick } = this.props;
        const rowElements = this._groupIntoRows(this._renderThumbnails(), COLUMN_COUNT);

        const pages = [ <InFocusView
            inFocusUser = { this.props?.inFocusUser }
            isWrapUpVisible = { false } // TODO: implement the logic when wrap up is visible
            localUser = { this.props._participants[0] } /> ];

        pages.push(...this._getUserPages(this._groupThumbnailsByPages(rowElements)));
        pages.push(<TapView />);
        this.totalPages = pages.length;
        if (this.props._currentIndex >= 0 && this.swiperRef && this.swiperRef.current) {
            this.swiperRef.current.scrollTo(this.props._currentIndex, false);
        }

        return (
            <TouchableWithoutFeedback
                onPress = { onClick }
                style = {{
                    ...styles.tileView,
                    height: _height,
                    width: _width
                }}>
                <Swiper
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
     * Splits a list of thumbnail rows into Pages with a maximum
     * of displayable rows at the actual screen.
     *
     * @param {Array} rowElements - The list of thumbnail rows that should be split
     * into separate page groupings.
     * @private
     * @returns {ReactElement[]}
     */
    _groupThumbnailsByPages(rowElements) {
        const { _height } = this.props;
        const heightToUse = _height - (MARGIN * 2);
        const tileHeight = this._getTileDimensions().height;
        const columnCount = Math.floor(heightToUse / tileHeight);

        const pageOrderedThumbnails = [];

        for (let i = 0; i < rowElements.length; i += columnCount) {
            pageOrderedThumbnails.push(rowElements.slice(i, i + columnCount));
        }

        return pageOrderedThumbnails;
    }

    /**
     * Returns the page grids with user thumbnails from {@link userGrid}.
     *
     * @param {[][]} userGrid - User page matrix.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _getUserPages(userGrid) {
        return userGrid.map((page, pageIndex) =>
            (<View
                key = { pageIndex }
                style = { styles.tileColumns }>
                {page.map((row, rowIndex) =>
                    (<View
                        key = { rowIndex + pageIndex }
                        style = { styles.tileRows }>
                        {row}
                    </View>)
                )}
            </View>));
    }

    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    _getSortedParticipants() {
        const participants = [];
        let localParticipant;

        for (const participant of this.props._participants) {
            if (participant.local) {
                localParticipant = participant;
            } else {
                participants.push(participant);
            }
        }

        localParticipant && participants.push(localParticipant);

        return participants;
    }

    /**
     * Calculate the height and width for the tiles.
     *
     * @private
     * @returns {Object}
     */
    _getTileDimensions() {
        const { _height, _participants, _width } = this.props;
        const columns = COLUMN_COUNT;
        const participantCount = _participants.length;
        const heightToUse = _height - (MARGIN * 2);
        const widthToUse = _width - (MARGIN * 2);
        let tileWidth;

        // If there is going to be at least two rows, ensure that at least two
        // rows display fully on screen.
        if (participantCount / columns > 1) {
            tileWidth = Math.min(widthToUse / columns, heightToUse / 2);
        } else {
            tileWidth = Math.min(widthToUse / columns, heightToUse);
        }

        return {
            height: tileWidth / TILE_ASPECT_RATIO,
            width: tileWidth
        };
    }

    /**
     * Splits a list of thumbnails into React Elements with a maximum of
     * {@link rowLength} thumbnails in each.
     *
     * @param {Array} thumbnails - The list of thumbnails that should be split
     * into separate row groupings.
     * @param {number} rowLength - How many thumbnails should be in each row.
     * @private
     * @returns {ReactElement[]}
     */
    _groupIntoRows(thumbnails, rowLength) {
        const finalRows = [];

        for (let i = 0; i < thumbnails.length; i += rowLength) {
            finalRows.push(thumbnails.slice(i, i + rowLength));
        }

        return finalRows;
    }

    /**
     * Creates React Elements to display each participant in a thumbnail. Each
     * tile will be.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _renderThumbnails() {
        const styleOverrides = {
            aspectRatio: TILE_ASPECT_RATIO,
            minHeight: this._getTileDimensions().height,
            maxWidth: this._getTileDimensions().width * 1.05
        };

        return this._getSortedParticipants()
            .map(participant => (
                <Thumbnail
                    isAvatarCircled = { false }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { !participant.local }
                    styleOverrides = { styleOverrides }
                    tileView = { true } />));
    }

    /**
     * Sets the receiver video quality based on the dimensions of the thumbnails
     * that are displayed.
     *
     * @private
     * @returns {void}
     */
    _updateReceiverQuality() {
        const { height, width } = this._getTileDimensions();

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
    const inFocusUser = participants.find(p => p.currentfocus);

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _width: responsiveUi.clientWidth,
        _currentIndex: responsiveUi.currentSwiperIndex,
        _showWrapUpButtons: responsiveUi.showWrapUpButtons,
        _participants: participants,
        inFocusUser
    };
}

export default connect(_mapStateToProps)(TileView);
