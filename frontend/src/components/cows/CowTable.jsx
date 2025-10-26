import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function CowTable({ cows, onEdit, onDelete }) {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    const colors = {
      'Milking': 'success',
      'Pregnant': 'info',
      'Dry': 'warning',
      'Heifer': 'default',
      'Calf': 'secondary'
    };
    return colors[status] || 'default';
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const years = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return `${years}y`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tag ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Breed</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Weight (kg)</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cows.map((cow) => (
            <TableRow key={cow.id} hover>
              <TableCell>{cow.tag_id}</TableCell>
              <TableCell>{cow.name || '-'}</TableCell>
              <TableCell>{cow.breed || '-'}</TableCell>
              <TableCell>{calculateAge(cow.birth_date)}</TableCell>
              <TableCell>
                <Chip 
                  label={cow.current_status} 
                  color={getStatusColor(cow.current_status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{cow.current_weight || '-'}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => navigate(`/cows/${cow.id}`)} color="info">
                  <ViewIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onEdit(cow)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(cow)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
