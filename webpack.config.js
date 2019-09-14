module.exports = {
  entry: "./js/index.js",
  output: {
    path: __dirname,
    filename: "bundle-v1.0.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
};