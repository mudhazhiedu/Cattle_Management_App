import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Box, Typography } from '@mui/material';
import { format } from 'date-fns';

export default function FinancialTable({ transactions, loading }) {
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
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price/Unit</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">No transactions found</TableCell>
            </TableRow>
          ) : (
            transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell>{format(new Date(txn.transaction_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell><Chip label={txn.category} size="small" /></TableCell>
                <TableCell>{txn.description || '-'}</TableCell>
                <TableCell>{txn.quantity || '-'}</TableCell>
                <TableCell>{txn.price_per_unit ? `$${txn.price_per_unit}` : '-'}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={txn.transaction_type === 'income' ? 'success.main' : 'error.main'}>
                    ${parseFloat(txn.amount).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={txn.payment_status} 
                    size="small" 
                    color={txn.payment_status === 'paid' ? 'success' : txn.payment_status === 'pending' ? 'warning' : 'error'} 
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
