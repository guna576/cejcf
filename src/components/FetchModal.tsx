import React, { useState } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { NotebookPanel } from '@jupyterlab/notebook';
import { fetchFeature } from '../utils/FetchFeature';
import { TextField } from '@mui/material';

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface ModalProps {
  panel: NotebookPanel;
  featureList: string[];
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

function ModalComponent(props: ModalProps) {
  const [open, setOpen] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [searchList, setSearchList] = useState<string[]>([]);
  const handleClose = () => setOpen(false);

  const handleFetch = (featureName: string) => {
    handleClose();
    fetchFeature({
      featureName: featureName,
      panel: props.panel
    });
  };

  const handleSearch = (q: string) => {
    setSearchList([]);
    q = q.toLowerCase();
    props.featureList.map((featureName: string) => {
      if (featureName.includes(q)) {
        setSearchList(searchList => [...searchList, featureName]);
      }
    });
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
          Feature List
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="search-q">
            <TextField
              fullWidth
              label="Search Query"
              variant="outlined"
              size="small"
              value={searchQ}
              onChange={e => {
                setSearchQ(e.target.value ? e.target.value.toLowerCase() : '');
                handleSearch(e.target.value);
              }}
              autoFocus
            />
          </div>
          <ul className="feature-list">
            {searchQ !== '' ? (
              searchList !== [] ? (
                searchList.map((featureName: string) => {
                  return (
                    <li className="feature-item">
                      <div className="feature-name">{featureName}</div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFetch(featureName)}
                        size="small"
                      >
                        Fetch
                      </Button>
                    </li>
                  );
                })
              ) : (
                <li className="feature-item">
                  <div className="feature-name">No Results Found</div>
                </li>
              )
            ) : (
              props.featureList &&
              props.featureList.map((featureName: string) => {
                return (
                  <li className="feature-item">
                    <div className="feature-name">{featureName}</div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleFetch(featureName)}
                      size="small"
                    >
                      Fetch
                    </Button>
                  </li>
                );
              })
            )}
          </ul>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

// Modal Widget as ReactWidget Start
export class FetchModal extends ReactWidget {
  featureList: string[];
  panel: NotebookPanel;
  constructor(featureList: string[], panel: NotebookPanel) {
    super();
    this.addClass('jp-ReactWidget');
    this.featureList = featureList;
    this.panel = panel;
  }
  // Render Modal Component (Validation Modal + Feature Input Modal)
  render(): JSX.Element {
    return <ModalComponent featureList={this.featureList} panel={this.panel} />;
  }
}
// Modal Widget End
