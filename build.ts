import {Dirent} from 'fs';
import {RawData, WebSocket, WebSocketServer} from 'ws';
import fs from 'fs/promises';
import path from 'path';
import esbuild from 'esbuild';
import {fileURLToPath} from 'url';

const DEBUG: boolean = process.argv.includes('--debug');
const JSX_FACTORY_PATH: string = path.resolve('./src/jsx-factory.ts');

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

async function build(): Promise<void> {
    const outFolder: string = DEBUG ? 'dist/debug' : 'dist/release';
    const entries: Dirent[] = await fs.readdir('plugins', {withFileTypes: true});
    const plugins: [string, string][] = await Promise.all(
        entries
            .filter((entry: Dirent<string>): boolean => entry.isDirectory())
            .map(async (entry: Dirent<string>): Promise<[string, string]> => {
                const pluginPath: string = path.join('plugins', entry.name);
                const plugin: any = JSON.parse(
                    (await fs.readFile(path.join(pluginPath, 'plugin.json'))).toString()
                );

                return [plugin.name, path.resolve(pluginPath, plugin.entryPoint)];
            })
    );

    await esbuild.build({
        footer: {
            js: DEBUG ? '' : 'rawPlugins={};' + (await Promise.all(
                plugins.map(async ([pluginName, entryPoint]: [string, string]): Promise<string> => {
                    const result: esbuild.BuildResult = await esbuild.build({
                        entryPoints: [entryPoint],
                        bundle: true,
                        format: 'esm',
                        target: ['esnext'],
                        minify: true,
                        inject: [JSX_FACTORY_PATH],
                        jsxFactory: 'createElement',
                        treeShaking: true,
                        legalComments: 'none',
                        sourcemap: false,
                        write: false,
                        define: {
                            DEBUG: DEBUG ? 'true' : 'false'
                        }
                    });

                    if (!result.outputFiles)
                        throw new Error('где входные точки сьебастиян');

                    const rawPluginCode: string = result.outputFiles[0].text.trim()
                        .replaceAll('\\', '\\\\')
                        .replaceAll('`', '\\`')
                        .replaceAll('$', '\\$');

                    return `rawPlugins['${pluginName}']=\`(()=>{${rawPluginCode}})()\``;
                })
            )).join(';')
        },
        entryPoints: ['src/index.tsx'],
        outfile: path.join(outFolder, 'index.js'),
        bundle: true,
        format: 'esm',
        target: ['esnext'],
        minify: true,
        inject: [JSX_FACTORY_PATH],
        jsxFactory: 'createElement',
        treeShaking: true,
        legalComments: 'none',
        sourcemap: false,
        define: {
            DEBUG: DEBUG ? 'true' : 'false'
        }
    });

    await fs.copyFile(
        path.resolve(__dirname, 'manifest.json'),
        path.resolve(__dirname, path.join(outFolder, 'manifest.json'))
    );

    if (DEBUG) {
        interface Event {
            name: string;
            data: any;
        }

        const ws: typeof import('ws') = await import('ws');
        const rawPlugins: Map<string, string> = new Map();
        const server: WebSocketServer = new ws.WebSocketServer({port: 61232});
        server.on('connection', async (client: WebSocket): Promise<void> => {
            client.on('message', (message: RawData): void => {
                const event: Event = JSON.parse(message.toString());

                if (event.name == 'load-plugins')
                    client.send(JSON.stringify({
                        name: 'load-plugins-callback',
                        data: {
                            rawPlugins: Array.from(rawPlugins)
                        }
                    }));
            });
        });

        await Promise.all(
            plugins.map(async ([pluginName, entryPoint]: [string, string]): Promise<void> => {
                const context: esbuild.BuildContext = await esbuild.context({
                    entryPoints: [entryPoint],
                    bundle: true,
                    format: 'esm',
                    target: ['esnext'],
                    minify: true,
                    inject: [JSX_FACTORY_PATH],
                    jsxFactory: 'createElement',
                    treeShaking: true,
                    legalComments: 'none',
                    sourcemap: false,
                    write: false,
                    define: {
                        DEBUG: DEBUG ? 'true' : 'false'
                    },
                    plugins: [{
                        name: 'chrome-extension',
                        setup(build: esbuild.PluginBuild): void {
                            build.onEnd((result: esbuild.BuildResult): void => {
                                const rawPlugin: string = `(()=>{${result.outputFiles![0].text.trim()}})()`;
                                rawPlugins.set(pluginName, rawPlugin);

                                server.clients.forEach((client: WebSocket): void => {
                                    client.send(JSON.stringify({
                                        name: 'plugin-updated',
                                        data: {pluginName, rawPlugin}
                                    }));
                                });
                            });
                        }
                    }]
                });

                await context.watch();
            })
        );
    }
}

build();
