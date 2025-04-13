import { useState, useEffect } from 'react';
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
  TextField
} from '@mui/material';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

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

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/tasks');
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
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title) => {
    try {
      const { data } = await axios.post('http://localhost:5000/tasks', { title });
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
      const { data } = await axios.put(`http://localhost:5000/tasks/${taskId}`, { isCompleted });
      setTasks(tasks.map(task => task._id === taskId ? data.task : task));
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
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
      const { data } = await axios.put(
        `http://localhost:5000/tasks/${editingTask._id}`, 
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
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        pt: 2
      }}>
        <Typography variant="h4">Task Manager</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1">Hello, {user?.email}</Typography>
          <Button onClick={logout} variant="outlined" color="secondary">
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

      <Dialog open={Boolean(editingTask)} onClose={() => setEditingTask(null)}>
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
  );
}