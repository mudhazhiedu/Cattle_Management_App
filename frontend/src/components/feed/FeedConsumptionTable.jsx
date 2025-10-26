import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format } from 'date-fns';

export default function FeedConsumptionTable({ consumption }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Cow</TableCell>
            <TableCell>Feed</TableCell>
            <TableCell>Quantity (kg)</TableCell>
            <TableCell>Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consumption.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">No consumption records</TableCell>
            </TableRow>
          ) : (
            consumption.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.consumption_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{record.cow?.tag_id} - {record.cow?.name}</TableCell>
                <TableCell>{record.feed?.feed_name}</TableCell>
                <TableCell>{parseFloat(record.quantity_kg).toFixed(2)}</TableCell>
                <TableCell>${parseFloat(record.cost || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
