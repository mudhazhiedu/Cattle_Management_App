import { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip, IconButton, Box, Button } from '@mui/material';
import { CheckCircle, Close, Notifications } from '@mui/icons-material';
import api from '../../services/api';
import { format } from 'date-fns';

export default function RemindersWidget() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminders?status=pending');
      setReminders(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/reminders/${id}`, { status: 'completed' });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.put(`/reminders/${id}`, { status: 'dismissed' });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = { urgent: 'error', high: 'warning', medium: 'info', low: 'default' };
    return colors[priority] || 'default';
  };

  if (loading) return null;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Notifications sx={{ mr: 1 }} />
        <Typography variant="h6">Pending Reminders</Typography>
        <Chip label={reminders.length} size="small" sx={{ ml: 1 }} />
      </Box>
      
      {reminders.length === 0 ? (
        <Typography color="text.secondary">No pending reminders</Typography>
      ) : (
        <List dense>
          {reminders.map((reminder) => (
            <ListItem
              key={reminder.id}
              secondaryAction={
                <Box>
                  <IconButton size="small" onClick={() => handleComplete(reminder.id)} color="success">
                    <CheckCircle fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDismiss(reminder.id)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{reminder.message}</Typography>
                    <Chip label={reminder.priority} size="small" color={getPriorityColor(reminder.priority)} />
                  </Box>
                }
                secondary={`${reminder.cow?.tag_id} - ${format(new Date(reminder.reminder_date), 'MMM dd, yyyy')}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
