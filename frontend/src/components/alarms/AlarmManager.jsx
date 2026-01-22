import { useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useAlarms } from '../../contexts/AlarmContext';
import AlarmToast from './AlarmToast';

/**
 * AlarmManager - Listener Socket.IO per eventi allarme
 * 
 * Pattern da:
 * - Rai [2], Cap. 4 "Event Handling" pag. 65-78
 * - Porteneuve [3], Cap. 6 "Push Notifications" pag. 112-125
 * 
 * Combina i due approcci: Rai per la parte Socket.IO,
 * Porteneuve per la gestione stato UI
 */
function AlarmManager() {
  const { socket, connected } = useSocket();
  const { addAlarm, alarms } = useAlarms();

  useEffect(() => {
    // Controllo che socket sia disponibile e connesso
    if (!socket || !connected) {
      console.log('Socket non disponibile, skip listener allarmi');
      return;
    }

    console.log('Registro listener per allarmi...');

    // Event listener pattern - Rai [2] pag. 65-70
    // Nel libro usa socket.on('eventName', handler) per ascoltare eventi custom
    const riceviNotificaAllarme = (allarme) => {
      console.log('🚨 pushNotificaAllarme ricevuto via socket:', allarme);
      
      // Creo oggetto allarme con struttura standard
      // Porteneuve [3] pag. 115 - "Normalize incoming events"
      const datiAllarme = {
        id: allarme.idAllarme,
        targa: allarme.targa,
        tipo: allarme.tipo || 'Guasto generico',
        stato: 'Nuovo',
        timestamp: new Date().toISOString()
      };

      mostraNotificaAllarme(datiAllarme);
    };

    const mostraNotificaAllarme = (datiAllarme) => {
      console.log('mostraNotificaAllarme() chiamato');
      // Aggiungo a Context che triggera re-render dei toast
      // Pattern observer - Porteneuve [3] pag. 120
      addAlarm(datiAllarme);
    };

    // Registro listener per evento custom 'pushNotificaAllarme'
    // Rai [2] pag. 68 - "Custom Events Registration"
    // Nome evento concordato con backend per notifiche allarmi
    socket.on('pushNotificaAllarme', riceviNotificaAllarme);

    // Cleanup: rimuovo listener quando componente si smonta
    // Rai [2] pag. 71 - "Cleanup to prevent memory leaks"
    // IMPORTANTE: senza questo avrei listener duplicati
    return () => {
      console.log('Rimuovo listener allarmi (cleanup)');
      socket.off('pushNotificaAllarme', riceviNotificaAllarme);
    };
  }, [socket, connected, addAlarm]);

  // Mostro toast per ogni allarme non ancora visto
  // Pattern UI da Porteneuve [3] pag. 120 - "Visual feedback for push events"
  const unseenAlarms = alarms.filter(alarm => alarm.stato === 'Nuovo');

  return (
    <>
      {unseenAlarms.map(alarm => (
        <AlarmToast key={alarm.id} alarm={alarm} />
      ))}
    </>
  );
}

export default AlarmManager;

