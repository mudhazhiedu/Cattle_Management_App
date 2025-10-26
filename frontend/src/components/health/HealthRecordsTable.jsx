import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Box } from '@mui/material';
import { format } from 'date-fns';

export default function HealthRecordsTable({ records, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Cow</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Veterinarian</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Next Due</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">No records found</TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.record_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{record.cow?.tag_id} - {record.cow?.name}</TableCell>
                <TableCell><Chip label={record.record_type} size="small" /></TableCell>
                <TableCell>{record.disease_name || record.medication_name || '-'}</TableCell>
                <TableCell>{record.veterinarian_name || '-'}</TableCell>
                <TableCell>${record.cost || 0}</TableCell>
                <TableCell>{record.next_due_date ? format(new Date(record.next_due_date), 'MMM dd, yyyy') : '-'}</TableCell>
                <TableCell>
                  {record.outcome && <Chip label={record.outcome} size="small" color={record.outcome === 'recovered' ? 'success' : 'default'} />}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
