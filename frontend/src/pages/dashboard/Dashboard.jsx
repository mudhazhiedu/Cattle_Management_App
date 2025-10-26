import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Button, Card, CardContent
} from '@mui/material';
import {
  Pets as PetsIcon,
  LocalDrink as MilkIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from '../../services/api';
import MilkingForm from '../../components/milking/MilkingForm';
import RemindersWidget from '../../components/reminders/RemindersWidget';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCows: 0,
    milkingCows: 0,
    todayMilk: 0,
    avgMilkPerCow: 0
  });
  const [milkingFormOpen, setMilkingFormOpen] = useState(false);
  const [recentMilking, setRecentMilking] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentMilking();
  }, []);

  const fetchStats = async () => {
    try {
      const cowsRes = await axios.get('/cows');
      const cows = cowsRes.data;
      const milkingCows = cows.filter(c => c.current_status === 'Milking');
      
      const today = new Date().toISOString().split('T')[0];
      const milkingRes = await axios.get('/milking');
      const todayRecords = milkingRes.data.filter(r => r.record_date === today);
      const todayMilk = todayRecords.reduce((sum, r) => sum + parseFloat(r.yield_liters || 0), 0);

      setStats({
        totalCows: cows.length,
        milkingCows: milkingCows.length,
        todayMilk: todayMilk.toFixed(1),
        avgMilkPerCow: milkingCows.length > 0 ? (todayMilk / milkingCows.length).toFixed(1) : 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentMilking = async () => {
    try {
      const res = await axios.get('/milking');
      setRecentMilking(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMilkingFormOpen(true)}
        >
          Add Milking
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cows"
            value={stats.totalCows}
            icon={<PetsIcon fontSize="inherit" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Milking Cows"
            value={stats.milkingCows}
            icon={<MilkIcon fontSize="inherit" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Milk (L)"
            value={stats.todayMilk}
            icon={<TrendingUpIcon fontSize="inherit" />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg per Cow (L)"
            value={stats.avgMilkPerCow}
            icon={<MilkIcon fontSize="inherit" />}
            color="warning.main"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RemindersWidget />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Milking Records
            </Typography>
            {recentMilking.length === 0 ? (
              <Typography color="textSecondary">No milking records yet</Typography>
            ) : (
              <Box>
                {recentMilking.map((record, idx) => (
                  <Box key={idx} sx={{ py: 1, borderBottom: idx < recentMilking.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      <strong>Cow ID:</strong> {record.cow_id} | 
                      <strong> Date:</strong> {record.record_date} | 
                      <strong> Session:</strong> {record.session} | 
                      <strong> Yield:</strong> {record.yield_liters}L
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <MilkingForm
        open={milkingFormOpen}
        onClose={() => setMilkingFormOpen(false)}
        onSuccess={() => {
          fetchStats();
          fetchRecentMilking();
        }}
      />
    </Container>
  );
}
