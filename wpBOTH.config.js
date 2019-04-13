const path = require('path');
const nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
const {EnvironmentPlugin} = require("webpack");

const clientConfig = {
  target: "web",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname ,'build'),
    publicPath: '/',
    filename: 'bundle-client.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  plugins:[
    new webpack.EnvironmentPlugin([
      'CLOUDINARY_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'DATABASEURL',
      'GEOCODER_API_KEY'
    ])
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    host: '0.0.0.0', // Required for docker
    publicPath: '/assets/',
    historyApiFallback: true,
    contentBase: './build',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  devtool: 'inline-source-map'
}

const serverConfig = {
  target: "node",
  entry: './server.js',
  output: {
    path: path.resolve( __dirname, 'build'),
    filename: "bundle-server.js",
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  externals: [nodeExternals()],
}

module.exports = [clientConfig, serverConfig];
