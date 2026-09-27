// var client = {
//     managers: {
//         ui: {
//             overlayElement: null,
//
//             onEnable: () => {
//                 const observer: MutationObserver = new MutationObserver((mutations, obs) => {
//                     if (document.head)
//                         mUi.injectOverlayElement();
//                 });
//
//                 observer.observe(document.documentElement, {
//                     childList: true,
//                     subtree: false
//                 });
//             },
//
//             injectStyles: styles => {
//                 var styleElement = document.createElement("style");
//                 styleElement.innerHTML = styles;
//
//                 document.head.appendChild(styleElement);
//             },
//             injectOverlayElement: () => {
//                 var overlayElement = document.createElement("div");
//                 overlayElement.id = "overlay";
//
//                 mUi.injectStyles(`
//                     #overlay
//                     {
//                         position: absolute;
//
//                         width: 100vw;
//                         height: 100vh;
//                     }
//                 `);
//                 mUi.overlayElement = overlayElement;
//                 document.body.appendChild(overlayElement);
//             }
//         },
//         ui_tracing: {
//             mode: "",
//             mapElement: null,
//             radarElement: null,
//             targetPoints: [],
//             tracingPoints: [],
//             tracingElement: null,
//             tracingPointsElement: null,
//
//             onEnable: () => {
//                 const observer: MutationObserver = new MutationObserver((mutations, obs) => {
//                     if (document.head)
//                         mUi_tracing.injectTracingElement();
//                     if (document.body) {
//                         mUi_tracing.setTracingMode("radar");
//
//                         for (var i = 0; i < mGame.monkiesCount; i++)
//                             mUi_tracing.createTracingPoint(i, "enemy");
//                     }
//                 });
//
//                 observer.observe(document.documentElement, {
//                     childList: true,
//                     subtree: false
//                 });
//
//                 window.addEventListener("keyup", event => {
//                     if (event.keyCode == 77) mUi_tracing.setTracingMode("radar");
//                 });
//                 window.addEventListener("keydown", event => {
//                     if (event.keyCode == 77) mUi_tracing.setTracingMode("map");
//                 });
//             },
//             onUpdate: () => {
//                 // if (!mMemory.playerInitialized) return;
//
//                 var player = mGame.player,
//                     monkies = mGame.monkies;
//
//                 for (var i = 0; i < monkies.length; i++) {
//                     var monkey = monkies[i],
//                         tracingPoint = mUi_tracing.tracingPoints[i];
//
//                     tracingPoint.position.x = monkey.position.x;
//                     tracingPoint.position.y = monkey.position.z;
//
//                     // if (monkey.isAlive && monkey.isConnected && monkey.isSpawned)
//                     //     tracingPoint.element.style.opacity = `${1 - (mGame.ticks - monkey.lastActiveTick) / 1000}`;
//                     // else
//                     //     tracingPoint.element.style.opacity = 0;
//
//                     mUi_tracing.updateTracingPointElement(i);
//                 }
//             },
//
//             injectTracingElement: () => {
//                 var tracingElement = document.createElement("div");
//                 tracingElement.id = "tracing";
//                 tracingElement.innerHTML = `
//                     <div class="map map-bounds"></div>
//                     <div class="radar radar-bounds"></div>
//                     <div class="tracing-points"></div>
//                 `;
//
//                 mUi.injectStyles(`
//                     #overlay #tracing .map,
//                     #overlay #tracing .radar
//                     {
//                         position: absolute;
//
//                         border: 2px solid red;
//                         border-radius: 4px;
//                     }
//
//                     #overlay #tracing .map.hidden,
//                     #overlay #tracing .radar.hidden
//                     {
//                         display: none;
//                     }
//
//                     #overlay #tracing .map-bounds
//                     {
//                         width: 924px;
//                         height: 924px;
//
//                         top: 50%;
//                         left: 50%;
//                         transform: translate(-50%, -50%);
//                     }
//
//                     #overlay #tracing .radar-bounds
//                     {
//                         width: 272px;
//                         height: 270px;
//
//                         right: 18px;
//                         bottom: 18px;
//                     }
//
//                     #overlay .tracing-points
//                     {
//                         position: absolute;
//
//                         overflow: hidden;
//                     }
//
//                     #overlay .tracing-points .tracing-point
//                     {
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                         position: absolute;
//
//                         width: 20px;
//                         height: 20px;
//
//                         border: 2px solid var(--point-rgb);
//                         border-radius: 50%;
//
//                         color: white;
//                         box-shadow: 0 0 10px var(--point-rgba);
//                         background-color: rgba(0, 0, 0, 0.25);
//
//                         transform: translate(-50%, -50%);
//                     }
//
//                     #overlay .tracing-points .tracing-point .monkey-id
//                     {
//                         font-size: 14px;
//                     }
//                 `);
//                 mUi.overlayElement.appendChild(tracingElement);
//                 mUi_tracing.tracingElement = tracingElement;
//                 mUi_tracing.mapElement = tracingElement.querySelector(".map");
//                 mUi_tracing.radarElement = tracingElement.querySelector(".radar");
//                 mUi_tracing.tracingPointsElement = tracingElement.querySelector(".tracing-points");
//
//                 console.log("[DEBUG] mUi_tracing injected!");
//             },
//             setTracingMode: mode => {
//                 var tracingPointsElement;
//
//                 if (mode == "map") {
//                     tracingPointsElement = mUi_tracing.tracingPointsElement;
//                     tracingPointsElement.classList.add("map-bounds");
//
//                     if (tracingPointsElement.classList.contains("radar-bounds")) {
//                         tracingPointsElement.classList.remove("radar-bounds");
//                     }
//
//                     mUi_tracing.radarElement.classList.add("hidden");
//
//                     if (mUi_tracing.mapElement.classList.contains("hidden")) {
//                         mUi_tracing.mapElement.classList.remove("hidden");
//                     }
//                 } else {
//                     tracingPointsElement = mUi_tracing.tracingPointsElement;
//                     tracingPointsElement.classList.add("radar-bounds");
//
//                     if (tracingPointsElement.classList.contains("map-bounds")) {
//                         tracingPointsElement.classList.remove("map-bounds");
//                     }
//
//                     mUi_tracing.mapElement.classList.add("hidden");
//
//                     if (mUi_tracing.radarElement.classList.contains("hidden")) {
//                         mUi_tracing.radarElement.classList.remove("hidden");
//                     }
//                 }
//
//                 mUi_tracing.mode = mode;
//             },
//             createTracingPoint: (id, type) => {
//                 var tracingPointElement = document.createElement("div");
//                 tracingPointElement.classList.add("tracing-point");
//                 tracingPointElement.innerHTML = `
//                     <span class="monkey-id">${id}</span>
//                 `;
//
//                 var tracingPoint = {
//                     element: tracingPointElement,
//                     position: {x: 0, y: 0}
//                 };
//
//                 mUi_tracing.tracingPoints.push(tracingPoint);
//                 mUi_tracing.tracingPointsElement.appendChild(tracingPointElement);
//                 mUi_tracing.updateTracingPointType(id, type);
//             },
//             updateTracingPointType: (id, type) => {
//                 var rgb = "rgb(255, 255, 255)", rgba = "rgba(255, 255, 255, 0.8)",
//                     tracingPoint = mUi_tracing.tracingPoints[id];
//
//                 if (type == "team") {
//                     rgb = "rgb(0, 255, 161)";
//                     rgba = "rgba(0, 255, 161, 0.8)";
//                 } else if (type == "enemy") {
//                     rgb = "rgb(252, 255, 5)";
//                     rgba = "rgba(252, 255, 5, 0.8)";
//                 }
//                 // else if (type == "target")
//                 // {
//                 //     rgb = "rgb(255, 16, 105)";
//                 //     rgba = "rgba(255, 16, 105, 0.8)";
//                 // }
//                 // else if (type = "locked-target")
//                 // {
//                 //     rgb = "rgb(181, 0, 255)";
//                 //     rgba = "rgba(181, 0, 255, 0.8)";
//                 // }
//
//                 tracingPoint.element.style.setProperty("--point-rgb", rgb);
//                 tracingPoint.element.style.setProperty("--point-rgba", rgba);
//             },
//             updateTracingPointElement: id => {
//                 var tracingPoint = mUi_tracing.tracingPoints[id],
//                     x = tracingPoint.position.x,
//                     y = tracingPoint.position.y;
//
//                 if (mUi_tracing.mode == "radar") {
//                     return;
//
//                     var player = mGame.player;
//
//                     x = 135 + x - player.position.x;
//                     y = 136 - y + player.position.z;
//                 } else {
//                     x = Math.floor(x / 1.659);
//                     y = 924 - Math.floor(y / 1.659);
//                 }
//
//                 tracingPoint.element.style.top = `${y}px`;
//                 tracingPoint.element.style.left = `${x}px`;
//             }
//         },
//         ui_aimbot: {
//             // targetId: null,
//             // mapEnabled: false,
//             // nearestTarget: false,
//             // aimAreaElement: null,
//             // lockedTargetId: null,
//             // capturedTargetId: null,
//             // inventoryEnabled: false,
//
//             onEnable: () => {
//                 // mUi_aimbot.injectAimArea();
//
//                 // window.addEventListener("keydown", event => {
//                 //     if (event.keyCode == 9)
//                 //         mUi_aimbot.inventoryEnabled = true;
//                 //     if (event.keyCode == 77)
//                 //         mUi_aimbot.mapEnabled = true;
//                 // });
//                 // window.addEventListener("keyup", event => {
//                 //     if (event.keyCode == 9) // Tab
//                 //         mUi_aimbot.inventoryEnabled = false;
//                 //     if (event.keyCode == 77) // M
//                 //         mUi_aimbot.mapEnabled = false;
//
//                 //     if (event.keyCode == 67) // C
//                 //     {
//                 //         if (mUi_aimbot.targetId != null)
//                 //             mUi_tracing.updateTracingPointType(mUi_aimbot.targetId, "enemy");
//
//                 //         mUi_aimbot.nearestTarget = !mUi_aimbot.nearestTarget;
//                 //         mUi_aimbot.lockedTargetId = null;
//
//                 //         if (mUi_aimbot.nearestTarget)
//                 //             console.log(`[DEBUG] aimbot.nearestTarget enabled`);
//                 //         else
//                 //             console.log(`[DEBUG] aimbot.nearestTarget disabled`);
//                 //     }
//                 //     if (event.keyCode == 66) // B
//                 //     {
//                 //         if (mUi_aimbot.targetId != null)
//                 //             mUi_tracing.updateTracingPointType(mUi_aimbot.targetId, "enemy");
//
//                 //         if (mUi_aimbot.lockedTargetId == null)
//                 //             mUi_aimbot.lockedTargetId = mUi_aimbot.capturedTargetId;
//                 //         else
//                 //             mUi_aimbot.lockedTargetId = null;
//
//                 //         mUi_aimbot.nearestTarget = false;
//
//                 //         console.log(`[DEBUG] aimbot.targetId = ${mUi_aimbot.targetId}`);
//                 //     }
//                 // });
//             },
//             onUpdate: () => {
//                 // if (
//                 //     !mMemory.playerInitialized ||
//                 //     mUi_aimbot.inventoryEnabled ||
//                 //     mUi_aimbot.mapEnabled
//                 // ) return;
//
//                 // var monkies = mGame.monkies, targetId = null;
//
//                 // mUi_aimbot.updateCapturedTargetId();
//                 // mUi_aimbot.updateAimArea();
//
//                 // if (mUi_aimbot.lockedTargetId != null)
//                 // {
//                 //     var monkey = monkies[mUi_aimbot.lockedTargetId];
//
//                 //     if (!monkey.isAlive || !monkey.isConnected || !monkey.isSpawned)
//                 //         mUi_aimbot.lockedTargetId = null;
//
//                 //     targetId = mUi_aimbot.lockedTargetId;
//                 // }
//                 // else if (mUi_aimbot.nearestTarget)
//                 // {
//                 //     var camera = mGame.camera;
//
//                 //     filteredMonkies = monkies
//                 //         .filter(monkey => monkey.isAlive && monkey.isConnected && monkey.isSpawned);
//
//                 //     if (filteredMonkies.length != 0)
//                 //     {
//                 //         targetId = filteredMonkies
//                 //             .map(
//                 //                 monkey => ({
//                 //                     id: monkey.id,
//                 //                     value: mMath.vectorDistance(camera.position, monkey.position)
//                 //                 })
//                 //             )
//                 //             .reduce(
//                 //                 (min, obj) => obj.value < min.value ? obj : min
//                 //             ).id;
//                 //     }
//                 // }
//
//                 // if (mUi_aimbot.targetId != null && mUi_aimbot.targetId != targetId)
//                 // mUi_tracing.updateTracingPointType(mUi_aimbot.targetId, "enemy");
//
//                 // if (targetId == null)
//                 //     return mUi_aimbot.targetId = null;
//
//                 // if (mUi_aimbot.nearestTarget)
//                 //     mUi_tracing.updateTracingPointType(targetId, "target");
//                 // else
//                 //     mUi_tracing.updateTracingPointType(targetId, "locked-target");
//
//                 // mUi_aimbot.targetId = targetId;
//                 // mUi_aimbot.lookAtPosition(monkies[targetId].position);
//             },
//
//             // injectAimArea: () => {
//             //     var aimAreaElement = document.createElement("div");
//             //     aimAreaElement.id = "aim-area";
//
//             //     mUi.injectStyles(`
//             //         #overlay #aim-area
//             //         {
//             //             position: absolute;
//
//             //             top: 50%;
//             //             left: 50%;
//
//             //             transform: translate(-50%, -50%);
//             //         }
//
//             //         #overlay #aim-area .white-scope
//             //         {
//             //             width: 140px;
//             //             height: 140px;
//
//             //             border: 2px solid var(--aim-area-rgb);
//             //             border-radius: 50%;
//
//             //             box-shadow: 0 0 16px 4px var(--aim-area-rgba);
//             //         }
//
//             //         #overlay #aim-area .yellow-scope
//             //         {
//             //             width: 140px;
//             //             height: 140px;
//             //         }
//
//             //         #overlay #aim-area .yellow-scope .line
//             //         {
//             //             position: absolute;
//
//             //             width: 173px;
//             //             height: 2px;
//
//             //             background-color: var(--aim-area-rgb);
//             //             box-shadow: 0 0 16px 4px var(--aim-area-rgba);
//             //         }
//
//             //         #overlay #aim-area .red-scope
//             //         {
//             //             width: 140px;
//             //             height: 140px;
//             //         }
//
//             //         #overlay #aim-area .red-scope .line-0
//             //         {
//             //             position: absolute;
//
//             //             width: 20px;
//             //             height: 3px;
//
//             //             background-color: var(--aim-area-rgb);
//             //             box-shadow: 0 0 16px 4px var(--aim-area-rgba);
//             //         }
//
//             //         #overlay #aim-area .red-scope .line-1
//             //         {
//             //             position: absolute;
//
//             //             width: 40px;
//             //             height: 6px;
//
//             //             background-color: var(--aim-area-rgb);
//             //             box-shadow: 0 0 16px 4px var(--aim-area-rgba);
//             //         }
//
//             //         #overlay #aim-area .purple-scope
//             //         {
//             //             width: 140px;
//             //             height: 140px;
//
//             //             transform: rotate(45deg);
//             //         }
//
//             //         #overlay #aim-area .purple-scope .line-0
//             //         {
//             //             position: absolute;
//
//             //             width: 20px;
//             //             height: 3px;
//
//             //             background-color: var(--aim-area-rgb);
//             //             box-shadow: 0 0 16px 4px var(--aim-area-rgba);
//             //         }
//
//             //         #overlay #aim-area .purple-scope .line-1
//             //         {
//             //             position: absolute;
//
//             //             width: 40px;
//             //             height: 6px;
//
//             //             background-color: var(--aim-area-rgb);
//             //             box-shadow: 0 0 16px 4px var(--aim-area-rgba);
//             //         }
//             //     `);
//             //     mUi.overlayElement.appendChild(aimAreaElement);
//             //     mUi_aimbot.aimAreaElement = aimAreaElement;
//
//             //     console.log("[DEBUG] mUi_aimbot injected!");
//             // },
//             // lookAtPosition: position => {
//             //     var camera = mGame.camera,
//             //         player = mGame.player,
//             //         rotationX = Math.atan2(
//             //             position.z - camera.position.z,
//             //             position.x - camera.position.x
//             //         ) + 3 * Math.PI / 2,
//             //         rotationY = Math.atan2(
//             //             position.y - camera.position.y,
//             //             mMath.vectorDistanceXZ(position, camera.position)
//             //         ),
//             //         differenceX = mMath.angleDistance(player.rotation.x, rotationX),
//             //         differenceY = rotationY - player.rotation.y;
//
//             //     mEvents.moveMouse(
//             //         mMath.clamp(-differenceX / 6.280670166015625 * 1000, -100, 100),
//             //         mMath.clamp(-differenceY / 1.560791015625 * 1000, -100, 100)
//             //     );
//             // },
//             createTracingPoint: id => {
//                 var tracingPointElement = document.createElement("div");
//                 tracingPointElement.classList.add("tracing-point");
//                 tracingPointElement.innerHTML = `
//                     <span class="monkey-id">${id}</span>
//                 `;
//
//                 var tracingPoint = {
//                     element: tracingPointElement
//                 };
//
//                 mUi_aimbot.tracingPoints[id] = tracingPoint;
//                 mUi_aimbot.tracingPointsElement.appendChild(tracingPointElement);
//             },
//             deleteTracingPoint: id => {
//                 var tracingPoint = mUi_aimbot.tracingPoints[id];
//
//                 mUi_aimbot.tracingPointsElement.removeChild(tracingPoint.element);
//                 delete mUi_aimbot.tracingPoints[id];
//             },
//             updateTracingPoints: ids => {
//                 var currentIds = Object.keys(mUi_aimbot.tracingPoints).map(id => Number(id));
//
//                 for (var i = 0; i < ids.length; i++) {
//                     var id = ids[i];
//
//                     if (!currentIds.includes(id))
//                         mUi_aimbot.createTracingPoint(id);
//                 }
//
//                 for (var i = 0; i < currentIds.length; i++) {
//                     var id = currentIds[i];
//
//                     if (!ids.includes(id))
//                         mUi_aimbot.deleteTracingPoint(id);
//                 }
//             },
//             // updateCapturedTargetId: () => {
//             //     var camera = mGame.camera,
//             //         monkies = mGame.monkies,
//             //         targetId, [yaw, pitch] = mGame.getYawPitch();
//
//             //     for (var i = 0; i < monkies.length; i++)
//             //     {
//             //         var monkey = monkies[i];
//
//             //         if (!monkey.isAlive || !monkey.isConnected) continue;
//
//             //         var position = mMath.projectPositionOnScreen(
//             //                 camera.position,
//             //                 monkey.position,
//             //                 yaw, pitch,
//             //                 window.innerWidth, window.innerHeight, 1
//             //             );
//
//             //         if (position == null) continue;
//
//             //         var distance = Math.sqrt(
//             //                 Math.pow(position[0] - window.innerWidth / 2, 2) +
//             //                 Math.pow(position[1] - window.innerHeight / 2, 2)
//             //             );
//
//             //         if (distance < 70)
//             //         {
//             //             targetId = i;
//
//             //             break
//             //         };
//             //     }
//
//             //     mUi_aimbot.capturedTargetId = targetId;
//             // },
//             // updateAimArea: () => {
//             //     var rgb, rgba, scopeHTML;
//
//             //     if (mUi_aimbot.nearestTarget)
//             //     {
//             //         rgb = "rgb(255, 16, 105)";
//             //         rgba = "rgba(255, 16, 105, 0.8)";
//
//             //         scopeHTML = `
//             //             <div class="red-scope">
//             //                 <div class="line-0" style="
//             //                     top: -71px;
//             //                     left: -63px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: -71px;
//             //                     left: 64px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: -63px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: 64px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//
//             //                 <div class="line-0" style="
//             //                     top: -53px;
//             //                     left: 57px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: -53px;
//             //                     left: 201px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: 57px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: 201px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//
//             //                 <div class="line-1" style="
//             //                     top: -86px;
//             //                     left: 70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: -86px;
//             //                     left: -70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: -70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: 70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//
//             //                 <div class="line-1" style="
//             //                     top: -52px;
//             //                     left: 30px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: -52px;
//             //                     left: 204px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: 30px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: 204px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //             </div>
//             //         `;
//             //     }
//             //     else if (mUi_aimbot.lockedTargetId != null)
//             //     {
//             //         rgb = "rgb(181, 0, 255)";
//             //         rgba = "rgba(181, 0, 255, 0.8)";
//
//             //         scopeHTML = `
//             //             <div class="purple-scope">
//             //                 <div class="line-0" style="
//             //                     top: -71px;
//             //                     left: -63px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: -71px;
//             //                     left: 64px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: -63px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: 64px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//
//             //                 <div class="line-0" style="
//             //                     top: -53px;
//             //                     left: 57px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: -53px;
//             //                     left: 201px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: 57px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-0" style="
//             //                     top: 71px;
//             //                     left: 201px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//
//             //                 <div class="line-1" style="
//             //                     top: -86px;
//             //                     left: 70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: -86px;
//             //                     left: -70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: -70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: 70px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//
//             //                 <div class="line-1" style="
//             //                     top: -52px;
//             //                     left: 30px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: -52px;
//             //                     left: 204px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: 30px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line-1" style="
//             //                     top: 85px;
//             //                     left: 204px;
//             //                     transform: rotate(90deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //             </div>
//             //         `;
//             //     }
//             //     else if (mUi_aimbot.capturedTargetId != null)
//             //     {
//             //         rgb = "rgb(252, 255, 5)";
//             //         rgba = "rgba(252, 255, 5, 0.8)";
//
//             //         scopeHTML = `
//             //             <div class="yellow-scope">
//             //                 <div class="line" style="
//             //                     top: 25px;
//             //                     left: 96px;
//             //                     transform: rotate(60deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line" style="
//             //                     top: -5px;
//             //                     right: 77px;
//             //                     transform: rotate(-60deg) translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //                 <div class="line" style="
//             //                     top: 50px;
//             //                     transform: translate(calc(70px - 50%), calc(70px - 50%));
//             //                 "></div>
//             //             </div>
//             //         `;
//             //     }
//             //     else
//             //     {
//             //         rgb = "rgb(255, 255, 255)";
//             //         rgba = "rgba(255, 255, 255, 0.8)";
//
//             //         scopeHTML = `
//             //             <div class="white-scope"></div>
//             //         `;
//             //     }
//
//             //     mUi_aimbot.aimAreaElement.style.setProperty("--aim-area-rgb", rgb);
//             //     mUi_aimbot.aimAreaElement.style.setProperty("--aim-area-rgba", rgba);
//             //     mUi_aimbot.aimAreaElement.innerHTML = scopeHTML;
//             // }
//         },
//         game: {
//             // ticks: 0,
//             // camera: null,
//             // player: null,
//             monkies: null,
//             monkiesCount: 32,
//
//             onEnable: () => {
//                 // mGame.camera = {
//                 //     position: { x: 0, y: 0, z: 0 }
//                 // }
//                 // mGame.player = {
//                 //     position: {
//                 //         x: 0,
//                 //         y: 0,
//                 //         z: 0
//                 //     },
//                 //     acceleration: {
//                 //         x: 0,
//                 //         y: 0,
//                 //         z: 0
//                 //     },
//                 //     rotation: {
//                 //         x: 0,
//                 //         y: 0
//                 //     }
//                 // }
//                 mGame.setMonkiesCount(mGame.monkiesCount);
//             },
//             onUpdate: () => {
//                 if (!mMemory.initialized)
//                     return;
//
//                 // mGame.updatePlayer();
//                 // mGame.updateCamera();
//                 mGame.updateMonkies();
//             },
//
//             setMonkiesCount: count => {
//                 mGame.monkies = [];
//                 mGame.monkiesCount = count;
//
//                 for (var i = 0; i < count; i++)
//                     mGame.monkies.push({
//                         // id: i,
//                         // x7C: 0,
//                         // isAlive: true,
//                         position: {
//                             x: 0,
//                             y: 0,
//                             z: 0
//                         },
//                         acceleration: {
//                             x: 0,
//                             y: 0,
//                             z: 0
//                         },
//                         rotation: {
//                             x: 0,
//                             y: 0
//                         },
//                         health: 0,
//                         mana: 0
//                         // isConnected: true,
//                         // lastActiveTick: mGame.ticks
//                     });
//             },
//             // updateCamera: () => {
//             //     var camera = mGame.camera,
//             //         cameraData = mMemory.getCameraData();
//
//             //     camera.position.x = cameraData.position.x;
//             //     camera.position.y = cameraData.position.y;
//             //     camera.position.z = cameraData.position.z;
//             // },
//             // updatePlayer: () => {
//             //     const player = mGame.player;
//             //     const playerData = mMemory.getPlayerData();
//
//             //     player.position.x = playerData.position.x;
//             //     player.position.y = playerData.position.y;
//             //     player.position.z = playerData.position.z;
//             //     player.rotation.x = playerData.rotation.x;
//             //     player.rotation.y = playerData.rotation.y;
//             // },
//             updateMonkies: () => {
//                 const monkies = mGame.monkies;
//                 const monkiesData = mMemory.getMonkiesData(mGame.monkiesCount);
//
//                 for (var i = 0; i < mGame.monkiesCount; i++) {
//                     const monkey = monkies[i];
//                     const monkeyData = monkiesData[i];
//
//                     // if (monkey.x7C != monkeyData.x7C)
//                     // {
//                     //     monkey.x7C = monkeyData.x7C;
//                     //     monkey.isConnected = true;
//                     //     monkey.lastActiveTick = mGame.ticks;
//                     // }
//                     // else if ((mGame.ticks - monkey.lastActiveTick) > 1000)
//                     // {
//                     //     monkey.isConnected = false;
//                     // }
//
//                     // if (monkeyData.health < 0 || monkeyData.health > 100)
//                     // {
//                     //     monkey.isConnected = false;
//                     // }
//
//                     // monkey.isAlive = monkeyData.health != 0;
//                     monkey.position.x = monkeyData.position.x;
//                     monkey.position.y = monkeyData.position.y;
//                     monkey.position.z = monkeyData.position.z;
//                     monkey.acceleration.z = monkeyData.acceleration.x;
//                     monkey.acceleration.y = monkeyData.acceleration.y;
//                     monkey.acceleration.z = monkeyData.acceleration.z;
//                     // monkey.isSpawned = monkeyData.isSpawned;
//                     monkey.health = monkeyData.health;
//                     monkey.mana = monkeyData.mana;
//                 }
//
//                 // mGame.ticks++;
//             },
//
//             getYawPitch: () => {
//                 const rotation = mGame.player.rotation;
//
//                 return [
//                     rotation.x < 3.14 ? rotation.x : rotation.x - 6.280670166015625,
//                     rotation.y / 1.56 * 1.47
//                 ];
//             }
//         },
//         math: {
//             clamp: (value, min, max) => {
//                 return Math.max(min, Math.min(value, max))
//             },
//             angleDistance: (a1, a2) => {
//                 return (a2 - a1 + Math.PI) % (2 * Math.PI) - Math.PI;
//             },
//             vectorToMat: vec => {
//                 return [vec.x, vec.y, vec.z];
//             },
//             vectorSub: (v1, v2) => {
//                 return {
//                     x: v1.x - v2.x,
//                     y: v1.y - v2.y,
//                     z: v1.z - v2.z
//                 }
//             },
//             vectorDistance: (v1, v2) => {
//                 return Math.sqrt(
//                     Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2) + Math.pow(v1.z - v2.z, 2)
//                 )
//             },
//             vectorDistanceXY: (v1, v2) => {
//                 return Math.sqrt(
//                     Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2)
//                 )
//             },
//             vectorDistanceXZ: (v1, v2) => {
//                 return Math.sqrt(
//                     Math.pow(v1.x - v2.x, 2) + Math.pow(v1.z - v2.z, 2)
//                 )
//             },
//             rotationX: alpha => {
//                 return [
//                     [Math.cos(alpha), 0, Math.sin(alpha)],
//                     [0, 1, 0],
//                     [-Math.sin(alpha), 0, Math.cos(alpha)]
//                 ]
//             },
//             rotationY: alpha => {
//                 return [
//                     [1, 0, 0],
//                     [0, Math.cos(alpha), -Math.sin(alpha)],
//                     [0, Math.sin(alpha), Math.cos(alpha)]
//                 ]
//             },
//             matToVector: mat => {
//                 return {x: mat[0], y: mat[1], z: mat[2]}
//             },
//             matDot3x2: (m1, m2) => {
//                 return [
//                     m1[0][0] * m2[0] + m1[0][1] * m2[1] + m1[0][2] * m2[2],
//                     m1[1][0] * m2[0] + m1[1][1] * m2[1] + m1[1][2] * m2[2],
//                     m1[2][0] * m2[0] + m1[2][1] * m2[1] + m1[2][2] * m2[2]
//                 ]
//             },
//             perspectiveProjection: (pos, focus) => {
//                 return [
//                     (pos[0] / pos[2]) * focus,
//                     (pos[1] / pos[2]) * focus
//                 ]
//             },
//             toScreenCoordinates: (pos, width, height) => {
//                 return [
//                     width / 2 * (1 + pos[0]),
//                     height / 2 * (1 - pos[1]),
//                 ]
//             },
//             projectPositionOnScreen: (cameraPos, pos, yaw, pitch, width, height, focus) => {
//                 pos = mMath.matDot3x2(
//                     mMath.rotationY(pitch),
//                     mMath.matDot3x2(
//                         mMath.rotationX(yaw),
//                         mMath.vectorToMat(mMath.vectorSub(pos, cameraPos))
//                     )
//                 );
//
//                 if (pos[2] > 0) {
//                     return mMath.toScreenCoordinates(
//                         mMath.perspectiveProjection(pos, focus), width, height
//                     );
//                 }
//             }
//         },
//         events: {
//             moveMouse: (x, y) => {
//                 var mainEvent = new PointerEvent("pointerrawupdate", {
//                     bubbles: true,
//                     cancelable: true,
//                     pointerId: 1,
//                     pointerType: "mouse"
//                 });
//                 mainEvent.getCoalescedEvents = () => [new PointerEvent("pointerrawupdate", {
//                     movementX: x,
//                     movementY: y,
//                     pointerId: 1,
//                     pointerType: "mouse",
//                     timeStamp: performance.now()
//                 })];
//
//                 document.querySelector("#game-canvas").dispatchEvent(mainEvent)
//             }
//         },
//         memory: {
//             // initialized: false,
//             // playerAddress: null,
//             // playerInitialized: false,
//             webAssemblyMemory: null,
//
//             getDataView: () => {
//                 return new DataView(mMemory.webAssemblyMemory.buffer);
//             },
//             getFloat: address => {
//                 return mMemory.getDataView().getFloat32(address, true);
//             },
//             setFloat: (address, value) => {
//                 return mMemory.getDataView().setFloat32(address, value, true);
//             },
//             getInteger: address => {
//                 return mMemory.getDataView().getInt32(address, true);
//             },
//             setInteger: (address, value) => {
//                 return mMemory.getDataView().setInt32(address, value, true);
//             },
//             // getCameraData: () => {
//             //     return {
//             //         position: {
//             //             x: mMemory.getFloat(0x1F5D40),
//             //             z: mMemory.getFloat(0x1F5D44),
//             //             y: mMemory.getFloat(0x1F5D48)
//             //         }
//             //     }
//             // },
//             // getPlayerData: () => {
//             //     return {
//             //         position: {
//             //             x: mMemory.getFloat(mMemory.playerAddress + 0x10),
//             //             y: mMemory.getFloat(mMemory.playerAddress + 0x18),
//             //             z: mMemory.getFloat(mMemory.playerAddress + 0x14)
//             //         },
//             //         rotation: {
//             //             x: mMemory.getFloat(mMemory.playerAddress + 0xD4),
//             //             y: mMemory.getFloat(mMemory.playerAddress + 0xD8)
//             //         }
//             //     }
//             // },
//             getMonkiesData: count => {
//                 const monkiesData = [];
//                 const monkiesAddress = mMemory.getInteger(0x0093E074) + 0x20;
//
//                 for (let playerId = 0; playerId < count; playerId++) {
//                     const monkeyAddress = monkiesAddress + 0xF0 * playerId;
//
//                     monkiesData.push({
//                         // x7C: mMemory.getInteger(monkeyAddress + 0x7C),
//                         position: {
//                             x: mMemory.getFloat(monkeyAddress),
//                             y: mMemory.getFloat(monkeyAddress + 0xB),
//                             z: mMemory.getFloat(monkeyAddress + 0x4)
//                         },
//                         acceleration: {
//                             x: mMemory.getFloat(monkeyAddress + 0x20),
//                             y: mMemory.getFloat(monkeyAddress + 0x28),
//                             z: mMemory.getFloat(monkeyAddress + 0x24)
//                         },
//                         rotation: {
//                             x: mMemory.getFloat(monkeyAddress + 0x50),
//                             y: mMemory.getFloat(monkeyAddress + 0x54)
//                         },
//                         // isSpawned: flags & (1 << 16) != 0,
//                         health: mMemory.getInteger(monkeyAddress + 0x88) & 0xFF,
//                         mana: mMemory.getInteger(monkeyAddress + 0x90) & 0xFF
//                     });
//                 }
//
//                 return monkiesData;
//             }
//         }
//     }
// };