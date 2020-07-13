const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/app.js', // if multiple {'name':'path',...}
	output: {
		filename: 'app.js', // if multiple entries '[name].js'
		path: path.resolve(__dirname, 'assets', 'scripts'),
		publicPath: 'assets/scripts/'
	},
	devServer: {
		// where my root html file can be found
		contentBase: './'
	},
	// debuging setting Source-webpack-.
	devtool: 'cheap-module-eval-source-map',
	// babel rules
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }]
						]
					}
				}
			}
		]
	},
	plugins: [new CleanPlugin.CleanWebpackPlugin()]
};
