import {overlayElement, overlayStyleElement} from './overlay';

enum TracingMode {
    Radar = 0,
    Map = 1
}

const MAX_MONKEYS_COUNT: number = 32;

let updateInterval: number;
const mapElement: HTMLElement = overlayElement.querySelector('#map')!;
const radarElement: HTMLElement = overlayElement.querySelector('#radar')!;
const tracingPoints: { map: HTMLElement[], radar: HTMLElement[] } = {
    map: [], radar: []
};
let tracingMode: TracingMode = TracingMode.Radar;

class MyPlugin implements IPlugin {
    onEnable(): void {
        updateInterval = setInterval((): void => this.onUpdate(), 1000 / 2);

        for (let i: number = 0; i < MAX_MONKEYS_COUNT; i++) {
            tracingPoints.map.push(mapElement.appendChild(
                <div class='tracing-point'>
                    <span>{i}</span>
                </div>
            ));
            tracingPoints.radar.push(radarElement.appendChild(
                <div class='tracing-point'>
                    <span>{i}</span>
                </div>
            ));
        }

        window.addEventListener("keyup", (event: KeyboardEvent): void => {
            if (event.keyCode == 77) {
                if (tracingMode != TracingMode.Radar) {
                    mapElement.classList.add('hidden');

                    if (radarElement.classList.contains('hidden'))
                        radarElement.classList.remove('hidden');
                }

                tracingMode = TracingMode.Radar;
            }
        });
        window.addEventListener("keydown", (event: KeyboardEvent): void => {
            if (event.keyCode == 77) {
                if (tracingMode != TracingMode.Map) {
                    radarElement.classList.add('hidden');

                    if (mapElement.classList.contains('hidden'))
                        mapElement.classList.remove('hidden');
                }

                tracingMode = TracingMode.Map;
            }
        });
    }

    onHeadLoaded(): void {
        document.head.appendChild(overlayStyleElement);
    }

    onBodyLoaded(): void {
        document.body.appendChild(overlayElement);
    }

    onUpdate(): void {
        for (let i: number = 0; i < MAX_MONKEYS_COUNT; i++) {
            const monkeyPosition: Vector3 | null = MonkeySuite1.GetMonkeyPosition(i);

            if (!monkeyPosition)
                continue;

            const position: Vector2 = {
                x: monkeyPosition.x, y: monkeyPosition.z
            }

            let tracingPointElement: HTMLElement;

            if (tracingMode == TracingMode.Map) {
                tracingPointElement = tracingPoints.map[i];

                position.x = Math.floor(position.x / 1.659);
                position.y = 924 - Math.floor(position.y / 1.659);
            } else {
                continue;

                // tracingPointElement = tracingPoints.radar[i];
                //
                // position.x = 135 + position.x - player.position.x;
                // position.y = 136 - position.y + player.position.z;
            }

            tracingPointElement.style.top = `${position.y}px`;
            tracingPointElement.style.left = `${position.x}px`;
        }
    }

    onDisable(): void {
        clearInterval(updateInterval);

        if (document.head.contains(overlayStyleElement))
            document.head.removeChild(overlayStyleElement);

        if (document.body.contains(overlayElement))
            document.body.removeChild(overlayElement);
    }
}

registerPlugin(MyPlugin);
