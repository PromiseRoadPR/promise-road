import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container, useMediaQuery, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', auth: true },
    { text: 'Blogs', icon: <ArticleIcon />, path: '/dashboard/blogs', auth: true },
    { text: 'Videos', icon: <VideoLibraryIcon />, path: '/dashboard/videos', auth: true },
  ];

  const drawer = (
    <Box onClick={toggleDrawer} sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
          Promise Road
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          (!item.auth || (item.auth && isAuthenticated)) && (
            <ListItem button key={item.text} component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Promise Road
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                (!item.auth || (item.auth && isAuthenticated)) && (
                  <Button 
                    key={item.text} 
                    component={RouterLink} 
                    to={item.path}
                    sx={{ mx: 1 }}
                  >
                    {item.text}
                  </Button>
                )
              ))}
              
              {isAuthenticated ? (
                <Button 
                  color="primary" 
                  variant="outlined" 
                  onClick={logout}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button 
                    color="primary" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ ml: 2 }}
                  >
                    Login
                  </Button>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    component={RouterLink} 
                    to="/register"
                    sx={{ ml: 1 }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
