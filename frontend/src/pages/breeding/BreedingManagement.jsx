import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Tabs, Tab, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from '../../services/api';
import HeatForm from '../../components/breeding/HeatForm';
import AIForm from '../../components/breeding/AIForm';

export default function BreedingManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [heatRecords, setHeatRecords] = useState([]);
  const [aiRecords, setAIRecords] = useState([]);
  const [pregnancyRecords, setPregnancyRecords] = useState([]);
  const [calvingRecords, setCalvingRecords] = useState([]);
  const [heatFormOpen, setHeatFormOpen] = useState(false);
  const [aiFormOpen, setAIFormOpen] = useState(false);

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    try {
      const [heat, ai, pregnancy, calving] = await Promise.all([
        axios.get('/breeding/heat'),
        axios.get('/breeding/ai'),
        axios.get('/breeding/pregnancy'),
        axios.get('/breeding/calving')
      ]);
      setHeatRecords(heat.data);
      setAIRecords(ai.data);
      setPregnancyRecords(pregnancy.data);
      setCalvingRecords(calving.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Breeding Management</Typography>
        <Box>
          {tabValue === 0 && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setHeatFormOpen(true)}>
              Record Heat
            </Button>
          )}
          {tabValue === 1 && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAIFormOpen(true)}>
              Record AI
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Heat Detection" />
          <Tab label="AI Records" />
          <Tab label="Pregnancy" />
          <Tab label="Calving" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cow ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Intensity</TableCell>
                <TableCell>Symptoms</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {heatRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No heat records</TableCell>
                </TableRow>
              ) : (
                heatRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.cow_id}</TableCell>
                    <TableCell>{record.observation_date}</TableCell>
                    <TableCell>{record.observation_time || '-'}</TableCell>
                    <TableCell>{record.heat_intensity}</TableCell>
                    <TableCell>{record.symptoms || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cow ID</TableCell>
                <TableCell>AI Date</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Bull ID</TableCell>
                <TableCell>Bull Breed</TableCell>
                <TableCell>Attempt #</TableCell>
                <TableCell>Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aiRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No AI records</TableCell>
                </TableRow>
              ) : (
                aiRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.cow_id}</TableCell>
                    <TableCell>{record.ai_date}</TableCell>
                    <TableCell>{record.technician_name || '-'}</TableCell>
                    <TableCell>{record.bull_id || '-'}</TableCell>
                    <TableCell>{record.bull_breed || '-'}</TableCell>
                    <TableCell>{record.attempt_number}</TableCell>
                    <TableCell>{record.semen_cost ? `$${record.semen_cost}` : '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cow ID</TableCell>
                <TableCell>Check Date</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expected Calving</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pregnancyRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No pregnancy records</TableCell>
                </TableRow>
              ) : (
                pregnancyRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.cow_id}</TableCell>
                    <TableCell>{record.check_date}</TableCell>
                    <TableCell>{record.check_method || '-'}</TableCell>
                    <TableCell>{record.pregnancy_status}</TableCell>
                    <TableCell>{record.expected_calving_date || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cow ID</TableCell>
                <TableCell>Calving Date</TableCell>
                <TableCell>Calf Gender</TableCell>
                <TableCell>Birth Weight</TableCell>
                <TableCell>Calf Tag ID</TableCell>
                <TableCell>Ease Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calvingRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No calving records</TableCell>
                </TableRow>
              ) : (
                calvingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.cow_id}</TableCell>
                    <TableCell>{record.calving_date}</TableCell>
                    <TableCell>{record.calf_gender || '-'}</TableCell>
                    <TableCell>{record.calf_birth_weight ? `${record.calf_birth_weight} kg` : '-'}</TableCell>
                    <TableCell>{record.calf_tag_id || '-'}</TableCell>
                    <TableCell>{record.calving_ease_score || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <HeatForm
        open={heatFormOpen}
        onClose={() => setHeatFormOpen(false)}
        onSuccess={fetchAllRecords}
      />

      <AIForm
        open={aiFormOpen}
        onClose={() => setAIFormOpen(false)}
        onSuccess={fetchAllRecords}
      />
    </Container>
  );
}
