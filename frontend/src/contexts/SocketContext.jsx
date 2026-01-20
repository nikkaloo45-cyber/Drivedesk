import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// URL del backend
const SOCKET_URL = 'http://localhost:3000';

/**
 * SocketProvider - Gestisce connessione Socket.IO globale
 * 
 * Implementazione basata su:
 * - Rai [2], Capitolo 3 "Managing Connections" (pag. 45-60)
 * - Pattern Context API adattato per React
 * 
 * Ho seguito l'esempio del libro dove crea singleton connection
 * e l'ho adattato usando Context per renderlo disponibile a tutta l'app
 */
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Mi connetto solo se l'utente è loggato
    // (best practice da Rai [2] pag. 73 - "Authenticated Connections")
    if (!isAuthenticated) {
      console.log('Utente non loggato, non mi connetto al socket');
    
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    console.log('Provo a connettermi a Socket.IO...'); // debug
    
    // Socket.IO connection setup - Rai [2] pag. 45-52
    // opzioni dall'esempio "Robust Connection" del libro
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Rai pag. 52 - fallback strategy
      reconnection: true, // Rai pag. 48 - auto-reconnect enabled
      reconnectionDelay: 1000 // 1 secondo delay (default esempio libro)
    });

    // Event listeners - Rai [2] pag. 55-60 "Handling Connection Events"
    // Nel libro usa socket.on per tutti gli eventi principali
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connesso! ID:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnesso');
      setConnected(false);
      // Il libro dice che reconnection automatica gestisce tutto
    });

    newSocket.on('connect_error', (error) => {
      console.error('Errore connessione socket:', error.message);
    });

    setSocket(newSocket);

    // Cleanup function - React docs + Rai [2] pag. 61
    // Importante per evitare memory leaks (l'ho letto in entrambi)
    return () => {
      console.log('Chiudo connessione socket (cleanup)');
      newSocket.close();
    };
  }, [isAuthenticated]); // ri-eseguo se isAuthenticated cambia

  // Valori che passo ai componenti figli
  const value = {
    socket: socket,
    connected: connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// Hook personalizzato per usare socket nei componenti
// Pattern custom hook standard React
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    console.error('useSocket va usato dentro SocketProvider!');
  }
  return context;
}

