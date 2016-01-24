var js_src = './js/src/';
var js_dist = './js/dist/';

module.exports = {
    entry: {
        'index': js_src + 'index.jsx',
    }
    ,
    output: {
        filename: '[name].dist.js',
        path: js_dist
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loaders: ['babel?presets[]=react,presets[]=es2015'],
            },
        ]
    },
    /*externals: {
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        'react': 'React',
        'react-dom': 'ReactDOM',
    },*/
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
