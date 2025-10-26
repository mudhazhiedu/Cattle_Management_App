import { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Grid, Chip, Button, Divider, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

export default function CowDetailEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [cow, setCow] = useState(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCowDetails();
  }, [id]);

  const fetchCowDetails = async () => {
    try {
      const res = await axios.get(`/cows/${id}`);
      setCow(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const years = new Date().getFullYear() - new Date(birthDate).getFullYear();
    const months = new Date().getMonth() - new Date(birthDate).getMonth();
    return `${years}y ${months}m`;
  };

  if (loading) return <Container sx={{ mt: 4 }}><Typography>Loading...</Typography></Container>;
  if (!cow) return <Container sx={{ mt: 4 }}><Typography>Cow not found</Typography></Container>;

  const totalMilk = cow.milking_records?.reduce((sum, r) => sum + parseFloat(r.yield_liters || 0), 0) || 0;
  const totalHealthCost = cow.health_records?.reduce((sum, r) => sum + parseFloat(r.cost || 0), 0) || 0;
  const totalFeedCost = cow.feed_consumption?.reduce((sum, r) => sum + parseFloat(r.cost || 0), 0) || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>Back</Button>
        {isAdmin() && <Button startIcon={<EditIcon />} variant="contained">Edit</Button>}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>{cow.name || 'Unnamed'} ({cow.tag_id})</Typography>
        <Chip label={cow.current_status} color="primary" />
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">Breed</Typography>
            <Typography variant="body1">{cow.breed || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">Age</Typography>
            <Typography variant="body1">{calculateAge(cow.birth_date)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">Weight</Typography>
            <Typography variant="body1">{cow.current_weight ? `${cow.current_weight} kg` : '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">Purchase Price</Typography>
            <Typography variant="body1">{cow.purchase_price ? `$${cow.purchase_price}` : '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable">
          <Tab label={`Milking (${cow.milking_records?.length || 0})`} />
          <Tab label={`Breeding (${(cow.heat_records?.length || 0) + (cow.ai_records?.length || 0)})`} />
          <Tab label={`Health (${cow.health_records?.length || 0})`} />
          <Tab label={`Financial (${cow.transactions?.length || 0})`} />
          <Tab label={`Feed (${cow.feed_consumption?.length || 0})`} />
          <Tab label={`Reminders (${cow.reminders?.length || 0})`} />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Milking Records</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Total: {totalMilk.toFixed(1)}L | Records: {cow.milking_records?.length || 0}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Yield (L)</TableCell>
                    <TableCell>Fat %</TableCell>
                    <TableCell>SCC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cow.milking_records?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center">No records</TableCell></TableRow>
                  ) : (
                    cow.milking_records?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.record_date}</TableCell>
                        <TableCell>{r.session}</TableCell>
                        <TableCell>{r.yield_liters}</TableCell>
                        <TableCell>{r.fat_percentage || '-'}</TableCell>
                        <TableCell>{r.scc || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Breeding History</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Heat Records</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow><TableCell>Date</TableCell><TableCell>Intensity</TableCell><TableCell>Notes</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {cow.heat_records?.length === 0 ? (
                    <TableRow><TableCell colSpan={3} align="center">No records</TableCell></TableRow>
                  ) : (
                    cow.heat_records?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.observation_date}</TableCell>
                        <TableCell>{r.intensity}</TableCell>
                        <TableCell>{r.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>AI Records</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow><TableCell>Date</TableCell><TableCell>Bull ID</TableCell><TableCell>Technician</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {cow.ai_records?.length === 0 ? (
                    <TableRow><TableCell colSpan={3} align="center">No records</TableCell></TableRow>
                  ) : (
                    cow.ai_records?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.ai_date}</TableCell>
                        <TableCell>{r.bull_id || '-'}</TableCell>
                        <TableCell>{r.technician_name || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Health Records</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Total Cost: ${totalHealthCost.toFixed(2)}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cow.health_records?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">No records</TableCell></TableRow>
                  ) : (
                    cow.health_records?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.record_date}</TableCell>
                        <TableCell><Chip label={r.record_type} size="small" /></TableCell>
                        <TableCell>{r.disease_name || r.medication_name || '-'}</TableCell>
                        <TableCell>${r.cost || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Financial Transactions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cow.transactions?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">No transactions</TableCell></TableRow>
                  ) : (
                    cow.transactions?.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.transaction_date}</TableCell>
                        <TableCell><Chip label={t.transaction_type} size="small" color={t.transaction_type === 'income' ? 'success' : 'error'} /></TableCell>
                        <TableCell>{t.category}</TableCell>
                        <TableCell>${parseFloat(t.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>Feed Consumption</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Total Cost: ${totalFeedCost.toFixed(2)}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Feed</TableCell>
                    <TableCell>Quantity (kg)</TableCell>
                    <TableCell>Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cow.feed_consumption?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">No records</TableCell></TableRow>
                  ) : (
                    cow.feed_consumption?.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>{f.consumption_date}</TableCell>
                        <TableCell>{f.feed?.feed_name || '-'}</TableCell>
                        <TableCell>{parseFloat(f.quantity_kg).toFixed(2)}</TableCell>
                        <TableCell>${parseFloat(f.cost || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tab === 5 && (
          <Box>
            <Typography variant="h6" gutterBottom>Pending Reminders</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Priority</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cow.reminders?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">No pending reminders</TableCell></TableRow>
                  ) : (
                    cow.reminders?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.reminder_date}</TableCell>
                        <TableCell><Chip label={r.reminder_type} size="small" /></TableCell>
                        <TableCell>{r.message}</TableCell>
                        <TableCell><Chip label={r.priority} size="small" color={r.priority === 'urgent' ? 'error' : 'default'} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
