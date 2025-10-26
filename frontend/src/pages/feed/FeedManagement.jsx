import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Tabs, Tab, Paper, Grid, Card, CardContent, Alert } from '@mui/material';
import { Add as AddIcon, Warning as WarningIcon } from '@mui/icons-material';
import api from '../../services/api';
import FeedInventoryTable from '../../components/feed/FeedInventoryTable';
import FeedConsumptionTable from '../../components/feed/FeedConsumptionTable';
import FeedInventoryForm from '../../components/feed/FeedInventoryForm';
import FeedConsumptionForm from '../../components/feed/FeedConsumptionForm';

export default function FeedManagement() {
  const [tab, setTab] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [consumption, setConsumption] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [inventoryFormOpen, setInventoryFormOpen] = useState(false);
  const [consumptionFormOpen, setConsumptionFormOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchConsumption();
    fetchLowStock();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/feed/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConsumption = async () => {
    try {
      const res = await api.get('/feed/consumption');
      setConsumption(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await api.get('/feed/inventory/alerts');
      setLowStock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalStock = inventory.reduce((sum, item) => sum + parseFloat(item.current_stock_kg || 0), 0);
  const totalValue = inventory.reduce((sum, item) => sum + (parseFloat(item.current_stock_kg || 0) * parseFloat(item.cost_per_kg || 0)), 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Feed Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => tab === 0 ? setInventoryFormOpen(true) : setConsumptionFormOpen(true)}>
          {tab === 0 ? 'Add Feed Stock' : 'Record Consumption'}
        </Button>
      </Box>

      {lowStock.length > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          {lowStock.length} feed item(s) below threshold: {lowStock.map(f => f.feed_name).join(', ')}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Stock</Typography>
              <Typography variant="h4">{totalStock.toFixed(0)} kg</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Value</Typography>
              <Typography variant="h4">${totalValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Inventory" />
          <Tab label="Consumption History" />
        </Tabs>
      </Paper>

      {tab === 0 ? (
        <FeedInventoryTable inventory={inventory} onRefresh={fetchInventory} />
      ) : (
        <FeedConsumptionTable consumption={consumption} onRefresh={fetchConsumption} />
      )}

      <FeedInventoryForm
        open={inventoryFormOpen}
        onClose={() => setInventoryFormOpen(false)}
        onSuccess={() => {
          fetchInventory();
          fetchLowStock();
        }}
      />

      <FeedConsumptionForm
        open={consumptionFormOpen}
        onClose={() => setConsumptionFormOpen(false)}
        inventory={inventory}
        onSuccess={() => {
          fetchConsumption();
          fetchInventory();
        }}
      />
    </Container>
  );
}
