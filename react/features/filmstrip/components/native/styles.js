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

const baseWrapUpButtonStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
};

const baseMicrophoneViewStlye = {
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-end'
};

const baseButtonTextStyle = {
    color: 'black',
    fontFamily: 'Montserrat-SemiBold'
};

const baseWrapUpPlaceHolderStyle = {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
};

const baseBottomVideoPlaceHolderStyle = {
    alignSelf: 'flex-end',
    marginHorizontal: '3%'
};

const baseWrapUpTextStyle = {
    fontFamily: 'JustLovelySlantedWide',
    color: 'white'
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
        ...baseButtonTextStyle
    },

    tabletButtonText: {
        ...baseButtonTextStyle,
        fontSize: 18
    },

    wrapUpPlaceholder: {
        ...baseWrapUpPlaceHolderStyle,
        marginHorizontal: '6%',
        marginBottom: '2%'
    },

    tabletWrapUpPlaceholder: {
        ...baseWrapUpPlaceHolderStyle,
        marginBottom: '-25%',
        maxWidth: '50%'
    },

    wrapUpText: {
        ...baseWrapUpTextStyle,
        fontSize: 48
    },

    tabletWrapUpText: {
        ...baseWrapUpTextStyle,
        fontSize: 70
    },

    wrapUpButtonRow: {
        flexDirection: 'row',
        marginBottom: '3%'
    },

    tabletWrapUpButtonRow: {
        flexDirection: 'row'
    },

    wrapUpButtonStyle: {
        ...baseWrapUpButtonStyle,
        height: 40
    },

    lookBookButton: {
        ...baseWrapUpButtonStyle,
        marginRight: 3,
        height: 40
    },

    collectionButton: {
        ...baseWrapUpButtonStyle,
        marginLeft: 3,
        height: 40
    },

    tabletWrapUpButtonStyle: {
        ...baseWrapUpButtonStyle,
        marginLeft: 3,
        marginRight: 3,
        marginTop: '3%',
        height: 60,
        paddingBottom: 10
    },

    bottomVideoPlaceholder: {
        ...baseBottomVideoPlaceHolderStyle,
        aspectRatio: 0.75,
        width: '25%',
        marginBottom: '3%'
    },

    tabletBottomVideoPlaceholder: {
        ...baseBottomVideoPlaceHolderStyle,
        aspectRatio: 1,
        width: '12%',
        marginBottom: '-3%'
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
        ...baseMicrophoneViewStlye,
        aspectRatio: 0.75,
        paddingBottom: '20%'
    },

    tabletMicrophoneViewStyle: {
        ...baseMicrophoneViewStlye,
        aspectRatio: 1,
        paddingBottom: '15%'
    },

    microphoneIconStyle: {
        height: '30%',
        width: '30%',
        alignSelf: 'center'
    },

    tabletMicrophoneIconStyle: {
        height: '27%',
        width: '27%',
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
    },

    tabletInFocus: {
        width: '100%',
        height: '90%'
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
