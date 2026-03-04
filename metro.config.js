const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver for absolute imports
config.resolver = {
  ...config.resolver,
  alias: {
    '@': './src',
    '@components': './src/components',
    '@screens': './src/screens',
    '@navigation': './src/navigation',
    '@store': './src/store',
    '@api': './src/api',
    '@hooks': './src/hooks',
    '@utils': './src/utils',
    '@types': './src/types',
    '@assets': './src/assets',
    '@styles': './src/styles',
    '@animations': './src/animations',
  },
  // Web-specific resolver configuration
  assetExts: [
    ...config.resolver.assetExts,
    'webp', 'xml', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'ico'
  ],
  sourceExts: [
    ...config.resolver.sourceExts,
    'web.js', 'web.jsx', 'web.ts', 'web.tsx'
  ],
};

// Configure server for web
config.server = {
  ...config.server,
  port: 8082,
  // Enable proper MIME types
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Set proper MIME types for JavaScript files
      if (req.url && req.url.includes('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      // Set proper MIME types for CSS files
      if (req.url && req.url.includes('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
      return middleware(req, res, next);
    };
  },
};

// Configure transformer for web
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    keep_classnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Configure output for web
config.serializer = {
  ...config.serializer,
  // Ensure proper module format for web
  getModulesRunBeforeMainModule: () => [],
  getPolyfills: () => [],
};

module.exports = config;
