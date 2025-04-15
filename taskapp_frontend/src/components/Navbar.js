import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Container
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          borderRadius: 2,
          minWidth: 200,
        }
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Signed in as
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {user?.email}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={() => handleNavigate('/dashboard')} sx={{ py: 1.5 }}>
        <DashboardIcon sx={{ mr: 2 }} /> Dashboard
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
        <ExitToAppIcon sx={{ mr: 2 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          borderRadius: 2,
        }
      }}
    >
      {user ? (
        [
          <MenuItem key="email" sx={{ py: 1.5 }}>
            <PersonIcon sx={{ mr: 2 }} /> {user.email}
          </MenuItem>,
          <Divider key="divider" />,
          <MenuItem key="dashboard" onClick={() => handleNavigate('/dashboard')} sx={{ py: 1.5 }}>
            <DashboardIcon sx={{ mr: 2 }} /> Dashboard
          </MenuItem>,
          <MenuItem key="logout" onClick={handleLogout} sx={{ py: 1.5 }}>
            <ExitToAppIcon sx={{ mr: 2 }} /> Logout
          </MenuItem>
        ]
      ) : null}
    </Menu>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            pl: { xs: 4, sm: 8, md: 12 } // Add padding to the left to offset the space taken by user controls
          }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                background: theme.palette.gradient.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                letterSpacing: '-0.5px'
              }}
              onClick={() => navigate('/')}
            >
              Task Manager
            </Typography>
          </Box>

          {isMobile ? (
            <>
              {user && (
                <>
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenu}
                  >
                    <MenuIcon />
                  </IconButton>
                  {renderMobileMenu}
                </>
              )}
            </>
          ) : (
            <>
              {user && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    onClick={() => handleNavigate('/dashboard')}
                    color="inherit"
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ 
                      ml: 2,
                      '&:hover': { 
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                  {renderMenu}
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}