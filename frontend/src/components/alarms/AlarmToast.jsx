import { useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useAlarms } from '../../contexts/AlarmContext';

/**
 * AlarmToast - Notifica popup per singolo allarme
 * 
 * UI Pattern da Porteneuve [3] pag. 122 "Toast Notifications"
 * Integrato con Material-UI Snackbar component
 * 
 * Metodi seguono diagramma UML sequenze caso d'uso "Presa Visione"
 */
function AlarmToast({ alarm }) {
  const [open, setOpen] = useState(true);
  const { markAsSeen } = useAlarms();

  // Trigger: click button → aggiorna stato → chiude toast
  const clickPresaVisione = (idAllarme) => {
    console.log('clickPresaVisione() chiamato per allarme:', idAllarme);
    
    // 1. Setta allarme come visto
    setAllarmeVisto(idAllarme);
    
    // 2. Aggiorna icona badge
    aggiornaIconaVisto();
    
    // 3. Chiude toast
    setOpen(false);
  };

 
  // Frontend → Backend: setAllarmeVisto(idAllarme)
  const setAllarmeVisto = (idAllarme) => {
    console.log('setAllarmeVisto() - aggiorno stato locale');
    
    // Come descritto in Hossain [4] pag. 87 "PATCH requests with CORS"
    // await fetch(`/api/alarms/${idAllarme}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ stato: 'Visto' })
    // });
    
    // Per ora aggiorno solo stato locale tramite Context
    markAsSeen(idAllarme);
  };

  // Frontend: aggiornaIconaVisto() → decrementa unseenCount
  const aggiornaIconaVisto = () => {
    console.log('aggiornaIconaVisto() - il Context decrementa unseenCount automaticamente');
    // Il badge si aggiorna automaticamente tramite Context
    // perché markAsSeen() decrementa unseenCount
    // Pattern Observer - Porteneuve [3] pag. 101 "Reactive UI updates"
  };

  // Chiudo toast senza presa visione (click X)
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert
        severity="error"
        variant="filled"
        onClose={handleClose}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => clickPresaVisione(alarm.id)}
            sx={{ fontWeight: 'bold' }}
          >
            Presa Visione
          </Button>
        }
      >
        <strong>🚨 Nuovo Allarme!</strong><br />
        Veicolo: {alarm.targa}<br />
        Tipo: {alarm.tipo}
      </Alert>
    </Snackbar>
  );
}

export default AlarmToast;

