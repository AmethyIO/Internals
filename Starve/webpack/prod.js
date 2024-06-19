// Import dependencies.
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';

// Import Configuration.
import {
  cleanWebpackPlugin,
  imageMinimizerWebpackPlugin,
} from './plugins/index.js';
import { WebpackCommonConfig } from './common.js';

/**
 * Plugins for production build.
 */
const plugins = [cleanWebpackPlugin];

/**
 * Webpack production configuration.
 */
const WebpackConfig = {
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin(),
      imageMinimizerWebpackPlugin,
    ],
    
    usedExports: true,

    // splitChunks: {
    //   chunks: 'all', // Split chunks for all types of code
    //   cacheGroups: {
    //     defaultVendors: {
    //       test: /[\\/]node_modules[\\/]/, // Target node_modules directory
    //       name: 'vendors',
    //       chunks: 'all',
    //     },
    //     default: {
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
  },
  plugins,
};

// Export configuration.
export const WebpackProdConfig = merge(WebpackCommonConfig, WebpackConfig);
