import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, Box
} from '@mui/material';
import axios from '../../services/api';

const BREEDS = ['Holstein', 'Jersey', 'Angus', 'Hereford', 'Simmental', 'Crossbreed', 'Other'];
const STATUSES = ['Calf', 'Heifer', 'Milking', 'Dry', 'Pregnant', 'Sold', 'Deceased'];

export default function CowForm({ open, onClose, cow, onSuccess }) {
  const [formData, setFormData] = useState({
    tag_id: '',
    name: '',
    birth_date: '',
    breed: '',
    purchase_date: '',
    purchase_price: '',
    current_status: 'Heifer',
    current_weight: '',
    body_condition_score: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cow) {
      setFormData({
        tag_id: cow.tag_id || '',
        name: cow.name || '',
        birth_date: cow.birth_date || '',
        breed: cow.breed || '',
        purchase_date: cow.purchase_date || '',
        purchase_price: cow.purchase_price || '',
        current_status: cow.current_status || 'Heifer',
        current_weight: cow.current_weight || '',
        body_condition_score: cow.body_condition_score || ''
      });
    } else {
      setFormData({
        tag_id: '',
        name: '',
        birth_date: '',
        breed: '',
        purchase_date: '',
        purchase_price: '',
        current_status: 'Heifer',
        current_weight: '',
        body_condition_score: ''
      });
    }
    setError('');
  }, [cow, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (cow) {
        await axios.put(`/cows/${cow.id}`, formData);
      } else {
        await axios.post('/cows', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save cow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{cow ? 'Edit Cow' : 'Add New Cow'}</DialogTitle>
        <DialogContent>
          {error && <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Tag ID"
                name="tag_id"
                value={formData.tag_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Birth Date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
              >
                {BREEDS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="current_status"
                value={formData.current_status}
                onChange={handleChange}
              >
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Current Weight (kg)"
                name="current_weight"
                value={formData.current_weight}
                onChange={handleChange}
                inputProps={{ step: '0.1' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Purchase Date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Purchase Price"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                inputProps={{ step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Body Condition Score (1-5)"
                name="body_condition_score"
                value={formData.body_condition_score}
                onChange={handleChange}
                inputProps={{ min: 1, max: 5, step: 0.5 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
