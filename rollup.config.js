import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default [{
    input: 'src/native.smooth.scroll.js',
    output: [
        {
            file: 'dist/native.smooth.scroll.umd.js',
            format: 'umd',
            name: 'window',
            extend: true,
            plugins: [
                getBabelOutputPlugin({
                    allowAllFormats: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-env',
                    ]
                })
            ]
        },
        {
            file: 'dist/native.smooth.scroll.umd.min.js',
            format: 'umd',
            name: 'window',
            extend: true,
            plugins: [
                getBabelOutputPlugin({
                    allowAllFormats: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-env',
                    ]
                }),
                terser()
            ]
        },
    ],
}];