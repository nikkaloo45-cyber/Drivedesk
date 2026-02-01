import { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import VehicleCard from './VehicleCard';
import { useAlarms } from '../../contexts/AlarmContext';
import '../../styles/VehicleGrid.css';

/**
 * VehicleGrid - Visualizzazione griglia veicoli
 * 
 * Pattern di visualizzazione dati in real-time da:
 * - Zeimpekis et al. [1] pag. 156-162 "Fleet Dashboard Design"
 * - Implementa requisiti monitoraggio real-time descritti nel paper
 */

// Dati veicoli mock - Zeimpekis pag. 158 descrive struttura dati simile
const MOCK_VEHICLES = [
  {
    id: 1,
    targa: 'AB123CD',
    stato: 'In viaggio',
    posizione: { lat: 40.8518, lng: 14.2681 },
    nomeAutista: 'Mario Rossi',
    numeroAutista: '+39 333 1234567'
  },
  {
    id: 2,
    targa: 'EF456GH',
    stato: 'In manutenzione',
    posizione: { lat: 40.8555, lng: 14.2702 },
    nomeAutista: 'Luigi Verdi',
    numeroAutista: '+39 333 9876543'
  },
  {
    id: 3,
    targa: 'IJ789KL',
    stato: 'Fermo',
    posizione: { lat: 40.8490, lng: 14.2655 },
    nomeAutista: 'Giuseppe Bianchi',
    numeroAutista: '+39 333 5555555'
  }
];

function VehicleGrid() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addAlarm } = useAlarms();

  // Carico veicoli quando componente si monta
  useEffect(() => {
    visualizzaFlotta();
  }, []);

  const visualizzaFlotta = () => {
    console.log('visualizzaFlotta() chiamato');
    getListaVeicoli();
  };

  // Zeimpekis [1] pag. 160 - "Real-time data fetching requirements"
  const getListaVeicoli = async () => {
    try {
      setLoading(true);
      console.log('getListaVeicoli() - carico veicoli...');
      
      // Simulo chiamata API con delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const datiVeicoli = MOCK_VEHICLES;
      console.log('Dati veicoli ricevuti:', datiVeicoli.length);
      
      renderGriglia(datiVeicoli);
    } catch (err) {
      console.error('Errore caricamento veicoli:', err);
      setError('Errore nel caricamento dei veicoli');
    } finally {
      setLoading(false);
    }
  };
  
  // Zeimpekis [1] pag. 162 - "Grid layout for fleet overview"
  const renderGriglia = (datiVeicoli) => {
    console.log('renderGriglia() chiamato con', datiVeicoli.length, 'veicoli');
    setVehicles(datiVeicoli);
  };

  // Funzione per simulare allarme (solo per testing)
  // Serve per testare sistema notifiche senza backend
  const simulateAlarm = () => {
    console.log('Simulo allarme per test...');
    const testAlarm = {
      id: Date.now(),
      targa: 'TEST999',
      tipo: 'Allarme di test',
      stato: 'Nuovo',
      timestamp: new Date().toISOString()
    };
    addAlarm(testAlarm);
  };

  // Mostro spinner durante caricamento
  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Mostro errore se qualcosa va storto (uso Alert MUI default - no CSS)
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* Header con titolo e pulsante test */}
      <Box className="vehicle-grid-header">
        <Typography variant="h4" className="vehicle-grid-title">
          Flotta Veicoli ({vehicles.length})
        </Typography>
        
        {/* Pulsante per testare allarmi - rimuovere in produzione */}
        <Button
          variant="outlined"
          onClick={simulateAlarm}
          className="test-alarm-button"
        >
          🧪 Simula Allarme
        </Button>
     </Box>
     
      {/* Griglia veicoli - Zeimpekis pag. 162 suggerisce layout responsive */}
      <Grid container spacing={3} className="custom-grid-container">
        {vehicles.map((vehicle) => (
          <Grid item 
            xs={12}    // Mobile: 1 colonna
            sm={6}     // Tablet: 2 colonne
            md={4}     // Desktop: 3 colonne
            key={vehicle.id}
            className="custom-grid-item"
          >
            <VehicleCard vehicle={vehicle} />
          </Grid> 
        ))}
      </Grid> 
      
      {/* Messaggio se nessun veicolo */}
      {vehicles.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          Nessun veicolo disponibile
        </Typography>
      )}
    </Box>
  );
}

export default VehicleGrid;

