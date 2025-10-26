import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from '@mui/material';
import api from '../../services/api';

export default function FeedInventoryForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    feed_type: 'hay',
    feed_name: '',
    current_stock_kg: '',
    cost_per_kg: '',
    purchase_date: new Date().toISOString().split('T')[0],
    supplier_name: '',
    low_stock_threshold: '100',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feed/inventory', formData);
      onSuccess();
      onClose();
      setFormData({
        feed_type: 'hay',
        feed_name: '',
        current_stock_kg: '',
        cost_per_kg: '',
        purchase_date: new Date().toISOString().split('T')[0],
        supplier_name: '',
        low_stock_threshold: '100',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Feed Stock</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Feed Type"
                value={formData.feed_type}
                onChange={(e) => setFormData({ ...formData, feed_type: e.target.value })}
                required
              >
                <MenuItem value="hay">Hay</MenuItem>
                <MenuItem value="silage">Silage</MenuItem>
                <MenuItem value="concentrates">Concentrates</MenuItem>
                <MenuItem value="minerals">Minerals</MenuItem>
                <MenuItem value="supplements">Supplements</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Feed Name"
                value={formData.feed_name}
                onChange={(e) => setFormData({ ...formData, feed_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock (kg)"
                value={formData.current_stock_kg}
                onChange={(e) => setFormData({ ...formData, current_stock_kg: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Cost per kg"
                value={formData.cost_per_kg}
                onChange={(e) => setFormData({ ...formData, cost_per_kg: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Purchase Date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Supplier"
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Low Stock Alert (kg)"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
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
