const overlayElement: HTMLElement = <div id='overlay'>
    <div id='tracing-points'>
        <div class='tracing-field' id='map'></div>
        <div class='tracing-field' id='radar'></div>
    </div>
</div>;

const overlayStyleElement: HTMLElement = <style> {`
    #overlay {
        position: absolute;

        width: 100vw;
        height: 100vh;
    }

    .tracing-field {
        position: absolute;

        border: 2px solid red;
        border-radius: 4px;

        overflow: hidden;
    }

    .tracing-field.hidden {
        display: none;
    }

    #map {
        width: 924px;
        height: 924px;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #radar {
        width: 272px;
        height: 270px;

        right: 18px;
        bottom: 18px;
    }

    .tracing-point {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;

        width: 20px;
        font-size: 14px;
        height: 20px;

        border: 2px solid var(--point-rgb);
        border-radius: 50%;

        color: white;
        box-shadow: 0 0 10px var(--point-rgba);
        background-color: rgba(0, 0, 0, 0.25);

        transform: translate(-50%, -50%);
    }
`} </style>;

export {
    overlayElement,
    overlayStyleElement
}
