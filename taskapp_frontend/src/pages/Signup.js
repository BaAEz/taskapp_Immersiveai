import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signup(email, password);
      // User will be automatically redirected via the useEffect above
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (user) {
    return null; // Brief render before navigation
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4
      }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          width: '100%',
          maxWidth: 400
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Create Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              inputProps={{ minLength: 6 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </form>

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 3, 
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: 'inherit',
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Log In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}