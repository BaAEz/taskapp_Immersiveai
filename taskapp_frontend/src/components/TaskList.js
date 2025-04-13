import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Paper
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
    <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
      {tasks.map((task) => (
        <ListItem
          key={task._id}
          secondaryAction={
            <>
              <IconButton 
                edge="end" 
                onClick={() => onEditTask(task)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => onDeleteTask(task._id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
          sx={{
            borderBottom: '1px solid #eee',
            textDecoration: task.isCompleted ? 'line-through' : 'none',
            opacity: task.isCompleted ? 0.7 : 1
          }}
        >
          <Checkbox
            checked={task.isCompleted || false}
            onChange={(e) => onToggleTask(task._id, e.target.checked)}
            sx={{ mr: 2 }}
          />
          <ListItemText
            primary={task.title || 'Untitled Task'}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;