import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper
} from '@mui/material';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Configure axios to always send the token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Use useCallback to avoid dependency issues
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/tasks`);
      setTasks(data.tasks || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to fetch tasks');
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Added fetchTasks to dependency array

  const handleAddTask = async (title) => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/tasks`, { title });
      setTasks([...tasks, data.task]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.response?.data?.message || 'Failed to add task');
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleToggleTask = async (taskId, isCompleted) => {
    try {
      const { data } = await axios.put(`${SERVER_URL}/tasks/${taskId}`, { isCompleted });
      setTasks(tasks.map(task => task._id === taskId ? data.task : task));
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${SERVER_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${SERVER_URL}/tasks/${editingTask._id}`, 
        { title: editTitle }
      );
      setTasks(tasks.map(task => 
        task._id === editingTask._id ? { ...task, title: editTitle } : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.message || 'Failed to update task');
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: (theme) => `${theme.palette.background.default} radial-gradient(circle at 90% 10%, ${theme.palette.primary.light}22 0%, transparent 50%)`,
      pt: 4,
      pb: 6,
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            backgroundColor: 'background.paper',
            backgroundImage: 'linear-gradient(rgba(255,255,255,.9), rgba(255,255,255,.9))',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'primary.light',
            borderRadius: 3,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>Task Manager</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {user?.email}
              </Typography>
              <Button 
                onClick={logout} 
                variant="outlined" 
                color="secondary"
                sx={{ 
                  borderRadius: 2,
                  px: 3
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          <TaskForm onAddTask={handleAddTask} />
          
          <TaskList 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditClick}
          />
        </Paper>

        <Dialog 
          open={Boolean(editingTask)} 
          onClose={() => setEditingTask(null)}
          PaperProps={{
            sx: { borderRadius: 3, p: 2 }
          }}
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              type="text"
              fullWidth
              variant="standard"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}