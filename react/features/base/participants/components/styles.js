// @flow

import { BoxModel, ColorPalette } from '../../styles';

/**
 * The styles of the feature base/participants.
 */
export default {
    /**
     * Container for the avatar in the view.
     */
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },

    circleAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '50%'
    },

    /**
     * Style for the text rendered when there is a connectivity problem.
     */
    connectionInfoText: {
        color: ColorPalette.white,
        fontSize: 12,
        marginVertical: BoxModel.margin,
        marginHorizontal: BoxModel.margin,
        textAlign: 'center'
    },

    /**
     * Style for the container of the text rendered when there is a
     * connectivity problem.
     */
    connectionInfoContainer: {
        alignSelf: 'center',
        backgroundColor: ColorPalette.darkGrey,
        borderRadius: 20,
        marginTop: BoxModel.margin
    },

    /**
     * {@code ParticipantView} style.
     */
    participantView: {
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    }
};
