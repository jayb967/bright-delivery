
const JavaScriptObfuscator = require('webpack-obfuscator');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const path = require('path');
const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const devMode = process.env.NODE_ENV !== 'production';

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// const defaultConfig = {
//   mode: process.env.NODE_ENV || 'development',
//   devServer: {
//     contentBase: publicDir,
//     port: 9000,
//   },
//   plugins: [
//     // new CleanWebpackPlugin({protectWebpackAssets: false}),
//     // new MiniCssExtractPlugin({
//     //   // Options similar to the same options in webpackOptions.output
//     //   // both options are optional
//     //   filename: devMode ? '[name].css' : '[name].[hash].css',
//     //   chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
//     // }),
//     new CopyPlugin([
//       { from: 'public', to: '.' },
//     ]),
//     devMode ? null : new JavaScriptObfuscator(),
//   ].filter(i => i),
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: ['babel-loader'],
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['*', '.js', '.jsx'],
//   },
// };

// module.exports = [{
//   ...defaultConfig,
//   entry: './src/App.js',
//   output: {
//     path: distDir,
//     publicPath: '/',
//     filename: 'brightDelivery.js',
//     library: 'BrightDel',
//     libraryExport: 'default',
//     libraryTarget: 'window',
//   },
// }, 
// // {
// //   ...defaultConfig,
// //   entry: './src/outputs/bookmarklet.js',
// //   output: {
// //     path: distDir,
// //     publicPath: '/',
// //     filename: 'bookmarklet.js',
// //   },
// // }
// ];


// const glob = require("glob")

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: distDir,
    publicPath: '/',
    filename: 'brightDelivery.js',
    library: 'BrightDel',
    libraryExport: 'default',
    libraryTarget: 'window',
  },
  plugins: [
    // new CleanWebpackPlugin({protectWebpackAssets: false}),
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   filename: devMode ? '[name].css' : '[name].[hash].css',
    //   chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    // }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/favicon.ico'
    }),
    new CopyPlugin([
      { from: 'public', to: '.' },
    ]),
    devMode ? null : new JavaScriptObfuscator(),
  ].filter(i => i),
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
      }
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      context: path.resolve(__dirname, 'src/context/'),
      data: path.resolve(__dirname, 'src/data/'),
      helpers: path.resolve(__dirname, 'src/helpers/'),
      theme: path.resolve(__dirname, 'src/theme/')
    }
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  }
}
