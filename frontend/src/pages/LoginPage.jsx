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

function LoginPage() {
  // Stati per email e password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } else {
      // Login fallito - mostro errore
      setErrore(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', m: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header con logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <DirectionsCarIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" gutterBottom>
              DriveDesk
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Credenziali demo:</strong><br />
              manager@drivedesk.it / password123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;

