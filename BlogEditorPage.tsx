import React from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Container, FormControl, InputLabel, Select, MenuItem, Chip, Stack } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required'),
  content: yup
    .string()
    .required('Content is required'),
  category: yup
    .string()
    .required('Category is required'),
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

const categories = [
  'Faith',
  'Prayer',
  'Bible Study',
  'Worship',
  'Testimony',
  'Devotional',
  'Ministry',
  'Family',
  'Christian Living'
];

const BlogEditorPage: React.FC = () => {
  const { user } = useAuth();
  const [tags, setTags] = React.useState<string[]>([]);
  const [currentTag, setCurrentTag] = React.useState('');
  
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      category: '',
      featuredImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // In a real app, this would send data to the backend
      console.log({
        ...values,
        tags,
        author: user?.id,
        createdAt: new Date(),
      });
      alert('Blog post saved successfully!');
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
            Blog Editor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create and edit your Christian blog content
          </Typography>
        </Box>
        
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Blog Title"
                  variant="outlined"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
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
                <Typography variant="subtitle1" gutterBottom>
                  Blog Content
                </Typography>
                <Box sx={{ height: 400, mb: 2 }}>
                  <ReactQuill
                    theme="snow"
                    value={formik.values.content}
                    onChange={(content) => formik.setFieldValue('content', content)}
                    modules={modules}
                    formats={formats}
                    style={{ height: 350 }}
                  />
                </Box>
                {formik.touched.content && formik.errors.content && (
                  <Typography color="error" variant="caption">
                    {formik.errors.content}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Scripture Reference
                </Typography>
                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'primary.main', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Add a Bible verse to support your message
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Book"
                        variant="outlined"
                        placeholder="e.g., John"
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        fullWidth
                        label="Chapter"
                        variant="outlined"
                        placeholder="e.g., 3"
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        fullWidth
                        label="Verse"
                        variant="outlined"
                        placeholder="e.g., 16"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Translation</InputLabel>
                        <Select
                          label="Translation"
                          defaultValue="NIV"
                        >
                          <MenuItem value="NIV">NIV</MenuItem>
                          <MenuItem value="KJV">KJV</MenuItem>
                          <MenuItem value="ESV">ESV</MenuItem>
                          <MenuItem value="NLT">NLT</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" fullWidth>
                        Add Scripture Reference
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="outlined">
                    Save as Draft
                  </Button>
                  <Box>
                    <Button variant="outlined" sx={{ mr: 1 }}>
                      Preview
                    </Button>
                    <Button type="submit" variant="contained">
                      Publish
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default BlogEditorPage;
