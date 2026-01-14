import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

function DashboardPage() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Gestione Veicoli
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Benvenuto nella dashboard di DriveDesk! 🚗
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Qui potrai gestire la tua flotta di veicoli in tempo reale.
          </Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default DashboardPage;
