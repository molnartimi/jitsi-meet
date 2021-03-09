module.exports = {
    extends: [
        'eslint-config-jitsi'
    ],
    rules: {
        'require-jsdoc': 'off',
        'no-confusing-arrow': 'off',
        'no-invalid-this': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
