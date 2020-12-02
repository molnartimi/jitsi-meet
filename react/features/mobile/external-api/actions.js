/**
 * This is a global error handling. If an error is not caught by
 * any try-catch block or we have no use-case for handling that
 * use-case, we have to send a message for the native side.
 *
 * the type of (redux) action which signals for pending subject changes.
 *
 * {
 *     type: UNHANDLED_JITSI_ERROR,
 *     message: string of the error message
 * }
 *
 */
export const UNDEFINED_JITSI_ERROR = 'UNDEFINED_JITSI_ERROR';
