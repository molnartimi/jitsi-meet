// @flow

import { Platform } from 'react-native';

import { ColorSchemeRegistry, schemeColor } from '../../../base/color-scheme';
import { ColorPalette } from '../../../base/styles';
import { FILMSTRIP_SIZE } from '../../constants';

/**
 * Size for the Avatar.
 */
export const AVATAR_SIZE = 50;

const fillView = {
    flex: 1
};

const nameComponent = {
    position: 'absolute',
    flex: 1,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    paddingVertical: 15,
    fontFamily: 'Montserrat-SemiBold'
};

const wrapUpButtonStyle = {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
};

/**
 * The styles of the feature filmstrip.
 */
export default {

    fillView,

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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorPalette.appBackground
    },

    /**
     * The thumbnails indicator container.
     */
    thumbnailIndicatorContainer: {
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
        alignSelf: 'flex-start',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        zIndex: 1
    },

    tileColumns: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignContent: 'stretch',
        zIndex: 1
    },

    buttonText: {
        color: 'black',
        fontFamily: 'Montserrat-SemiBold'
    },

    wrapUpPlaceholder: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: '6%',
        marginBottom: '2%'
    },

    wrapUpText: {
        fontFamily: 'JustLovelySlantedWide',
        color: 'white',
        fontSize: 48
    },

    wrapUpButtonRow: {
        flexDirection: 'row',
        marginBottom: '3%'
    },

    wrapUpButtonStyle,

    lookBookButton: {
        ...wrapUpButtonStyle,
        marginRight: 3
    },

    collectionButton: {
        ...wrapUpButtonStyle,
        marginLeft: 3
    },

    bottomVideoPlaceholder: {
        aspectRatio: 0.75,
        width: '25%',
        alignSelf: 'flex-end',
        marginHorizontal: '3%',
        marginBottom: '3%'
    },

    favoritesButtonWrapper: {
        flexDirection: 'row'
    },

    osSpecificRoundedBorderedView: {
        overflow: 'hidden',
        ...Platform.select({
            ios: { borderRadius: 15 },
            android: { borderRadius: 0 }
        })
    },

    microphoneViewStyle: {
        position: 'absolute',
        aspectRatio: 0.75,
        width: '100%',
        paddingBottom: '20%',
        justifyContent: 'flex-end'
    },

    microphoneIconStyle: {
        height: '30%',
        width: '30%',
        alignSelf: 'center'
    },

    nameComponent,

    inFocusUserName: {
        ...nameComponent,
        paddingTop: 220
    },

    imageContainer: {
        ...fillView,
        justifyContent: 'center'
    },

    inFocusContainer: {
        ...fillView,
        justifyContent: 'flex-start'
    },

    inFocusTopView: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },

    gradientOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.6
    },

    participantName: {
        position: 'absolute',
        color: 'white',
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: 11
    },

    participantNamePadding: {
        bottom: 5
    },

    activeParticipantNamePadding: {
        bottom: 15
    },

    preShowCountdownContainer: {
        alignItems: 'center',
        backgroundColor: ColorPalette.black,
        paddingTop: 30,
        paddingBottom: 20
    },

    preShowCountdownStartingIn: {
        textTransform: 'uppercase',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: ColorPalette.white
    },

    preShowCountdownTimer: {
        fontSize: 26,
        color: ColorPalette.white,
        fontFamily: 'Archer-Light'
    },

    dominantSpeakerFrame: {
        position: 'absolute',
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        borderStyle: 'solid',
        borderColor: ColorPalette.cabiPink,
        borderWidth: 10,
        zIndex: 10
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
