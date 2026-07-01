// socketReserva.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const stompClient = new Client({
  webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL),
  reconnectDelay: 2000, // reconecta automáticamente si se pierde la conexión
});

// Conectar solo una vez
stompClient.activate();

export default stompClient;
