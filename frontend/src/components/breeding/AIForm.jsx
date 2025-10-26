import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Box, Autocomplete
} from '@mui/material';
import axios from '../../services/api';

export default function AIForm({ open, onClose, onSuccess }) {
  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    cow_id: '',
    ai_date: new Date().toISOString().split('T')[0],
    ai_time: new Date().toTimeString().slice(0, 5),
    technician_name: '',
    bull_id: '',
    bull_breed: '',
    semen_batch: '',
    semen_cost: '',
    insemination_method: 'Fixed-time AI',
    attempt_number: 1,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) fetchCows();
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
      await axios.post('/breeding/ai', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save AI record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Record Artificial Insemination</DialogTitle>
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
                label="AI Date"
                name="ai_date"
                value={formData.ai_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="AI Time"
                name="ai_time"
                value={formData.ai_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Technician Name"
                name="technician_name"
                value={formData.technician_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Attempt Number"
                name="attempt_number"
                value={formData.attempt_number}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bull ID"
                name="bull_id"
                value={formData.bull_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bull Breed"
                name="bull_breed"
                value={formData.bull_breed}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Semen Batch"
                name="semen_batch"
                value={formData.semen_batch}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Semen Cost"
                name="semen_cost"
                value={formData.semen_cost}
                onChange={handleChange}
                inputProps={{ step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Insemination Method"
                name="insemination_method"
                value={formData.insemination_method}
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
