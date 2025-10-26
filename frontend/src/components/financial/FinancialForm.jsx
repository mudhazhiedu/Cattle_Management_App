import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from '@mui/material';
import api from '../../services/api';

const incomeCategories = ['Milk Sale', 'Animal Sale', 'Manure Sale', 'Other Income'];
const expenseCategories = ['Feed', 'Veterinary', 'Labor', 'Equipment', 'Utilities', 'Insurance', 'Other Expense'];

export default function FinancialForm({ open, onClose, transactionType, onSuccess }) {
  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_type: transactionType,
    category: '',
    amount: '',
    quantity: '',
    price_per_unit: '',
    description: '',
    payment_method: 'cash',
    payment_status: 'paid',
    related_cow_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchCows();
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, transaction_type: transactionType, category: '' }));
  }, [transactionType]);

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
      await api.post('/financial', formData);
      onSuccess();
      onClose();
      setFormData({
        transaction_date: new Date().toISOString().split('T')[0],
        transaction_type: transactionType,
        category: '',
        amount: '',
        quantity: '',
        price_per_unit: '',
        description: '',
        payment_method: 'cash',
        payment_status: 'paid',
        related_cow_id: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add {transactionType === 'income' ? 'Income' : 'Expense'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Price per Unit"
                value={formData.price_per_unit}
                onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="mobile_payment">Mobile Payment</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Payment Status"
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Related Cow (Optional)"
                value={formData.related_cow_id}
                onChange={(e) => setFormData({ ...formData, related_cow_id: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {cows.map((cow) => (
                  <MenuItem key={cow.id} value={cow.id}>
                    {cow.tag_id} - {cow.name}
                  </MenuItem>
                ))}
              </TextField>
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
