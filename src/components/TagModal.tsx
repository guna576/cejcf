import React, { useState } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { NotebookPanel } from '@jupyterlab/notebook';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, TextField } from '@mui/material';
import { Cell, ICellModel } from '@jupyterlab/cells';
import Swal from 'sweetalert2';

interface ModalProps {
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

function ModalComponent({ panel }: ModalProps) {
  const [tag, setTag] = useState('');
  const [excludeTag, setExcludeTag] = useState('');
  const [startCell, setStartCell] = useState<number>(1);
  const [endCell, setEndCell] = useState<number>(1);
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  const handleTagCell = () => {
    const numCells = panel.content.widgets.length;

    const excludeList: number[] = [];
    (excludeTag.split(',') as string[]).map(t => {
      excludeList.push(parseInt(t));
    });

    if (startCell < 1 || endCell > numCells || startCell > endCell) {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid Range inputs',
        icon: 'error'
      });
    } else {
      for (let i = startCell - 1; i < endCell; i++) {
        if (excludeList.includes(i + 1)) {
          continue;
        }
        const cell: Cell = panel.content.widgets[i];
        const model: ICellModel = cell.model;
        if (model.type === 'code') {
          let tagList = model.metadata.get('tags') as string[];
          if (tagList === undefined) {
            tagList = [];
          }
          const newList: string[] = [];
          for (let j = 0; j < tagList.length; j++) {
            newList.push(tagList[j]);
          }
          newList.push(tag);
          model.metadata.set('tags', newList);
        }
      }
      handleClose();
      Swal.fire({
        title: 'Success!',
        text: `Cells tagged as ${tag}`,
        icon: 'success'
      });
    }
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
          Tag Cells
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="search-q">
            <TextField
              fullWidth
              label="Tag Name"
              variant="outlined"
              size="small"
              value={tag}
              onChange={e => {
                setTag(e.target.value);
              }}
              autoFocus
              required
            />
          </div>
          <div className="tag-range">
            <TextField
              label="Start Cell"
              variant="outlined"
              size="small"
              value={startCell}
              type="number"
              onChange={e => {
                setStartCell(parseInt(e.target.value));
              }}
              required
            />
            <TextField
              label="End Cell"
              variant="outlined"
              size="small"
              type="number"
              value={endCell}
              onChange={e => {
                setEndCell(parseInt(e.target.value));
              }}
              required
            />
          </div>
          <div className="tag-exclude">
            <TextField
              fullWidth
              label="Exclude Cells"
              variant="outlined"
              size="small"
              value={excludeTag}
              onChange={e => {
                setExcludeTag(e.target.value);
              }}
            />
          </div>
          <p className="tag-note">&nbsp;Note: List the cells comma seperated</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleTagCell} autoFocus>
            Tag Cells
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
// TagModal Widget as ReactWidget Start
export class TagModal extends ReactWidget {
  panel: NotebookPanel;

  constructor(panel: NotebookPanel) {
    super();
    this.addClass('jp-ReactWidget');
    this.panel = panel;
  }
  // Render Modal Component (Validation Modal + Feature Input Modal)
  render(): JSX.Element {
    return <ModalComponent panel={this.panel} />;
  }
}
// TagModal Widget End
