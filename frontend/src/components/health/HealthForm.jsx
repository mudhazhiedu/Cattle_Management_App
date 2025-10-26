import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from '@mui/material';
import api from '../../services/api';

export default function HealthForm({ open, onClose, recordType, onSuccess }) {
  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    cow_id: '',
    record_type: recordType,
    record_date: new Date().toISOString().split('T')[0],
    disease_name: '',
    symptoms: '',
    veterinarian_name: '',
    medication_name: '',
    dosage: '',
    route: 'oral',
    cost: '',
    next_due_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchCows();
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, record_type: recordType }));
  }, [recordType]);

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
      await api.post('/health', formData);
      onSuccess();
      onClose();
      setFormData({
        cow_id: '',
        record_type: recordType,
        record_date: new Date().toISOString().split('T')[0],
        disease_name: '',
        symptoms: '',
        veterinarian_name: '',
        medication_name: '',
        dosage: '',
        route: 'oral',
        cost: '',
        next_due_date: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Health Record - {recordType}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.record_date}
                onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Disease/Condition"
                value={formData.disease_name}
                onChange={(e) => setFormData({ ...formData, disease_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Veterinarian"
                value={formData.veterinarian_name}
                onChange={(e) => setFormData({ ...formData, veterinarian_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medication"
                value={formData.medication_name}
                onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Route"
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              >
                <MenuItem value="oral">Oral</MenuItem>
                <MenuItem value="injection">Injection</MenuItem>
                <MenuItem value="topical">Topical</MenuItem>
                <MenuItem value="iv">IV</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Cost"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Next Due Date"
                value={formData.next_due_date}
                onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
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
