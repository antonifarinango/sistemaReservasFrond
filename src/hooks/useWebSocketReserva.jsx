import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useWebSocketReserva(onNuevaReserva) {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        stompClient.subscribe("/topic/reservas", (message) => {
          const reserva = JSON.parse(message.body);
          onNuevaReserva(reserva);
        });
      },
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [onNuevaReserva]);
}
