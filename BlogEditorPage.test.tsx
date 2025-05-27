import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../../context/AuthContext';
import theme from '../../theme';
import BlogEditorPage from '../../pages/BlogEditorPage';

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
          { _id: '1', name: 'Faith', slug: 'faith' },
          { _id: '2', name: 'Worship', slug: 'worship' },
          { _id: '3', name: 'Bible Study', slug: 'bible-study' }
        ]
      }
    })),
    post: vi.fn(() => Promise.resolve({
      data: {
        success: true,
        data: {
          _id: 'new-post-id',
          title: 'Test Blog Post',
          content: '<p>Test content</p>',
          status: 'draft'
        }
      }
    }))
  }
}));

// Mock the react-quill editor
vi.mock('react-quill', () => ({
  default: ({ value, onChange }) => (
    <div data-testid="quill-editor">
      <textarea
        data-testid="quill-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}));

describe('BlogEditorPage Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <BlogEditorPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });

  it('renders the blog editor form correctly', async () => {
    expect(screen.getByText('Create New Blog Post')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByText('Add Scripture Reference')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save as Draft/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
  });

  it('allows entering blog post details', async () => {
    // Fill in the title
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Blog Post' } });
    expect(titleInput.value).toBe('Test Blog Post');
    
    // Fill in the content using the mocked quill editor
    const quillTextarea = screen.getByTestId('quill-textarea');
    fireEvent.change(quillTextarea, { target: { value: '<p>Test content</p>' } });
    
    // Fill in tags
    const tagsInput = screen.getByLabelText(/Tags/i);
    fireEvent.change(tagsInput, { target: { value: 'faith, test, blog' } });
    expect(tagsInput.value).toBe('faith, test, blog');
    
    // Wait for categories to load and select one
    await waitFor(() => {
      expect(screen.getByText('Faith')).toBeInTheDocument();
    });
    
    // Save as draft
    const saveButton = screen.getByRole('button', { name: /Save as Draft/i });
    fireEvent.click(saveButton);
    
    // Verify that the post was saved (would check for success message in real app)
    await waitFor(() => {
      // In a real test, we would check for a success notification
      // Here we're just verifying that the axios.post mock was called
      expect(require('axios').default.post).toHaveBeenCalled();
    });
  });

  it('shows scripture reference form when Add Scripture Reference button is clicked', () => {
    const addScriptureButton = screen.getByText('Add Scripture Reference');
    fireEvent.click(addScriptureButton);
    
    expect(screen.getByLabelText(/Book/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chapter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Verse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Translation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Reference/i })).toBeInTheDocument();
  });
});
