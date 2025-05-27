import React from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Container, FormControl, InputLabel, Select, MenuItem, Chip, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required'),
  description: yup
    .string()
    .required('Description is required'),
  category: yup
    .string()
    .required('Category is required'),
});

const categories = [
  'Worship',
  'Bible Study',
  'Sermon',
  'Testimony',
  'Prayer',
  'Teaching',
  'Ministry',
  'Youth',
  'Family'
];

const VideoUploadPage: React.FC = () => {
  const { user } = useAuth();
  const [tags, setTags] = React.useState<string[]>([]);
  const [currentTag, setCurrentTag] = React.useState('');
  const [uploadType, setUploadType] = React.useState('file');
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      videoFile: null,
      externalUrl: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // In a real app, this would send data to the backend
      console.log({
        ...values,
        tags,
        uploadType,
        author: user?.id,
        createdAt: new Date(),
      });
      alert('Video uploaded successfully!');
    },
  });

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Video Upload
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Share your Christian video content with the community
          </Typography>
        </Box>
        
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload Type
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant={uploadType === 'file' ? 'contained' : 'outlined'}
                        startIcon={<CloudUploadIcon />}
                        onClick={() => setUploadType('file')}
                        sx={{ py: 2 }}
                      >
                        Upload Video File
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant={uploadType === 'external' ? 'contained' : 'outlined'}
                        startIcon={<YouTubeIcon />}
                        onClick={() => setUploadType('external')}
                        sx={{ py: 2 }}
                      >
                        Embed YouTube/Vimeo
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              {uploadType === 'file' && (
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      border: '2px dashed', 
                      borderColor: 'primary.main', 
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: 'rgba(63, 81, 181, 0.05)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      accept="video/*"
                      style={{ display: 'none' }}
                      id="video-file-upload"
                      type="file"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          formik.setFieldValue('videoFile', file);
                        }
                      }}
                    />
                    <label htmlFor="video-file-upload">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Drag and drop your video here
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          or click to browse files
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Supported formats: MP4, MOV, AVI, WMV (max 500MB)
                        </Typography>
                        {formik.values.videoFile && (
                          <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                            Selected: {(formik.values.videoFile as File).name}
                          </Typography>
                        )}
                      </Box>
                    </label>
                  </Box>
                </Grid>
              )}
              
              {uploadType === 'external' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="externalUrl"
                    name="externalUrl"
                    label="YouTube or Vimeo URL"
                    variant="outlined"
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                    value={formik.values.externalUrl}
                    onChange={formik.handleChange}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Paste the full URL of your YouTube or Vimeo video
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Video Title"
                  variant="outlined"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Video Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <Typography color="error" variant="caption">
                      {formik.errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="tag-input"
                  label="Add Tags"
                  variant="outlined"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <Button 
                        variant="contained" 
                        onClick={handleAddTag}
                        disabled={!currentTag}
                        size="small"
                      >
                        Add
                      </Button>
                    ),
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        sx={{ mt: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="outlined">
                    Save as Draft
                  </Button>
                  <Button type="submit" variant="contained">
                    Upload Video
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default VideoUploadPage;
