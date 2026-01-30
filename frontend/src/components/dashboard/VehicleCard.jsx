import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { DirectionsCar as DirectionsCarIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import '../../styles/VehicleCard.css';

// Card singola per mostrare info veicolo
function VehicleCard({ vehicle }) {
  
  // Funzione per decidere colore chip in base allo stato
  const getStatoColor = (stato) => {
    if (stato === 'In viaggio') {
      return 'success'; // verde
    }
    if (stato === 'In manutenzione') {
      return 'warning'; // arancione
    }
    return 'default'; // grigio per "Fermo"
  };

  // Funzione per aggiungere classe CSS custom al Chip
  const getChipClassName = (stato) => {
    if (stato === 'In viaggio') {
      return 'status-chip-success';
    }
    if (stato === 'In manutenzione') {
      return 'status-chip-warning';
    }
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
        {vehicle.posizione && (
          <Box className="vehicle-gps-section">
            <LocationOnIcon className="vehicle-gps-icon" />
            <Typography variant="caption" className="vehicle-gps-text">
              📍 Lat: {vehicle.posizione.lat.toFixed(4)}, 
              Lng: {vehicle.posizione.lng.toFixed(4)}
            </Typography>
          </Box>
        )}

      </CardContent>
    </Card>
  );
}

export default VehicleCard;

