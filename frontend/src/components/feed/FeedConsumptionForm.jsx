import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from '@mui/material';
import api from '../../services/api';

export default function FeedConsumptionForm({ open, onClose, inventory, onSuccess }) {
  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    cow_id: '',
    feed_inventory_id: '',
    consumption_date: new Date().toISOString().split('T')[0],
    quantity_kg: '',
    notes: ''
  });

  useEffect(() => {
    if (open) fetchCows();
  }, [open]);

  const fetchCows = async () => {
    try {
      const res = await api.get('/cows');
      setCows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feed/consumption', formData);
      onSuccess();
      onClose();
      setFormData({
        cow_id: '',
        feed_inventory_id: '',
        consumption_date: new Date().toISOString().split('T')[0],
        quantity_kg: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Record Feed Consumption</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cow"
                value={formData.cow_id}
                onChange={(e) => setFormData({ ...formData, cow_id: e.target.value })}
                required
              >
                {cows.map((cow) => (
                  <MenuItem key={cow.id} value={cow.id}>
                    {cow.tag_id} - {cow.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Feed"
                value={formData.feed_inventory_id}
                onChange={(e) => setFormData({ ...formData, feed_inventory_id: e.target.value })}
                required
              >
                {inventory.map((feed) => (
                  <MenuItem key={feed.id} value={feed.id}>
                    {feed.feed_name} ({feed.current_stock_kg} kg available)
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.consumption_date}
                onChange={(e) => setFormData({ ...formData, consumption_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity (kg)"
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
