import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, () => {
        stompClient.subscribe("/topic/orders", (payload) => {
            if (payload.body) {
                onMessageReceived(JSON.parse(payload.body));
            }
        });
    }, (error) => {
        console.error("WebSocket Error: ", error);
    });
};