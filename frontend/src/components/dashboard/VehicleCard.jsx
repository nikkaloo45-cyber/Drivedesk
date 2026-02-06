import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { DirectionsCar as DirectionsCarIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import '../../styles/VehicleCard.css';

// Card singola per mostrare info veicolo
function VehicleCard({ vehicle }) {
  
   const getStatoLabel = (stato) => {
    const labels = {
      'movimento': 'In viaggio',
      'sosta': 'Fermo',
      'allarme': 'Allarme'
    };
    return labels[stato] || stato;
  };
   
  // Funzione per decidere colore chip in base allo stato
   const getStatoColor = (stato) => {
    if (stato === 'movimento') return 'success';   // verde
    if (stato === 'allarme') return 'error';       // rosso
    return 'default'; // grigio per "sosta"
   };

  // Funzione per aggiungere classe CSS custom al Chip
   const getChipClassName = (stato) => {
    if (stato === 'movimento') return 'status-chip-success';
    if (stato === 'allarme') return 'status-chip-warning';
    return 'status-chip-default';
   };
  
  return (
    <Card className="vehicle-card">
      <CardContent>
        
        {/* Header: icona + targa + stato */}
        <Box className="vehicle-card-header">
          {/* Icona + targa */}
          <Box className="vehicle-targa-box">
            <DirectionsCarIcon className="vehicle-icon" />
            <Typography variant="h6" className="vehicle-targa">
              {vehicle.targa}
            </Typography>
          </Box>
          
          {/* Chip stato */}
          <Chip
            label={vehicle.stato}
            color={getStatoColor(vehicle.stato)}
            size="small"
            className={getChipClassName(vehicle.stato)}
          />
        </Box>

        {/* Info autista */}
        <Typography variant="body2" className="vehicle-info">
          Autista: {vehicle.nomeAutista}
        </Typography>
        <Typography variant="body2" className="vehicle-info">
          Tel: {vehicle.numeroAutista}
        </Typography>

        {/* Posizione GPS se disponibile */}
        {vehicle.posizione && vehicle.posizione !== '0,0' && (
          <Box className="vehicle-gps-section">
            <LocationOnIcon className="vehicle-gps-icon" />
            <Typography variant="caption" className="vehicle-gps-text">
              📍 GPS: {vehicle.posizione}
            </Typography>
          </Box>
        )}

      </CardContent>
    </Card>
  );
}

export default VehicleCard;

