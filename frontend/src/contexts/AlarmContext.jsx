import { createContext, useContext, useState } from 'react';

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
  const markAsSeen = (alarmId) => {
    console.log('Marco allarme come visto:', alarmId);
    
    // Aggiorno stato dell'allarme specifico
    // Porteneuve [3] pag. 97-99 - principio di immutabilità
    setAlarms(prevAlarms =>
      prevAlarms.map(alarm => {
        if (alarm.id === alarmId) {
          return { ...alarm, stato: 'Visto' };
        }
        return alarm;
      })
    );
    
    // Decremento contatore (ma non deve andare sotto zero)
    setUnseenCount(prevCount => Math.max(0, prevCount - 1));
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
    clearAlarms: clearAlarms
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

