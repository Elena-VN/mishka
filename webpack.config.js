/**
 * Created by Dmitry Vinogradov on 08.12.18.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: `${__dirname}/source`,

  entry: {
    index: './js/index.js',
    catalog: './js/catalog.js',
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
              modules: true,
            },
          },
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
  ],

  devServer: {
    host: '0.0.0.0',
    port: 8080,
  },
};
