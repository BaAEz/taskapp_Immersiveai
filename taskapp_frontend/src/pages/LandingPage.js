import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, Typography, Paper, CircularProgress } from '@mui/material';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (loading) {
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
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Task Manager
        </Typography>
        <Typography variant="body1" paragraph>
          Get organized and boost your productivity
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button 
            component={Link}
            to="/signup"
            variant="contained" 
            size="large"
          >
            Sign Up
          </Button>
          <Button 
            component={Link}
            to="/login"
            variant="outlined" 
            size="large"
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}