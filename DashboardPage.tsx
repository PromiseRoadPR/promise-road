import React from 'react';
import { Box, Typography, Paper, Grid, Container, Tabs, Tab, Button } from '@mui/material';
import { Routes, Route, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CategoryIcon from '@mui/icons-material/Category';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

// These would be separate components in a real implementation
const DashboardOverview = () => (
  <Box>
    <Typography variant="h5" gutterBottom>Dashboard Overview</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Blog Posts</Typography>
          <Typography variant="h3">12</Typography>
          <Typography variant="body2" color="text.secondary">3 drafts, 9 published</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Videos</Typography>
          <Typography variant="h3">8</Typography>
          <Typography variant="body2" color="text.secondary">2 processing, 6 published</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Total Views</Typography>
          <Typography variant="h3">1,234</Typography>
          <Typography variant="body2" color="text.secondary">↑ 12% from last month</Typography>
        </Paper>
      </Grid>
    </Grid>
    
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Recent Activity</Typography>
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="body1">Blog post "Finding Peace in Scripture" published</Typography>
      <Typography variant="body2" color="text.secondary">2 hours ago</Typography>
    </Paper>
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="body1">New comment on "Modern Christian Living"</Typography>
      <Typography variant="body2" color="text.secondary">Yesterday</Typography>
    </Paper>
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="body1">Video "Bible Study: Sermon on the Mount" reached 100 views</Typography>
      <Typography variant="body2" color="text.secondary">3 days ago</Typography>
    </Paper>
  </Box>
);

const BlogManagement = () => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5">Blog Posts</Typography>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        component={RouterLink}
        to="/blog/editor"
      >
        New Post
      </Button>
    </Box>
    
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h6">Finding Peace in Scripture</Typography>
          <Typography variant="body2" color="text.secondary">Published • April 2, 2025</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Grid>
      </Grid>
    </Paper>
    
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h6">Modern Christian Living</Typography>
          <Typography variant="body2" color="text.secondary">Published • March 28, 2025</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Grid>
      </Grid>
    </Paper>
    
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h6">The Power of Prayer</Typography>
          <Typography variant="body2" color="text.secondary">Draft • Last edited April 1, 2025</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

const VideoManagement = () => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5">Videos</Typography>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        component={RouterLink}
        to="/video/upload"
      >
        New Video
      </Button>
    </Box>
    
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h6">Worship Session: Amazing Grace</Typography>
          <Typography variant="body2" color="text.secondary">Published • April 1, 2025</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Grid>
      </Grid>
    </Paper>
    
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h6">Bible Study: Sermon on the Mount</Typography>
          <Typography variant="body2" color="text.secondary">Published • March 25, 2025</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Grid>
      </Grid>
    </Paper>
    
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h6">Testimony: Finding Faith in Difficult Times</Typography>
          <Typography variant="body2" color="text.secondary">Processing • Uploaded April 3, 2025</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="outlined" size="small" color="error">Delete</Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [value, setValue] = React.useState(0);
  
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/blogs')) {
      setValue(1);
    } else if (path.includes('/dashboard/videos')) {
      setValue(2);
    } else if (path.includes('/dashboard/categories')) {
      setValue(3);
    } else if (path.includes('/dashboard/analytics')) {
      setValue(4);
    } else if (path.includes('/dashboard/settings')) {
      setValue(5);
    } else {
      setValue(0);
    }
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/dashboard/blogs');
        break;
      case 2:
        navigate('/dashboard/videos');
        break;
      case 3:
        navigate('/dashboard/categories');
        break;
      case 4:
        navigate('/dashboard/analytics');
        break;
      case 5:
        navigate('/dashboard/settings');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.firstName || 'Creator'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your Christian content and reach more believers with your message.
          </Typography>
        </Box>
        
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="dashboard navigation tabs"
          >
            <Tab icon={<DashboardIcon />} label="Overview" />
            <Tab icon={<ArticleIcon />} label="Blogs" />
            <Tab icon={<VideoLibraryIcon />} label="Videos" />
            <Tab icon={<CategoryIcon />} label="Categories" />
            <Tab icon={<AnalyticsIcon />} label="Analytics" />
            <Tab icon={<SettingsIcon />} label="Settings" />
          </Tabs>
        </Paper>
        
        <Box sx={{ py: 2 }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/blogs" element={<BlogManagement />} />
            <Route path="/videos" element={<VideoManagement />} />
            <Route path="/categories" element={<Typography>Categories Management</Typography>} />
            <Route path="/analytics" element={<Typography>Analytics Dashboard</Typography>} />
            <Route path="/settings" element={<Typography>Account Settings</Typography>} />
          </Routes>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
