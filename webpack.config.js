const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: {
      vendor: './src/front/components/vendor.js',
      // profile: './src/front/components/profile/index.js',
      // page2: './src/front/components/page2/index.js'
    },
    module:{
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader"
            }
          ]
        }
      ]
    },
  plugins: [
    // new CleanWebpackPlugin(['dist'], {}),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new CopyWebpackPlugin([{
      from: './src/front/static/img/',
      to: './img/'
    },
    {
      from: './src/front/static/vendor',
      to: './vendor'
    },
    {
      from: './src/front/static/js',
      to: './js'
    }
    ]),

  ]
};

