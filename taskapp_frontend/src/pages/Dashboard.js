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
  Slide,
  Fade,
  Chip,
  Tooltip,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Sort as SortIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
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
  const [showAddTask, setShowAddTask] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

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
  }, [fetchTasks]);

  const handleAddTask = async (title) => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/tasks`, { title });
      setTasks([...tasks, data.task]);
      setShowAddTask(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add task');
    }
  };

  const handleToggleTask = async (taskId, isCompleted) => {
    try {
      const { data } = await axios.put(`${SERVER_URL}/tasks/${taskId}`, { isCompleted });
      setTasks(tasks.map(task => task._id === taskId ? data.task : task));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${SERVER_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`${SERVER_URL}/tasks/${editingTask._id}`, { title: editTitle });
      setTasks(tasks.map(task => 
        task._id === editingTask._id ? { ...task, title: editTitle } : task
      ));
      setEditingTask(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...tasks];
    
    // Apply filter
    if (filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.isCompleted);
    } else if (filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.isCompleted);
    }

    // Apply sort
    if (sortOrder === 'asc') {
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc') {
      filteredTasks.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filteredTasks;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4">Your Tasks</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              backgroundColor: 'rgba(63, 81, 181, 0.04)',
              borderRadius: 3,
              padding: '4px',
            }}>
              <Chip 
                label={`All (${tasks.length})`}
                onClick={() => setFilter('all')}
                color={filter === 'all' ? 'primary' : 'default'}
                variant={filter === 'all' ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '12px',
                  '&.MuiChip-filled': {
                    background: (theme) => theme.palette.gradient.primary,
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(63, 81, 181, 0.25)',
                  },
                  '&:hover': {
                    backgroundColor: filter === 'all' ? 'transparent' : 'rgba(63, 81, 181, 0.08)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
              <Chip 
                label={`Active (${tasks.filter(t => !t.isCompleted).length})`}
                onClick={() => setFilter('active')}
                color={filter === 'active' ? 'primary' : 'default'}
                variant={filter === 'active' ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '12px',
                  '&.MuiChip-filled': {
                    background: (theme) => theme.palette.gradient.primary,
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(63, 81, 181, 0.25)',
                  },
                  '&:hover': {
                    backgroundColor: filter === 'active' ? 'transparent' : 'rgba(63, 81, 181, 0.08)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
              <Chip 
                label={`Completed (${tasks.filter(t => t.isCompleted).length})`}
                onClick={() => setFilter('completed')}
                color={filter === 'completed' ? 'primary' : 'default'}
                variant={filter === 'completed' ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '12px',
                  '&.MuiChip-filled': {
                    background: (theme) => theme.palette.gradient.primary,
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(63, 81, 181, 0.25)',
                  },
                  '&:hover': {
                    backgroundColor: filter === 'completed' ? 'transparent' : 'rgba(63, 81, 181, 0.08)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            </Box>
            <Tooltip title="Sort tasks">
              <IconButton 
                onClick={() => setSortOrder(order => {
                  if (order === 'default') return 'asc';
                  if (order === 'asc') return 'desc';
                  return 'default';
                })}
                color={sortOrder !== 'default' ? 'primary' : 'default'}
                sx={{
                  backgroundColor: sortOrder !== 'default' ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.12)',
                  },
                }}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddTask(true)}
              sx={{
                background: (theme) => theme.palette.gradient.primary,
                boxShadow: '0 2px 8px rgba(63, 81, 181, 0.25)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.35)',
                },
              }}
            >
              Add Task
            </Button>
          </Box>
        </Box>

        <Slide direction="up" in={showAddTask} mountOnEnter unmountOnExit>
          <Box sx={{ mb: 4 }}>
            <TaskForm onAddTask={handleAddTask} />
          </Box>
        </Slide>

        <Fade in={true}>
          <div>
            <TaskList 
              tasks={getFilteredAndSortedTasks()}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditClick}
            />
          </div>
        </Fade>

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
              variant="outlined"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error"
            variant="filled"
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}