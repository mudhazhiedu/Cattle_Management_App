import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Tabs, Tab, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import HealthRecordsTable from '../../components/health/HealthRecordsTable';
import HealthForm from '../../components/health/HealthForm';

export default function HealthManagement() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState(0);
  const [records, setRecords] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const recordTypes = ['vaccination', 'treatment', 'checkup', 'deworming', 'hoof_trim'];

  useEffect(() => {
    fetchRecords();
  }, [tab]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const type = recordTypes[tab];
      const res = await api.get(`/health?record_type=${type}`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Health Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Add Health Record
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Vaccinations" />
          <Tab label="Treatments" />
          <Tab label="Checkups" />
          <Tab label="Deworming" />
          <Tab label="Hoof Trimming" />
        </Tabs>
      </Paper>

      <HealthRecordsTable records={records} loading={loading} onRefresh={fetchRecords} />

      <HealthForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        recordType={recordTypes[tab]}
        onSuccess={fetchRecords}
      />
    </Container>
  );
}
