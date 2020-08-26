// main modules
const path = require('path');

require("babel-register");

const SCRIPTS = {
  index: './src/client/index.tsx'
};

const STYLES = [
  './src/client/public/sass/normalize.sass'
];

// main config
module.exports = {
  // entry: { index: './src/client/index.tsx' },
  entry: Object.assign(SCRIPTS, { styles: STYLES }),
  output: {
    path: path.resolve(__dirname, '../dist/public'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'file-loader',
            options: {
              outputPath: 'js/',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(fbx|obj|gltf|bin)$/,
        include: [
          path.resolve(__dirname, '../src/client/public')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'models/',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(svg|gif)$/,
        include: [
          path.resolve(__dirname, '../src/client/public')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              emitFile: true,
              outputPath: 'img/',
              name: '[name]-[hash].[ext]',
              mozjpeg: {
                progressive: true,
                quality: 70
              }
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png)$/i,
        include: [
          path.resolve(__dirname, '../src/client/public')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'img/[name].[ext]'
            }
          },
          // 'webp-loader?{quality: 13}'
        ]
      },
      {
        test: /\.(mov|mp4)$/,
        include: [
          path.resolve(__dirname, '../src/client/public')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'media/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'link:href', 'video:src', 'script:src'],
            root: '.'
          }
        }
      },
      {
        test: /\.(pug|jade)$/,
        exclude: /(node_modules|bower_components)/,
        use:  [
          'html-loader',
          {
            loader: 'pug-html-loader',
            options: {
              data: {}
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            outputPath: 'fonts/'
          }
        },
      }
    ]
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, '../src/client/public/assets')
    },
    extensions: [ '.tsx', '.ts', '.js', '.jsx', '.mjs', 'sass', 'css', '*' ],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  optimization: {
    minimize: false
  }
};
