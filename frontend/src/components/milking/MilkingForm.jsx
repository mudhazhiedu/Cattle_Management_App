import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, Box, Autocomplete
} from '@mui/material';
import axios from '../../services/api';

const SESSIONS = ['AM', 'PM', 'Midday'];

export default function MilkingForm({ open, onClose, onSuccess }) {
  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    cow_id: '',
    record_date: new Date().toISOString().split('T')[0],
    record_time: new Date().toTimeString().slice(0, 5),
    session: new Date().getHours() < 12 ? 'AM' : 'PM',
    yield_liters: '',
    fat_percentage: '',
    protein_percentage: '',
    scc: '',
    milker_name: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchCows();
    }
  }, [open]);

  const fetchCows = async () => {
    try {
      const res = await axios.get('/cows');
      setCows(res.data.filter(c => c.current_status === 'Milking'));
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
      await axios.post('/milking', formData);
      onSuccess();
      onClose();
      setFormData({
        cow_id: '',
        record_date: new Date().toISOString().split('T')[0],
        record_time: new Date().toTimeString().slice(0, 5),
        session: new Date().getHours() < 12 ? 'AM' : 'PM',
        yield_liters: '',
        fat_percentage: '',
        protein_percentage: '',
        scc: '',
        milker_name: '',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save milking record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Milking Record</DialogTitle>
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

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date"
                name="record_date"
                value={formData.record_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="time"
                label="Time"
                name="record_time"
                value={formData.record_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Session"
                name="session"
                value={formData.session}
                onChange={handleChange}
              >
                {SESSIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Milk Yield (Liters)"
                name="yield_liters"
                value={formData.yield_liters}
                onChange={handleChange}
                inputProps={{ step: '0.1', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Milker Name"
                name="milker_name"
                value={formData.milker_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Fat %"
                name="fat_percentage"
                value={formData.fat_percentage}
                onChange={handleChange}
                inputProps={{ step: '0.1', min: '0', max: '100' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Protein %"
                name="protein_percentage"
                value={formData.protein_percentage}
                onChange={handleChange}
                inputProps={{ step: '0.1', min: '0', max: '100' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="SCC (cells/ml)"
                name="scc"
                value={formData.scc}
                onChange={handleChange}
                inputProps={{ min: '0' }}
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
