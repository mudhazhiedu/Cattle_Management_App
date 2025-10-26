import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText
} from '@mui/material';

export default function DeleteConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirm Delete'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
