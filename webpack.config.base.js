const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const glob = require('glob')

// base config
const SRC = './src'
const DEST = './dist'
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3000

// ejs
const ejs = glob.sync(`${__dirname}/src/html/**/*.ejs`)
const templates = ejs.map((target) => {
  const regexp = new RegExp(`${__dirname}/src/html`, 'g')
  let basePath = path.dirname(target).replace(regexp, '')
  if (basePath) {
    basePath = `.${basePath}`
  } else {
    basePath = `./`
  }

  return new HtmlWebpackPlugin({
    template: target,
    filename: `${basePath}/${path.basename(target, path.extname(target))}.html`,
  })
})

module.exports = {
  // エントリーファイル
  entry: {
    'js/bundle.js': `${SRC}/javascripts/entry.js`,
    'css/bundle.css': `${SRC}/stylesheets/entry.scss`,
  },
  // 出力するディレクトリ・ファイル名などの設定
  output: {
    path: path.resolve(__dirname, DEST),
    filename: '[name]',
    publicPath: `/`,
  },
  module: {
      // 各ファイル形式ごとのビルド設定
    rules: [
      {
        test: /\.ejs$/,
        loader: 'ejs-loader?variable=data'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          compact: true,
          cacheDirectory: true,
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [ `${SRC}/stylesheets` ],
              },
            }
          ]
        })
      },
    ]
  },
  // webpack-dev-serverの設定
  devServer: {
    host: HOST,
    port: PORT,
    contentBase: DEST,
  },
  // キャシュ有効化
  cache: true,
  // 拡張子省略時のpath解決
  resolve: {
      extensions: ['.js', '.json', '*'],
      alias: {
        '@': path.join(__dirname, SRC, 'js'),
      }
  },
  plugins: [
    // style.cssを出力
    new ExtractTextPlugin('[name]'),
    ...templates
  ],
}
