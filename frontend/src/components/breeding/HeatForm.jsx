import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, Box, Autocomplete
} from '@mui/material';
import axios from '../../services/api';

const INTENSITIES = ['Weak', 'Moderate', 'Strong'];

export default function HeatForm({ open, onClose, onSuccess }) {
  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    cow_id: '',
    observation_date: new Date().toISOString().split('T')[0],
    observation_time: new Date().toTimeString().slice(0, 5),
    heat_intensity: 'Moderate',
    symptoms: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchCows();
      // Calculate next expected heat (21 days from now)
      const nextHeat = new Date();
      nextHeat.setDate(nextHeat.getDate() + 21);
      setFormData(prev => ({
        ...prev,
        next_expected_heat: nextHeat.toISOString().split('T')[0]
      }));
    }
  }, [open]);

  const fetchCows = async () => {
    try {
      const res = await axios.get('/cows');
      setCows(res.data.filter(c => ['Heifer', 'Milking', 'Dry'].includes(c.current_status)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCowChange = (event, value) => {
    setFormData({ ...formData, cow_id: value?.id || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/breeding/heat', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save heat record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Record Heat Detection</DialogTitle>
        <DialogContent>
          {error && <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={cows}
                getOptionLabel={(option) => `${option.tag_id} - ${option.name || 'No name'}`}
                onChange={handleCowChange}
                renderInput={(params) => (
                  <TextField {...params} label="Select Cow" required />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Observation Date"
                name="observation_date"
                value={formData.observation_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Observation Time"
                name="observation_time"
                value={formData.observation_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Heat Intensity"
                name="heat_intensity"
                value={formData.heat_intensity}
                onChange={handleChange}
              >
                {INTENSITIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Symptoms (mounting, mucus, restlessness)"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
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
