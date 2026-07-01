import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useWebSocketReserva(onNuevaReserva) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = onNuevaReserva;
  }, [onNuevaReserva]);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL),
      onConnect: () => {
        stompClient.subscribe("/topic/reservas", (message) => {
          const reserva = JSON.parse(message.body);
          if (savedCallback.current) {
            savedCallback.current(reserva);
          }
        });
      },
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, []);
}
