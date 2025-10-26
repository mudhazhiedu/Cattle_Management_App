import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Tabs, Tab, Paper, Grid, Card, CardContent } from '@mui/material';
import { Add as AddIcon, TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import api from '../../services/api';
import FinancialTable from '../../components/financial/FinancialTable';
import FinancialForm from '../../components/financial/FinancialForm';

export default function FinancialManagement() {
  const [tab, setTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, profit: 0 });
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [tab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const type = tab === 0 ? 'income' : 'expense';
      const res = await api.get(`/financial?transaction_type=${type}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get('/financial/summary');
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Financial Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Add Transaction
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Total Income</Typography>
              </Box>
              <Typography variant="h4">${summary.income.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Total Expenses</Typography>
              </Box>
              <Typography variant="h4">${summary.expense.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalance color={summary.profit >= 0 ? 'success' : 'error'} sx={{ mr: 1 }} />
                <Typography color="text.secondary">Net Profit</Typography>
              </Box>
              <Typography variant="h4" color={summary.profit >= 0 ? 'success.main' : 'error.main'}>
                ${summary.profit.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Income" />
          <Tab label="Expenses" />
        </Tabs>
      </Paper>

      <FinancialTable transactions={transactions} loading={loading} onRefresh={fetchTransactions} />

      <FinancialForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        transactionType={tab === 0 ? 'income' : 'expense'}
        onSuccess={() => {
          fetchTransactions();
          fetchSummary();
        }}
      />
    </Container>
  );
}
