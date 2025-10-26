import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

export default function FeedInventoryTable({ inventory }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feed Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Stock (kg)</TableCell>
            <TableCell>Cost/kg</TableCell>
            <TableCell>Total Value</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">No feed inventory</TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => {
              const isLowStock = parseFloat(item.current_stock_kg) <= parseFloat(item.low_stock_threshold);
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.feed_name}</TableCell>
                  <TableCell><Chip label={item.feed_type} size="small" /></TableCell>
                  <TableCell>{parseFloat(item.current_stock_kg).toFixed(2)}</TableCell>
                  <TableCell>${item.cost_per_kg || 0}</TableCell>
                  <TableCell>${(parseFloat(item.current_stock_kg) * parseFloat(item.cost_per_kg || 0)).toFixed(2)}</TableCell>
                  <TableCell>{item.supplier_name || '-'}</TableCell>
                  <TableCell>
                    <Chip label={isLowStock ? 'Low Stock' : 'OK'} size="small" color={isLowStock ? 'warning' : 'success'} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
