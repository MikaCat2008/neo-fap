let _dataView: DataView | null = null;
const dataView = new Proxy({}, {
    get(target: object, prop: string): any {
        if (_dataView == null || _dataView.byteLength == 0) {
            if (webAssemblyMemoryInstance == null)
                return null;
            _dataView = new DataView(webAssemblyMemoryInstance.buffer);
        }

        if (typeof (_dataView as any)[prop] == 'function')
            return (...data: any[]): any => {
                try {
                    return (_dataView as any)[prop](...data);
                } catch {
                    _dataView = new DataView(webAssemblyMemoryInstance!.buffer);

                    return null;
                }
            };
        return (_dataView as any)[prop];
    }
}) as unknown as DataView;
let webAssemblyMemoryInstance: WebAssembly.Memory | null = null;

export function __initWebAssemblyMemory(instance: WebAssembly.Memory): void {
    webAssemblyMemoryInstance = instance;
}

function getCameraAddress(): number | null {
    return dataView.getInt32(0x0, true);
}

function getPlayerAddress(): number | null {
    return dataView.getInt32(0x0, true);
}

function getMonkiesAddress(): number | null {
    return dataView.getInt32(0x0093E074, true);
}

function getMonkeyAddress(id: number): number | null {
    const monkiesAddress: number | null = getMonkiesAddress();

    if (!monkiesAddress)
        return null;

    return monkiesAddress + 0x20 + 0xF0 * id;
}

export const PlayerSuite1 = {
    GetPosition(): Vector3 | null {
        const playerAddress: number | null = getPlayerAddress();

        if (!playerAddress)
            return null;

        return {
            x: dataView.getFloat32(playerAddress, true),
            y: dataView.getFloat32(playerAddress, true),
            z: dataView.getFloat32(playerAddress, true)
        };
    },
    GetRotation(): Vector2 | null {
        const playerAddress: number | null = getPlayerAddress();

        if (!playerAddress)
            return null;

        return {
            x: dataView.getFloat32(playerAddress, true),
            y: dataView.getFloat32(playerAddress, true)
        };
    }
};

export const CameraSuite1 = {
    GetPosition(): Vector3 | null {
        const cameraAddress: number | null = getCameraAddress();

        if (!cameraAddress)
            return null;

        return {
            x: dataView.getFloat32(cameraAddress, true),
            y: dataView.getFloat32(cameraAddress, true),
            z: dataView.getFloat32(cameraAddress, true)
        };
    },
    GetRotation(): Vector2 | null {
        const cameraAddress: number | null = getCameraAddress();

        if (!cameraAddress)
            return null;

        return {
            x: dataView.getFloat32(cameraAddress, true),
            y: dataView.getFloat32(cameraAddress, true)
        };
    }
};

export const MonkeySuite1 = {
    GetMonkeyPosition(id: number): Vector3 | null {
        const monkeyAddress: number | null = getMonkeyAddress(id);

        if (!monkeyAddress)
            return null;

        return {
            x: dataView.getFloat32(monkeyAddress, true),
            y: dataView.getFloat32(monkeyAddress + 0xC, true),
            z: dataView.getFloat32(monkeyAddress + 0x4, true)
        };
    },
    GetMonkeyAcceleration(id: number): Vector3 | null {
        if (!dataView)
            return null;

        const monkeyAddress: number | null = getMonkeyAddress(id);

        if (!monkeyAddress)
            return null;

        return {
            x: dataView.getFloat32(monkeyAddress + 0x20, true),
            y: dataView.getFloat32(monkeyAddress + 0x28, true),
            z: dataView.getFloat32(monkeyAddress + 0x24, true)
        };
    },
    GetMonkeyRotation(id: number): Vector2 | null {
        const monkeyAddress: number | null = getMonkeyAddress(id);

        if (!monkeyAddress)
            return null;

        return {
            x: dataView.getFloat32(monkeyAddress + 0x50, true),
            y: dataView.getFloat32(monkeyAddress + 0x54, true)
        };
    },
    GetMonkeyHealth(id: number): number | null {
        const monkeyAddress: number | null = getMonkeyAddress(id);

        if (!monkeyAddress)
            return null;

        return dataView.getFloat32(monkeyAddress + 0x88, true) & 0xFF;
    },
    GetMonkeyMana(id: number): number | null {
        const monkeyAddress: number | null = getMonkeyAddress(id);

        if (!monkeyAddress)
            return null;

        return dataView.getFloat32(monkeyAddress + 0x90, true) & 0xFF;
    }
};
