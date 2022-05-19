import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { Backdrop, CircularProgress } from '@mui/material';

function ModalComponent() {
  return (
    <Backdrop open={true} sx={{ zIndex: 1000 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
// Progress Widget as ReactWidget Start
export class Progress extends ReactWidget {
  // Render Modal Component (Validation Modal + Feature Input Modal)
  render(): JSX.Element {
    return <ModalComponent />;
  }
}
// Progress Widget End
