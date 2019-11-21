'use strict';
const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const srcPath = path.resolve(__dirname, "app/assets");
const bundlePath = path.resolve(__dirname, "public/assets/");
const fs = require('fs');
const prod = process.argv.indexOf('-p') !== -1;
const js_output_template = prod ? "javascripts/[name]-[hash].js" : "javascripts/[name].js";


module.exports = {
  entry: {
    application: srcPath + "/javascripts/application.js",
    vendor_application: srcPath + "/javascripts/vendor_application.js",
    dashboard: srcPath + "/javascripts/dashboard.js",
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
    modules: [srcPath, './node_modules', '/vendor']
  },
  output: {
    path: bundlePath,
    filename: js_output_template
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
      // output the fingerprint
      this.plugin("done", function (stats) {
        let output = "ASSET_FINGERPRINT = \"" + stats.hash + "\""
        fs.writeFileSync("config/initializers/fingerprint.rb", output, "utf8");
      });
    },
    function () {
      // delete previous outputs
      this.plugin("compile", function () {
        let basepath = __dirname + "/public";
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
