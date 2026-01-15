import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

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

  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        {/* Header con icona targa e stato */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          {/* Icona + targa */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DirectionsCarIcon color="primary" />
            <Typography variant="h6">
              {vehicle.targa}
            </Typography>
          </Box>
          
          {/* Chip stato */}
          <Chip
            label={vehicle.stato}
            color={getStatoColor(vehicle.stato)}
            size="small"
          />
        </Box>

        {/* Info autista */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Autista: {vehicle.nomeAutista}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tel: {vehicle.numeroAutista}
        </Typography>

        {/* Posizione GPS se disponibile */}
        {vehicle.posizione && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1.5 }}>
            📍 Lat: {vehicle.posizione.lat.toFixed(4)}, 
            Lng: {vehicle.posizione.lng.toFixed(4)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default VehicleCard;
