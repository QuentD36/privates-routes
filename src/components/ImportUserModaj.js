import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import UploadIcon from '@mui/icons-material/Upload';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import axios from 'axios';
import Config from '../config.json';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Papa from 'papaparse';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function SimpleDialog(props) {
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  var [inputs, setInputs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [parsedData, setParsedData] = useState([]);
  
  var display = 'none'
  var loading = 'none'
  var show = "flex"

  if(isError){
    display = "flex"
  }

  if(isLoading){
    loading = "flex"
    show = "none"
  }

  const handleChange = (event) => {
    Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            setParsedData(results.data);
        },
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // console.log(parsedData)
    setIsLoading(true);
      setTimeout(() => {
        setIsLoading(true);
        axios.post(Config.BASE_URL + '/api/user/import', parsedData).then( (response) => {
            console.log(response.data)
            if(response.data.success == 0){
                setError(response.data.message)
                setIsError(true)
                setOpenError(true)
                setIsLoading(false);
              }else{
                props.setDate(Date.now())
                setIsLoading(false);
                props.setOpen(false)
                props.setSuccessMsg(response.data.message)
                props.setOpenSuccess(true)
                setParsedData([])
            }
        })
      }, 1000);
       
  }

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue)
  };

  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `import.csv`;
    link.href = "http://localhost:8888/savage-dreams/import.csv";
    link.click();
  };

  return (
    <Dialog onClose={handleClose} open={open} >
      <Box sx={{p: 6}}>
      <DialogTitle>Importer des utilisateurs (.csv)</DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Fichier source : <span className='download-link' onClick={onDownload}>Télécharger</span>
          </DialogContentText>
        </DialogContent>
      <Collapse in={openError}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ display: display}}
        >
          {error}
        </Alert>
      </Collapse>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          
            <TextField
                margin="normal"
                required
                fullWidth
                name="file"
                type="file"
                id="file"
                inputProps={{accept:".csv"}}
                onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, display: show}}
            >
              Importer
              
            </Button>
            <Box sx={{display: "flex", justifyContent: 'center'}}>
            <CircularProgress  size={20} sx={{ display: loading}}/>

            </Box>
        </Box>
      </Box>
      
    </Dialog>
  );
}

export default function ImportUserModal({roles, setDate, setSuccessMsg, setOpenSuccess}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
        <Tooltip title="Importer" placement="top">
            <Fab color="primary" aria-label="add" onClick={handleClickOpen} sx={{ml: 4}}>
                <UploadIcon />
            </Fab>
        </Tooltip>
      
      <SimpleDialog
        open={open}
        onClose={handleClose}
        roles={roles}
        setDate={setDate}
        setOpen={setOpen}
        setSuccessMsg={setSuccessMsg}
        setOpenSuccess={setOpenSuccess}
      />
    </div>
  );
}