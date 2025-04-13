import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title);
    setTitle('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ ml: 2 }}>
        Add
      </Button>
    </Box>
  );
}