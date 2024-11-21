const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Add fallback for missing Node.js modules
    config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        punycode: require.resolve('punycode/')
    };

    return config;
};