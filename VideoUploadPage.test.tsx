import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../context/AuthContext';
import theme from '../../theme';
import VideoUploadPage from '../../pages/VideoUploadPage';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'creator'
      }
    })
  };
});

// Mock the API calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {
        success: true,
        data: [
          { _id: '1', name: 'Worship', slug: 'worship' },
          { _id: '2', name: 'Testimony', slug: 'testimony' },
          { _id: '3', name: 'Bible Study', slug: 'bible-study' }
        ]
      }
    })),
    post: vi.fn(() => Promise.resolve({
      data: {
        success: true,
        data: {
          _id: 'new-video-id',
          title: 'Test Video',
          description: 'Test description',
          videoType: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=test',
          status: 'published'
        }
      }
    }))
  }
}));

describe('VideoUploadPage Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <VideoUploadPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });

  it('renders the video upload form correctly', async () => {
    expect(screen.getByText('Upload New Video')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    
    // Check for video source options
    expect(screen.getByText('Upload Video File')).toBeInTheDocument();
    expect(screen.getByText('YouTube URL')).toBeInTheDocument();
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Video/i })).toBeInTheDocument();
  });

  it('allows entering YouTube video details', async () => {
    // Fill in the title
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Video' } });
    expect(titleInput.value).toBe('Test Video');
    
    // Fill in the description
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    expect(descriptionInput.value).toBe('Test description');
    
    // Select YouTube option
    const youtubeTab = screen.getByText('YouTube URL');
    fireEvent.click(youtubeTab);
    
    // Fill in YouTube URL
    const youtubeInput = screen.getByLabelText(/YouTube URL/i);
    fireEvent.change(youtubeInput, { target: { value: 'https://www.youtube.com/watch?v=test' } });
    expect(youtubeInput.value).toBe('https://www.youtube.com/watch?v=test');
    
    // Fill in tags
    const tagsInput = screen.getByLabelText(/Tags/i);
    fireEvent.change(tagsInput, { target: { value: 'worship, test, video' } });
    expect(tagsInput.value).toBe('worship, test, video');
    
    // Wait for categories to load and select one
    await waitFor(() => {
      expect(screen.getByText('Worship')).toBeInTheDocument();
    });
    
    // Upload video
    const uploadButton = screen.getByRole('button', { name: /Upload Video/i });
    fireEvent.click(uploadButton);
    
    // Verify that the video was uploaded
    await waitFor(() => {
      // In a real test, we would check for a success notification
      // Here we're just verifying that the axios.post mock was called
      expect(require('axios').default.post).toHaveBeenCalled();
    });
  });

  it('shows file upload form when Upload Video File option is selected', () => {
    // Select Upload Video File option (should be selected by default)
    const fileUploadTab = screen.getByText('Upload Video File');
    fireEvent.click(fileUploadTab);
    
    // Check for file input
    expect(screen.getByText('Drag and drop a video file here, or click to select a file')).toBeInTheDocument();
  });
});
