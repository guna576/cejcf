import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { Button, TextField } from '@mui/material';

function ModalComponent() {
  return (
    <div className="login">
      <div className="login-heading">Login</div>
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        autoFocus
      />
      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type="password"
        size="small"
        sx={{ mb: 1 }}
      />
      <Button variant="contained" color="primary">
        Login
      </Button>
    </div>
  );
}
// Login Widget as ReactWidget Start
export class Login extends ReactWidget {
  // Render Modal Component (Validation Modal + Feature Input Modal)
  render(): JSX.Element {
    return <ModalComponent />;
  }
}
// Login Widget End
