import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Chip, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { format } from 'date-fns';

export default function CowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cow, setCow] = useState(null);
  const [milkingRecords, setMilkingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCowDetails();
    fetchMilkingRecords();
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

  const fetchMilkingRecords = async () => {
    try {
      const res = await axios.get(`/milking?cow_id=${id}`);
      setMilkingRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const years = new Date().getFullYear() - new Date(birthDate).getFullYear();
    const months = new Date().getMonth() - new Date(birthDate).getMonth();
    return `${years}y ${months}m`;
  };

  const totalMilk = milkingRecords.reduce((sum, r) => sum + parseFloat(r.yield_liters || 0), 0);
  const avgMilk = milkingRecords.length > 0 ? (totalMilk / milkingRecords.length).toFixed(1) : 0;

  if (loading) return <Container sx={{ mt: 4 }}><Typography>Loading...</Typography></Container>;
  if (!cow) return <Container sx={{ mt: 4 }}><Typography>Cow not found</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button startIcon={<EditIcon />} variant="contained">
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {cow.name || 'Unnamed'} ({cow.tag_id})
            </Typography>
            <Chip label={cow.current_status} color="primary" />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">Breed</Typography>
            <Typography variant="body1">{cow.breed || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">Age</Typography>
            <Typography variant="body1">{calculateAge(cow.birth_date)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">Birth Date</Typography>
            <Typography variant="body1">{cow.birth_date || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">Current Weight</Typography>
            <Typography variant="body1">{cow.current_weight ? `${cow.current_weight} kg` : '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">Body Condition Score</Typography>
            <Typography variant="body1">{cow.body_condition_score || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">Purchase Price</Typography>
            <Typography variant="body1">{cow.purchase_price ? `$${cow.purchase_price}` : '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Milking History
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Total Records: {milkingRecords.length} | Total Milk: {totalMilk.toFixed(1)}L | Average: {avgMilk}L
          </Typography>
        </Box>
        
        {milkingRecords.length === 0 ? (
          <Typography color="textSecondary">No milking records</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Session</TableCell>
                  <TableCell>Yield (L)</TableCell>
                  <TableCell>Fat %</TableCell>
                  <TableCell>Protein %</TableCell>
                  <TableCell>Milker</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {milkingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.record_date}</TableCell>
                    <TableCell>{record.record_time}</TableCell>
                    <TableCell>{record.session}</TableCell>
                    <TableCell>{record.yield_liters}</TableCell>
                    <TableCell>{record.fat_percentage || '-'}</TableCell>
                    <TableCell>{record.protein_percentage || '-'}</TableCell>
                    <TableCell>{record.milker_name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
