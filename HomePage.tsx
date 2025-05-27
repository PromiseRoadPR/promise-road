import React from 'react';
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainLayout from '../components/layout/MainLayout';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroSection = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundImage: 'url(https://source.unsplash.com/random?bible,church)',
  padding: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
    maxWidth: '50%',
  },
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: theme.shape.borderRadius,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const featuredBlogs = [
    {
      id: 1,
      title: 'Finding Peace in Scripture',
      excerpt: 'Discover how daily Bible reading can transform your spiritual journey and bring peace to your life.',
      image: 'https://source.unsplash.com/random?bible',
    },
    {
      id: 2,
      title: 'Modern Christian Living',
      excerpt: 'Practical tips for living out your faith in today\'s complex world while staying true to biblical principles.',
      image: 'https://source.unsplash.com/random?prayer',
    },
    {
      id: 3,
      title: 'The Power of Community',
      excerpt: 'How Christian fellowship strengthens faith and provides support through life\'s challenges.',
      image: 'https://source.unsplash.com/random?church',
    },
  ];

  const featuredVideos = [
    {
      id: 1,
      title: 'Worship Session: Amazing Grace',
      duration: '12:34',
      image: 'https://source.unsplash.com/random?worship',
    },
    {
      id: 2,
      title: 'Bible Study: Sermon on the Mount',
      duration: '28:45',
      image: 'https://source.unsplash.com/random?biblestudy',
    },
    {
      id: 3,
      title: 'Testimony: Finding Faith in Difficult Times',
      duration: '15:20',
      image: 'https://source.unsplash.com/random?testimony',
    },
  ];

  return (
    <MainLayout>
      <HeroSection>
        <HeroContent>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom>
            Promise Road
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Create, share, and grow your Christian content ministry
          </Typography>
          {!isAuthenticated && (
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/register"
            >
              Start Your Journey
            </Button>
          )}
          {isAuthenticated && (
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/dashboard"
            >
              Go to Dashboard
            </Button>
          )}
        </HeroContent>
      </HeroSection>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Blog Posts
        </Typography>
        <Grid container spacing={4}>
          {featuredBlogs.map((blog) => (
            <Grid item key={blog.id} xs={12} sm={6} md={4}>
              <FeatureCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.image}
                  alt={blog.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {blog.title}
                  </Typography>
                  <Typography>
                    {blog.excerpt}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Videos
        </Typography>
        <Grid container spacing={4}>
          {featuredVideos.map((video) => (
            <Grid item key={video.id} xs={12} sm={6} md={4}>
              <FeatureCard>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.image}
                    alt={video.title}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      padding: '4px 8px',
                      borderTopLeftRadius: 4,
                    }}
                  >
                    {video.duration}
                  </Box>
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {video.title}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper sx={{ p: 4, mb: 6, backgroundColor: (theme) => theme.palette.primary.light, color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            "Let your light shine before others."
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            — Matthew 5:16
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to={isAuthenticated ? "/dashboard" : "/register"}
            >
              {isAuthenticated ? "Create Content" : "Join Our Community"}
            </Button>
          </Box>
        </Container>
      </Paper>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Why Promise Road?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Spread the Gospel
              </Typography>
              <Typography>
                Reach more people with your message through our optimized platform designed specifically for Christian content.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Build Community
              </Typography>
              <Typography>
                Connect with like-minded believers and grow your ministry through meaningful engagement.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Professional Tools
              </Typography>
              <Typography>
                Access powerful creation tools designed specifically for blogs and videos with a Christian focus.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default HomePage;
