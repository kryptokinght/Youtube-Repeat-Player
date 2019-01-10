

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfigFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const webpackConfig = webpackConfigFactory('development');

const compiler = Webpack(webpackConfig);
const serverConfig = createDevServerConfig();
const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(3000, 'localhost', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(chalk.cyan('Starting the development server...\n'));
  // openBrowser(urls.localUrlForBrowser);
});