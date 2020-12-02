// @flow

import { ColorSchemeRegistry, schemeColor } from '../../../base/color-scheme';
import { ColorPalette } from '../../../base/styles';
import { FILMSTRIP_SIZE } from '../../constants';

/**
 * Size for the Avatar.
 */
export const AVATAR_SIZE = 50;

/**
 * The styles of the feature filmstrip.
 */
export default {

    /**
     * The display name container.
     */
    displayNameContainer: {
        bottom: 0,
        margin: 0,
        position: 'absolute',
        width: '100%',
        textAlign: 'center'
    },

    notDominantSpeaker: {
        paddingBottom: 4
    },

    dominantSpeaker: {
        paddingBottom: 0
    },

    /**
     * The style of the narrow {@link Filmstrip} version which displays
     * thumbnails in a row at the bottom of the screen.
     */
    filmstripNarrow: {
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'flex-end',
        height: FILMSTRIP_SIZE
    },

    /**
     * The style of the wide {@link Filmstrip} version which displays thumbnails
     * in a column on the short size of the screen.
     *
     * NOTE: width is calculated based on the children, but it should also align
     * to {@code FILMSTRIP_SIZE}.
     */
    filmstripWide: {
        bottom: 0,
        flexDirection: 'column',
        flexGrow: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    /**
     * Container of the {@link LocalThumbnail}.
     */
    localThumbnail: {
        alignContent: 'stretch',
        alignSelf: 'stretch',
        aspectRatio: 1,
        flexShrink: 0,
        flexDirection: 'row'
    },

    moderatorIndicatorContainer: {
        bottom: 4,
        position: 'absolute',
        right: 4
    },

    /**
     * The style of the scrollview containing the remote thumbnails.
     */
    scrollView: {
        flexGrow: 0
    },

    /**
     * The style of a participant's Thumbnail which renders either the video or
     * the avatar of the associated participant.
     */
    thumbnail: {
        alignItems: 'stretch',
        backgroundColor: ColorPalette.appBackground,
        borderColor: '#424242',
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
    },

    /**
     * The thumbnails indicator container.
     */
    thumbnailIndicatorContainer: {
        alignSelf: 'stretch',
        bottom: 4,
        flex: 1,
        flexDirection: 'row',
        left: 4,
        position: 'absolute'
    },

    thumbnailTopIndicatorContainer: {
        padding: 4,
        position: 'absolute',
        top: 0
    },

    thumbnailTopLeftIndicatorContainer: {
        left: 0
    },

    thumbnailTopRightIndicatorContainer: {
        right: 0
    },

    tileView: {
        alignSelf: 'stretch',
        alignContent: 'stretch'
    },

    tileRows: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignContent: 'stretch'
    },

    tileColumns: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignContent: 'stretch'
    },

    buttonPlaceholder: {
        height: '65%',
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: '5%'
    },

    bottomVideoPlaceholder: {
        width: '25%',
        height: '100%',
        justifyContent: 'flex-end'
    },

    bottomVideoContainer: {
        height: '20%',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: '3%',
        paddingHorizontal: '3%'
    },

    fillView: {
        flex: 1,
        width: '100%',
        height: '100%'
    },

    microphoneViewStyle: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'flex-end',
        paddingBottom: '20%',
        width: '100%',
        height: '100%'
    },

    microphoneIconStyle: {
        height: '30%',
        width: '30%',
        alignSelf: 'center'
    },

    nameComponent: {
        width: '100%',
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: '5%',
        fontFamily: 'Montserrat Light'
    },

    inFrontTopView: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },

    inFrontBackView: {
        position: 'absolute',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%'
    },

    gradientOverlay: { position: 'absolute',
        width: '100%',
        height: '100%'
    }
};

/**
 * Color schemed styles for the @{code Thumbnail} component.
 */
ColorSchemeRegistry.register('Thumbnail', {

    /**
     * Dominant speaker style
     */
    dominantSpeaker: {
        borderWidth: 8,
        borderStyle: 'solid',
        borderColor: schemeColor('cabiPink')
    },

    /**
     * Tinting style of the on-stage participant thumbnail.
     */
    activeThumbnailTint: {
        backgroundColor: schemeColor('activeParticipantTint')
    },

    /**
     * Coloring if the thumbnail background.
     */
    participantViewStyle: {
        backgroundColor: schemeColor('background')
    },

    /**
     * Pinned video thumbnail style.
     */
    thumbnailPinned: {
        borderColor: schemeColor('activeParticipantHighlight'),
        shadowColor: schemeColor('activeParticipantHighlight'),
        shadowOffset: {
            height: 5,
            width: 5
        },
        shadowRadius: 5
    }
});
