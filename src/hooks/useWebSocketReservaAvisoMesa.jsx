import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useWebSocketReservaAvisoMesa() {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL),
      onConnect: () => {
        stompClient.subscribe("/topic/reservas", (message) => {
          const reserva = JSON.parse(message.body);
          onNuevaReserva(reserva);
        });
      },
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, []);
}
