import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import '../styles/LoginPage.css';

function LoginPage() {
  // Stati per email e password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const renderDashboard = () => {
    console.log('renderDashboard() chiamato - vado alla dashboard');
    navigate('/dashboard');
  };

  const mostraErrore = (errorMessage) => {
    console.log('mostraErrore() chiamato:', errorMessage);
    setError(errorMessage);
  };

  // Gestione submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // pulisco errori precedenti
    
         // Validazione base
    if (!email) {
      mostraErrore('Inserisci una email');
      return;
    }
    if (!password) {
      mostraErrore('Inserisci una password');
      return;
    }

    console.log('Provo login...');
    const result = login(email, password);

    if (result.success) {
      // Login ok - vado a dashboard
      renderDashboard();
    } else {
      // Login fallito - mostro errore
      mostraErrore(result.error);
    }
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <CardContent sx={{ p: 4 }}>
        
          {/* Header con logo */}
          <Box className="login-header">
            <DirectionsCarIcon className="login-icon" />
            <Typography variant="h5" className="login-title">
              DriveDesk
            </Typography>
            <Typography variant="body2" className="login-subtitle">
              Sistema Gestione Flotta
            </Typography>
          </Box>
          
          {/* Messaggio errore */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form login */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@drivedesk.it"
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Accedi
            </Button>
          </form>
          
          {/* Info credenziali test */}
          <Box className="demo-box">
            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Credenziali Demo:
            </Typography>
            <Box className="demo-text">
              manager@drivedesk.it / password123
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}

 
export default LoginPage;
