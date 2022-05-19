import React, { useState } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Backdrop, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
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
import { LoadingButton } from '@mui/lab';
import { fetchFeatureList } from '../utils/FetchFeatureList';
import { NotebookActions, NotebookPanel } from '@jupyterlab/notebook';

// convert the given string pascal scale
function toPascalCase(str: string) {
  return (' ' + str)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
}

interface ModalProps {
  code: string;
  panel: NotebookPanel;
}

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

// Modal Component for Feature Code push workflow - Start
function ModalComponent({ code, panel }: ModalProps) {
  const [open, setOpen] = useState(true);
  const [openInput, setOpenInput] = useState(false);
  const [openTest, setOpenTest] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState('');
  const [testObj, setTestObj] = useState('');
  const [pascal, setPascal] = useState('');
  const handleClose = () => setOpen(false);
  const handleOpenInput = () => setOpenInput(true);
  const handleOpenTest = () => setOpenTest(true);
  const handleCloseTest = () => setOpenTest(false);
  const handleCloseInput = () => setOpenInput(false);
  const handleOpenBackdrop = () => setBackdropOpen(true);
  const handleCloseBackdrop = () => setBackdropOpen(false);

  // Push Code API call
  const pushCode = (featureCode: string, fileName: string) => {
    handleCloseInput();
    handleOpenBackdrop();

    const data = new FormData();
    data.append(fileName, featureCode);
    const commit_message = `Pushed ${fileName}`;
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
  };

  // handle submit from feature input modal
  const handleSubmit = () => {
    const featureCode = code.replace('FeatureClass', pascal);
    const fileName = `${pascal.toLowerCase()}.py`;

    setLoading(true);
    fetchFeatureList().then((featureList: string[]) => {
      setLoading(false);
      if (featureList.includes(fileName)) {
        Swal.fire({
          title: 'Feature name already exists!',
          text: 'A feature with this name already exits. A new version of this feature will be pushed.',
          icon: 'info',
          showCancelButton: true
        }).then(result => {
          if (result.isConfirmed) {
            pushCode(featureCode, fileName);
          }
        });
      } else {
        pushCode(featureCode, fileName);
      }
    });
  };

  const handleTest = () => {
    panel.content.activeCellIndex = panel.content.widgets.length - 1;
    NotebookActions.insertBelow(panel.content);
    NotebookActions.replaceSelection(panel.content, code);
    NotebookActions.run(panel.content, panel.context.sessionContext);

    const obj = `obj = FeatureClass()\nobj.processFeature(${testObj})`;
    NotebookActions.insertBelow(panel.content);
    NotebookActions.replaceSelection(panel.content, obj);
    NotebookActions.run(panel.content, panel.context.sessionContext);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Feature Code
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <pre>
              <code>{code}</code>
            </pre>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              handleOpenTest();
            }}
          >
            Test Code
          </Button>
          <Button
            autoFocus
            onClick={() => {
              handleClose();
              handleOpenInput();
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleCloseTest}
        aria-labelledby="customized-dialog-title"
        open={openTest}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseTest}
        >
          Feature Input
        </BootstrapDialogTitle>
        <DialogContent dividers style={{ padding: '24px' }}>
          <div className="modal-content">
            <Typography gutterBottom>
              <TextField
                fullWidth
                label="Feature Input"
                variant="outlined"
                size="small"
                value={testObj}
                onChange={e => {
                  setTestObj(e.target.value);
                }}
                autoFocus
              />
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseTest}>
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={() => {
              handleCloseTest();
              handleTest();
            }}
          >
            Test Code
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleCloseInput}
        aria-labelledby="customized-dialog-title"
        open={openInput}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseInput}
        >
          Required Inputs
        </BootstrapDialogTitle>
        <DialogContent dividers style={{ padding: '24px' }}>
          <div className="modal-content">
            <Typography gutterBottom>
              <TextField
                fullWidth
                label="Feature Class"
                variant="outlined"
                size="small"
                value={className}
                onChange={e => {
                  setClassName(e.target.value);
                  setPascal(toPascalCase(e.target.value));
                }}
                autoFocus
              />
            </Typography>
            <div className="res">
              <div className="res-tag">Resultant Classname</div>
              <div className="res-content">{pascal}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseInput}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            variant="outlined"
          >
            Push Code
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>

      <Backdrop open={backdropOpen} sx={{ zIndex: 1000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
// Modal Component End

// Modal Widget as ReactWidget Start
export class FeatureModal extends ReactWidget {
  code: string;
  panel: NotebookPanel;
  constructor(code: string, panel: NotebookPanel) {
    super();
    this.addClass('jp-ReactWidget');
    this.code = code;
    this.panel = panel;
  }

  // Render Modal Component (Validation Modal + Feature Input Modal)
  render(): JSX.Element {
    return <ModalComponent code={this.code} panel={this.panel} />;
  }
}
// Modal Widget End
