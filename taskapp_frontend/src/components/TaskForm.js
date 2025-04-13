import { useState } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title);
    setTitle('');
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: 'primary.light',
        background: 'linear-gradient(rgba(255,255,255,.8), rgba(255,255,255,.9))',
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            }
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ 
            px: 4,
            whiteSpace: 'nowrap',
            minWidth: '120px',
          }}
        >
          Add Task
        </Button>
      </Box>
    </Paper>
  );
}