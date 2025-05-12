const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require("webpack")
module.exports = {
  mode: "production",
  entry: './react/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      
    ],
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.MONGODB_URI': JSON.stringify(process.env.MONGODB_URI),
      'process.env.LOCATION_KEY': JSON.stringify(process.env.LOCATION_KEY),
      'process.env.RECAPTCHA_KEY': JSON.stringify(process.env.RECAPTCHA_KEY),
      'process.env.RECAPTCHA_SITEKEY': JSON.stringify(process.env.RECAPTCHA_SITEKEY),
      'process.env.SESSION_SECRET_KEY': JSON.stringify(process.env.SESSION_SECRET_KEY),
      'process.env.SMTP_PASS': JSON.stringify(process.env.SMTP_PASS),
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
      'process.env.WEBSOCKET_URL': JSON.stringify(process.env.WEBSOCKET_URL),

    })
  ],
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin(),
  //   ],
  // },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};