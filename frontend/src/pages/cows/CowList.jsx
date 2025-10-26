import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, CircularProgress, Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import CowTable from '../../components/cows/CowTable';
import CowForm from '../../components/cows/CowForm';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

export default function CowList() {
  const { isAdmin } = useAuth();
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCow, setSelectedCow] = useState(null);

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/cows');
      setCows(res.data);
    } catch (err) {
      setError('Failed to load cows');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCow(null);
    setFormOpen(true);
  };

  const handleEdit = (cow) => {
    setSelectedCow(cow);
    setFormOpen(true);
  };

  const handleDeleteClick = (cow) => {
    setSelectedCow(cow);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/cows/${selectedCow.id}`);
      setDeleteOpen(false);
      setSelectedCow(null);
      fetchCows();
    } catch (err) {
      setError('Failed to delete cow');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Cattle Management
        </Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Cow
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : cows.length === 0 ? (
        <Alert severity="info">No cows found. Click "Add Cow" to get started.</Alert>
      ) : (
        <CowTable
          cows={cows}
          onEdit={isAdmin() ? handleEdit : null}
          onDelete={isAdmin() ? handleDeleteClick : null}
        />
      )}

      <CowForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        cow={selectedCow}
        onSuccess={fetchCows}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Cow"
        message={`Are you sure you want to delete ${selectedCow?.name || selectedCow?.tag_id}? This action cannot be undone.`}
      />
    </Container>
  );
}
