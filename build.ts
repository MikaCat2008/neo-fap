import fs from 'fs/promises';
import path from 'path';
import esbuild from 'esbuild';

async function build(): Promise<void> {
    await esbuild.build({
        entryPoints: ['src/index.ts'],
        outfile: 'dist/index.js',
        bundle: true,
        minify: false,
        format: 'esm',
        target: ['esnext'],
        sourcemap: 'inline'
    });

    await fs.copyFile(
        path.resolve(__dirname, 'manifest.json'),
        path.resolve(__dirname, 'dist/manifest.json')
    );
}

build();
