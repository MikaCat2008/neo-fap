import * as suites from './suites';

declare const DEBUG: boolean;

function loadPlugin(pluginName: string, rawPlugin: string): void {
    const scope: any = {};
    scope.registerPlugin = (pluginClass: new () => IPlugin): void => {
        const plugin: IPlugin = new pluginClass();
        plugin.onEnable();
        plugins.set(pluginName, plugin);
    };
    Object.assign(scope, suites);

    if (DEBUG)
        console.log(`[NEO-FAP]: loading "${pluginName}" plugin...`);

    new Function(`const{${Object.keys(scope).join(',')}}=arguments[0];${rawPlugin}`)(scope);

    if (!plugins.has(pluginName))
        return;

    const plugin: IPlugin = plugins.get(pluginName)!;

    let headLoaded: boolean = false;
    let bodyLoaded: boolean = false;

    const observer: MutationObserver = new MutationObserver((_: MutationRecord[], observer: MutationObserver): void => {
        if (!headLoaded) {
            if (document.head) {
                headLoaded = true;

                if (plugin.onHeadLoaded)
                    plugin.onHeadLoaded();
            }
        } else if (!bodyLoaded) {
            if (document.body) {
                bodyLoaded = true;

                if (plugin.onBodyLoaded)
                    plugin.onBodyLoaded();
            }
        } else
            observer.disconnect();
    });

    let observe: boolean = false;

    if (document.head) {
        headLoaded = true;

        if (plugin.onHeadLoaded)
            plugin.onHeadLoaded();

        if (document.body) {
            bodyLoaded = true;

            if (plugin.onBodyLoaded)
                plugin.onBodyLoaded();
        } else observe = true;
    } else observe = true;

    if (observe)
        observer.observe(document.documentElement, {
            childList: true,
            subtree: false
        });
}

declare const rawPlugins: Record<string, string>;
const plugins: Map<string, IPlugin> = new Map();

const WebAssemblyMemory: any = WebAssembly.Memory;
(WebAssembly.Memory as any) = function (...data: any[]): WebAssembly.Memory {
    const instance: WebAssembly.Memory = new WebAssemblyMemory(...data);

    suites.__initWebAssemblyMemory(instance);

    if (DEBUG)
        console.log("[NEO-FAP]: WebAssemblyMemory initialized");

    if (DEBUG) {
        interface Event {
            name: string;
            data: any;
        }

        interface LoadPluginsCallbackData {
            rawPlugins: [string, string][];
        }

        interface PluginUpdatedData {
            pluginName: string;
            rawPlugin: string;
        }

        async function main(): Promise<void> {
            const client: WebSocket = new WebSocket('ws://localhost:61232');

            client.onopen = (): void => {
                client.send(JSON.stringify({
                    name: 'load-plugins',
                    data: null
                }));
            };
            client.onmessage = (message: MessageEvent): void => {
                const event: Event = JSON.parse(message.data);

                if (event.name == 'load-plugins-callback') {
                    const data: LoadPluginsCallbackData = event.data;

                    for (const [pluginName, rawPlugin] of data.rawPlugins)
                        loadPlugin(pluginName, rawPlugin);
                } else if (event.name == 'plugin-updated') {
                    const data: PluginUpdatedData = event.data;
                    const pluginName: string = data.pluginName;

                    plugins.get(pluginName)?.onDisable();

                    if (DEBUG && plugins.has(pluginName))
                        console.log(`[NEO-FAP]: unloading "${pluginName}" plugin...`);

                    loadPlugin(pluginName, data.rawPlugin);
                }
            };
        }

        void main();
    } else
        Object.keys(rawPlugins).forEach((pluginName: string): void => loadPlugin(pluginName, rawPlugins[pluginName]));

    return instance;
}
