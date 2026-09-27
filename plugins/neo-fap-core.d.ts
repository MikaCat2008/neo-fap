interface Vector2 {
    x: number;
    y: number;
}

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

const PlayerSuite1: {
    GetPosition(): Vector3 | null;

    GetRotation(): Vector2 | null;
};

const CameraSuite1: {
    GetPosition(): Vector3 | null;

    GetRotation(): Vector2 | null;
};

const MonkeySuite1: {
    GetMonkeyPosition(id: number): Vector3 | null;

    GetMonkeyAcceleration(id: number): Vector3 | null;

    GetMonkeyRotation(id: number): Vector2 | null;

    GetMonkeyHealth(id: number): number | null;

    GetMonkeyMana(id: number): number | null;
};

interface IPlugin {
    onEnable(): void;

    onHeadLoaded?(): void;

    onBodyLoaded?(): void;

    onDisable(): void;
}

function registerPlugin(pluginClass: new () => IPlugin): void;

function createElement(...args: any[]): any;

declare namespace JSX {
    interface IntrinsicElements {
        [elementName: string]: any;
    }
}