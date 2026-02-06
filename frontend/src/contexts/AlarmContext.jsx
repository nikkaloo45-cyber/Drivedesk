import { createContext, useContext, useState, useEffect } from 'react';
import { alarmsAPI } from '../services/api';
import { socketService } from '../services/socket';

const AlarmContext = createContext();

/**
 * AlarmProvider - Gestisce stato degli allarmi real-time
 * 
 * Architettura ispirata a:
 * - Porteneuve [3], Cap. 5 "Client-Side State Management" (pag. 89-105)
 * - Pattern "Event Store" descritto pag. 92
 * 
 * Ho usato React useState invece del loro approccio custom perché
 * più semplice da integrare con Context API
 */
export function AlarmProvider({ children }) {
  // Lista di tutti gli allarmi ricevuti
  // Porteneuve [3] pag. 92 - mantiene storico eventi per replay
  const [alarms, setAlarms] = useState([]);
  
  // Contatore allarmi non ancora visti
  // per aggiornare badge UI in real-time
  const [unseenCount, setUnseenCount] = useState(0);

  // Flag per evitare doppi fetch
  const [isInitialized, setIsInitialized] = useState(false);

  // Caricamento iniziale allarmi + setup Socket.IO real-time
  // Porteneuve [3] pag. 101 "Reactive UI updates with WebSockets"
  useEffect(() => {
    if (isInitialized) return;

    // Carica storico allarmi da backend
    fetchAlarms();

    // Listener Socket.IO per nuovi allarmi real-time
    // Pattern Observer - Porteneuve [3] pag. 101
    socketService.onNewAlarm((socketAlarm) => {
      console.log('🚨 Nuovo allarme ricevuto:', socketAlarm);
      
      const newAlarm = {
        id: socketAlarm.idAllarme,
        targa: socketAlarm.targa,
        causa: socketAlarm.messaggio,
        stato: 'nuovo',
        timestamp: new Date().toISOString()
      };
      
      addAlarm(newAlarm);
    });

    setIsInitialized(true);

    // Cleanup quando componente si smonta
    return () => {
      socketService.offNewAlarm();
    };
  }, [isInitialized]);

  // Fetch allarmi iniziale da GET /api/allarmi
  // Porteneuve [3] pag. 87 "GET requests with CORS"
  const fetchAlarms = async () => {
    try {
      console.log('Carico storico allarmi da backend...');
      const backendAlarms = await alarmsAPI.getAll();
      
      const formattedAlarms = backendAlarms.map(alarm => ({
        id: alarm._id,
        targa: alarm.veicolo?.targa || 'N/A',
        causa: alarm.causa,
        categoria: alarm.categoria,
        stato: alarm.stato,
        timestamp: alarm.timestamp
      }));
      
      setAlarms(formattedAlarms);
      
      // Calcola quanti allarmi sono "nuovo" (non visti)
      const newCount = formattedAlarms.filter(a => a.stato === 'nuovo').length;
      setUnseenCount(newCount);
      
      console.log(`Caricati ${formattedAlarms.length} allarmi (${newCount} non visti)`);
    } catch (error) {
      console.error('Errore caricamento allarmi:', error);
    }
  };

  // Funzione per aggiungere nuovo allarme alla lista
  // Pattern "Event Append" - Porteneuve [3] pag. 94
  const addAlarm = (alarm) => {
    console.log('Nuovo allarme aggiunto:', alarm);
    
    // Aggiungo nuovo allarme in testa all'array (eventi più recenti prima)
    // Porteneuve [3] pag. 95 - "prepend for chronological order"
    setAlarms(prevAlarms => [alarm, ...prevAlarms]);
    
    // Incremento contatore non visti
    setUnseenCount(prevCount => prevCount + 1);
  };

  // Funzione per marcare allarme come visto
  // Porteneuve [3] pag. 98 - "State Update Pattern"
  const markAsSeen = async (alarmId) => {
    console.log('Marco allarme come visto:', alarmId);
    
    try {
      // PATCH /api/allarmi/:id - aggiorna stato su backend
      // Porteneuve [3] pag. 87 "PATCH requests with CORS"
      await alarmsAPI.updateStatus(alarmId, 'gestione');
      
      // Aggiorna stato dell'allarme specifico
      // Porteneuve [3] pag. 97-99 - principio di immutabilità
      setAlarms(prevAlarms =>
        prevAlarms.map(alarm => {
          if (alarm.id === alarmId) {
            return { ...alarm, stato: 'gestione' };
          }
          return alarm;
        })
      );
      
      // Decremento contatore (ma non deve andare sotto zero)
      setUnseenCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Errore aggiornamento allarme:', error);
    }
  };

  // Funzione per pulire tutti gli allarmi
  const clearAlarms = () => {
    console.log('Pulisco tutti gli allarmi');
    setAlarms([]);
    setUnseenCount(0);
  };

  // Valori e funzioni da passare ai componenti
  const value = {
    alarms: alarms,
    unseenCount: unseenCount,
    addAlarm: addAlarm,
    markAsSeen: markAsSeen,
    clearAlarms: clearAlarms,
    refreshAlarms: fetchAlarms
  };

  return (
    <AlarmContext.Provider value={value}>
      {children}
    </AlarmContext.Provider>
  );
}

// Hook per usare allarmi nei componenti
export function useAlarms() {
  const context = useContext(AlarmContext);
  if (!context) {
    console.error('useAlarms va usato dentro AlarmProvider!');
  }
  return context;
}

