const webpack = require('webpack')
const { resolve, extname, join, basename } = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {readdirSync, statSync} = require('fs');

function readDirR(dir) {
    return statSync(dir).isDirectory()
        ? readdirSync(dir).reduce((r, f) => r.concat(readDirR(join(dir, f))), [])

        : dir;
}

const src = resolve(__dirname, 'src')
const dist = resolve(__dirname, 'dist')

let srcFiles = readDirR(src)
const pages = srcFiles
    .filter(f =>
        f.indexOf('partials') < 0 &&
        extname(f) === '.html'
    )

console.log(pages, srcFiles, srcFiles.map(f => typeof f))

module.exports = {
    entry  : resolve(src, 'index.js'),
    output: {
        path: dist,
        filename: 'script.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.html$/,
                loader: 'html-loader?interpolate'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })
            },
            {
                test: /\.(jpe?g|svg|png|gif|woff2?|eot|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        ...pages.map(page => new HtmlPlugin({
            template: page,
            filename: page.replace(src, '.')
        })),
        new ExtractTextPlugin("style.css")
    ]
}