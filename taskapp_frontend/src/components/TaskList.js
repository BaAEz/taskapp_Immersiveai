import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaskList = ({ 
  tasks = [], 
  onToggleTask = () => {}, 
  onDeleteTask = () => {}, 
  onEditTask = () => {} 
}) => {
  if (!Array.isArray(tasks)) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" align="center" color="error">
          Invalid tasks data
        </Typography>
      </Paper>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" align="center">
          No tasks found. Add a new task to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'primary.light',
        background: 'linear-gradient(rgba(255,255,255,.8), rgba(255,255,255,.9))',
      }}
    >
      <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={() => onEditTask(task)}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => onDeleteTask(task._id)}
                  sx={{ 
                    color: 'error.main',
                    '&:hover': { backgroundColor: 'error.light', color: 'white' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
            sx={{
              borderBottom: '1px solid',
              borderColor: 'primary.light',
              py: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: (theme) => `${theme.palette.primary.light}11`,
              },
              textDecoration: task.isCompleted ? 'line-through' : 'none',
              opacity: task.isCompleted ? 0.7 : 1
            }}
          >
            <Checkbox
              checked={task.isCompleted || false}
              onChange={(e) => onToggleTask(task._id, e.target.checked)}
              sx={{ 
                color: 'primary.main',
                '&.Mui-checked': {
                  color: 'primary.main',
                }
              }}
            />
            <ListItemText
              primary={task.title || 'Untitled Task'}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TaskList;