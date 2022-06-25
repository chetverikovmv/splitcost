const path = require('path'); // подключаем path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin'); // каждый раз при сборке проекта удалять содержимое папки dist
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



module.exports = {

  entry: {
    main: './src/js/index.js' //точка входа
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //точка выхода, "path" т.к. Webpack не понимает относительные пути
    filename: 'main.js',
    publicPath: ''
  },
  // optimization: { // убрать минификацию
  //   minimize: false
  // },
  performance: { // убрать предупреждение о большом объеме файла
    hints: false
  },
  // mode: 'development', // добавили режим разработчика
  mode: 'production', // добавили режим продакшн
  devServer: {
    static: path.resolve(__dirname, './dist'), // путь, куда "смотрит" режим разработчика
    compress: true, // это ускорит загрузку в режиме разработки
    port: 8080, // порт, чтобы открывать сайт по адресу localhost:8080, но можно поменять порт
    open: true, // сайт будет открываться сам при запуске npm run dev
    //hot: true
  },
  module: {
    rules: [ // rules — это массив правил
      // добавим в него объект правил для бабеля
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        // регулярное выражение, которое ищет все js файлы
        test: /\.js$/,
        // при обработке этих файлов нужно использовать babel-loader
        use: 'babel-loader',
        // исключает папку node_modules, файлы в ней обрабатывать не нужно
        exclude: '/node_modules/'
      },
      // добавили правило для обработки файлов
      {
        // регулярное выражение, которое ищет все файлы с такими расширениями
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource'
      },
      {

        test: /\.(scss|css)$/,

        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          // Добавьте postcss-loader
          'postcss-loader', 'sass-loader'
        ]
      }


    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // путь к файлу index.html
      scriptLoading: "blocking" // убираем "оптимизацию" defer
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(), // подключение плагина для объединения файлов

  ]
}