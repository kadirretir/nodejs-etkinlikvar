const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
    new Dotenv()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};