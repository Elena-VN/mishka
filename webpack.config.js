/**
 * Created by Dmitry Vinogradov on 08.12.18.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const minCSS = require('webpack-css-min');

module.exports = {
  context: `${__dirname}/source`,

  entry: {
    index: './js/index.js',
    catalog: './js/catalog.js',
    form: './js/form.js',
  },

  output: {
    filename: 'js/[name].js',
    publicPath: '/dist',
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
//************modification autoprefixer************
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers:['ie >= 8', 'last 4 version']
                })
              ],
              sourceMap: true
            }
          },
//***********************************
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff2?)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    minCSS, // modification CSS-min
  ],

  devServer: {
    host: '0.0.0.0',
    port: 8080,
  },
};
