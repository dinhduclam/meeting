import { useEffect, useRef } from "react";

export default function JoinPage() {
    const videoElement = useRef(null);
    const audioInputSelect = useRef(null);
    const audioOutputSelect = useRef(null);
    const videoSelect = useRef(null);
    const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

    function gotDevices(deviceInfos : any) {
        // Handles being called several times to update labels. Preserve values.
        const values = selectors.map(select => select.current.value);
        selectors.forEach(select => {
            while (select.current.firstChild) {
                select.current.removeChild(select.current.firstChild);
            }
        });
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || `microphone ${audioInputSelect.current.length + 1}`;
                audioInputSelect.current.appendChild(option);
            } else if (deviceInfo.kind === 'audiooutput') {
                option.text = deviceInfo.label || `speaker ${audioOutputSelect.current.length + 1}`;
                audioOutputSelect.current.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `camera ${videoSelect.current.length + 1}`;
                videoSelect.current.appendChild(option);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }

        selectors.forEach((select, selectorIndex) => {
            if (Array.prototype.slice.call(select.current.childNodes).some(n => n.value === values[selectorIndex])) {
                select.current.value = values[selectorIndex];
            }
        });
    }

    // Attach audio output device to video element using device/sink ID.
    function attachSinkId(element : any, sinkId : any) {
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(sinkId)
                .then(() => {
                    console.log(`Success, audio output device attached: ${sinkId}`);
                })
                .catch(error => {
                    let errorMessage = error;
                    if (error.name === 'SecurityError') {
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                    }
                    console.error(errorMessage);
                    // Jump back to first output device in the list as it's the default.
                    audioOutputSelect.current.selectedIndex = 0;
                });
        } else {
            console.warn('Browser does not support output device selection.');
        }
    }
    
    function changeAudioDestination() {
        const audioDestination = audioOutputSelect.current.value;
        attachSinkId(videoElement.current, audioDestination);
    }
    
    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoElement.current.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }
    
    function handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }
    
    function start() {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop();
            });
        }
        const audioSource = audioInputSelect.current.value;
        const videoSource = videoSelect.current.value;
        const constraints = {
            audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
            video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
    }

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
        start();
    }, [])

    return (
        <>
            <div className="select">
                <label htmlFor="audioSource">Audio input source: </label><select id="audioSource" ref={audioInputSelect} onChange={start}></select>
            </div>

            <div className="select">
                <label htmlFor="audioOutput">Audio output destination: </label><select id="audioOutput" ref={audioOutputSelect} onChange={changeAudioDestination}></select>
            </div>

            <div className="select">
                <label htmlFor="videoSource">Video source: </label><select id="videoSource" ref={videoSelect} onChange={start}></select>
            </div>

            <video id="video" ref={videoElement} playsInline autoPlay></video>
        </>
    )
}
