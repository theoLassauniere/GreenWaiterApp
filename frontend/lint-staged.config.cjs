module.exports = {
    '**/*.{ts,tsx,js,jsx,css,md,json,yml,yaml}': [
        'prettier --write',
        'eslint --fix --cache'
    ]
};