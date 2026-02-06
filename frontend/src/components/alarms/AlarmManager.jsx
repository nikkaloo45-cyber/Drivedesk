import { useEffect } from 'react';
import { socketService } from '../../services/socket';
import { useAlarms } from '../../contexts/AlarmContext';
import AlarmToast from './AlarmToast';

/**
 * AlarmManager - Componente UI per visualizzare toast di allarmi
 * 
 * Riceve allarmi dal Context e renderizza toast per quelli non ancora visti.
 * 
 * Pattern UI toast rendering:
 * - Porteneuve [3], Cap. 6 "Visual Notifications" pag. 120-125
 * 
 * Nota: La ricezione real-time via Socket.IO è gestita in AlarmContext.
 */
 
function AlarmManager() {
  const { alarms } = useAlarms();

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

