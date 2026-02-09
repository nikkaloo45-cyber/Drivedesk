import { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import VehicleCard from './VehicleCard';
import { vehiclesAPI } from '../../services/api';
import '../../styles/VehicleGrid.css';

/**
 * VehicleGrid - Dashboard per visualizzazione flotta veicoli
 * 
 * Carica lista veicoli al mount iniziale e mostra in grid responsive.
 * 
 * Pattern UI da:
 * - Zeimpekis et al. [1] pag. 156-162 "Fleet Dashboard Design"
 */

function VehicleGrid() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carico veicoli quando componente si monta
  useEffect(() => {
    visualizzaFlotta();
  }, []);

  const visualizzaFlotta = () => {
    console.log('visualizzaFlotta() chiamato');
    getListaVeicoli();
  };

  // Zeimpekis [1] pag. 160 - "Real-time data fetching requirements"
  // Modificato per usare backend reale invece di dati mock
  const getListaVeicoli = async () => {
    try {
      setLoading(true);
      console.log('getListaVeicoli() - carico veicoli da backend...');
      
      // Chiamata GET /api/veicoli per ottenere lista veicoli
      // Zeimpekis [1] pag. 161 descrive struttura simile con REST API
      const datiVeicoli = await vehiclesAPI.getAll();
      console.log('Dati veicoli ricevuti:', datiVeicoli.length);
      
      renderGriglia(datiVeicoli);
    } catch (err) {
      console.error('Errore caricamento veicoli:', err);
      setError(err.message || 'Errore nel caricamento dei veicoli');
    } finally {
      setLoading(false);
    }
  };
  
  // Zeimpekis [1] pag. 162 - "Grid layout for fleet overview"
  const renderGriglia = (datiVeicoli) => {
    console.log('renderGriglia() chiamato con', datiVeicoli.length, 'veicoli');
    setVehicles(datiVeicoli);
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
      {/* Header con titolo */}
      <Box className="vehicle-grid-header">
        <Typography variant="h4" className="vehicle-grid-title">
          Flotta Veicoli ({vehicles.length})
        </Typography>
     </Box>
     
      {/* Griglia veicoli - Zeimpekis pag. 162 suggerisce layout responsive */}
      <Grid container spacing={3} className="custom-grid-container">
        {vehicles.map((vehicle) => (
          <Grid 
            key={vehicle._id}
            size={{ xs: 12, sm: 6, md: 4 }}
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

