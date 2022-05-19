import React, { useEffect, useState } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { Backdrop, CircularProgress } from '@mui/material';
import {
  access_token,
  BASE_URL,
  branch,
  repo_slug,
  VERSION,
  workspace
} from '../utils/ExportEnvVars';
import { postData } from '../utils/PostData';
import Swal from 'sweetalert2';

interface ModalProps {
  featureCode: string;
  fileName: string;
}

function ModalComponent(props: ModalProps) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const handleOpenBackdrop = () => setBackdropOpen(true);
  const handleCloseBackdrop = () => setBackdropOpen(false);

  useEffect(() => {
    handleOpenBackdrop();
    const featureCode = props.featureCode;
    const fileName = props.fileName;
    const data = new FormData();
    data.append(fileName, featureCode);
    const commit_message = `Edited ${fileName}`;
    data.append('message', commit_message);
    data.append('branch', branch);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${access_token}`);
    const url = `${BASE_URL}/${VERSION}/repositories/${workspace}/${repo_slug}/src`;

    postData({ url, headers, data })
      .then(response => {
        handleCloseBackdrop();
        if (response.status === 201) {
          Swal.fire({
            title: 'Success!',
            text: 'Feature Code Pushed Successfully!',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to Push Feature Code',
            icon: 'error'
          });
        }
      })
      .catch(err => {
        console.log(err);
        handleCloseBackdrop();
        Swal.fire({
          title: 'Error!',
          text: 'Failed to Push Feature Code',
          icon: 'error'
        });
      });
  }, []);

  return (
    <div>
      <Backdrop open={backdropOpen} sx={{ zIndex: 1000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

// Modal Widget as ReactWidget Start
export class PushModal extends ReactWidget {
  featureCode: string;
  fileName: string;
  constructor(featureCode: string, fileName: string) {
    super();
    this.addClass('jp-ReactWidget');
    this.featureCode = featureCode;
    this.fileName = fileName;
  }
  // Render Modal Component (Validation Modal + Feature Input Modal)
  render(): JSX.Element {
    return (
      <ModalComponent featureCode={this.featureCode} fileName={this.fileName} />
    );
  }
}
// Modal Widget End
