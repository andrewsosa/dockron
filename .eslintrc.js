module.exports = {
    extends: [
        'airbnb-base',
        'plugin:prettier/recommended',
        'plugin:jest/recommended',
    ],
    plugins: ['prettier', 'jest'],
    rules: {
        'prettier/prettier': 'error',
    },
};
