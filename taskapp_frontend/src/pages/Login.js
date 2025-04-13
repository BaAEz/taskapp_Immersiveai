import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grey.50',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: 'background.paper'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                mb: 4
              }}
            >
              Welcome Back
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ 
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Login
              </Button>
            </form>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2,
                color: 'text.secondary'
              }}
            >
              Don't have an account? {' '}
              <Link 
                to="/signup" 
                style={{ 
                  color: 'inherit',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}