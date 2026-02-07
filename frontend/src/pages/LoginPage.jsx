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
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const renderDashboard = () => {
    console.log('renderDashboard() chiamato - vado alla dashboard');
    navigate('/dashboard');
  };

  const mostraErrore = (errorMessage) => {
    console.log('mostraErrore() chiamato:', errorMessage);
    setLocalError(errorMessage);
  };

  // Gestione submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); // pulisco errori precedenti
    
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
    setLoading(true);
    
    try {
      const result = await login(email, password);

      if (result.success) {
        // Login ok - vado a dashboard
        console.log('Login riuscito!');
        renderDashboard();
      } else {
        // Login fallito - mostro errore
        mostraErrore(result.error || 'Credenziali non valide');
      }
    } catch (err) {
      // Errori imprevisti (es. login() crashato)
      console.error('Errore durante login:', err);
      mostraErrore('Errore di connessione al server');
    } finally {
      setLoading(false);
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
          {localError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError}
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
              placeholder="testing@drivedesk.it"
              disabled={loading}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="test123"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>
          
          {/* Info credenziali test */}
          <Box className="demo-box">
            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Credenziali Demo:
            </Typography>
            <Box className="demo-text">
              testing@drivedesk.it / test123
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;

