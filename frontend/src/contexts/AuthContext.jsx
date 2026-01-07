import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Dati utente mock per testing
const MOCK_USER = {
  email: 'manager@drivedesk.it',
  password: 'password123',
  nome: 'Mario Rossi',
  ruolo: 'Manager'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Funzione per fare login
  const login = (email, password) => {
    console.log('Tentativo login con:', email);
    
    // Controllo semplice - confronto con utente mock
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      console.log('Login riuscito!');
      setUser(MOCK_USER);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      console.log('Login fallito - credenziali sbagliate');
      return { success: false, error: 'Email o password non corretti' };
    }
  };

  // Funzione logout
  const logout = () => {
    console.log('Logout utente:', user?.nome);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Funzione per controllare se user è autenticato
  const checkAuth = () => {
    return isAuthenticated;
  };

  // Metto tutti i valori in un oggetto
  // così posso passarli ai componenti figli
  const value = {
    user: user,
    isAuthenticated: isAuthenticated,
    login: login,
    logout: logout,
    checkAuth: checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizzato per usare auth nei componenti
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Controllo che sia usato dentro Provider
  if (!context) {
    console.error('ERRORE: useAuth deve essere usato dentro AuthProvider!');
  }
  
  return context;
}

