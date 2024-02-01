import io from 'socket.io-client';

export var socket = null;
export const initSocket = () => {
    if (socket)
        return socket;

    socket = io(`https://meeting-rtc-7dec006dda62.herokuapp.com`, {
        path: "/bridge/",
        transports: ['websocket']
    });
    return socket;
}
