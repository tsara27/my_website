'use strict';
const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const srcPath = path.resolve(__dirname, "src");
const bundlePath = path.resolve(__dirname, "dist");
const fs = require('fs');
const prod = process.argv.indexOf('-p') !== -1;
const js_output_template = prod ? "javascripts/[name]-[hash].js" : "javascripts/[name].js";


module.exports = {
  entry: {
    main: srcPath + "/index.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        },
        sideEffects: false
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [srcPath, './node_modules']
  },
  output: {
    path: bundlePath,
    filename: js_output_template
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    }),
    function () {
      // delete previous outputs
      this.plugin("compile", function () {
        let basepath = __dirname + "/dist";
        let paths = ["/javascripts"];

        for (let x = 0; x < paths.length; x++) {
          const asset_path = basepath + paths[x];

          fs.readdir(asset_path, function (err, files) {
            if (files === undefined) {
              return;
            }

            for (let i = 0; i < files.length; i++) {
              fs.unlinkSync(asset_path + "/" + files[i]);
            }
          });
        }
      });
    }
  ]
};
