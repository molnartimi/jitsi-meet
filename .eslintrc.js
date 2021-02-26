module.exports = {
    extends: [
        'eslint-config-jitsi'
    ],
    rules: {
        'require-jsdoc': 'off',
        'no-confusing-arrow': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
