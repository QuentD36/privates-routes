import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors'
import { useState } from 'react';
import axios from 'axios';

import Fab from '@mui/material/Fab';

const emails = ['username@gmail.com', 'user02@gmail.com'];


function SimpleDialog(props) {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
}

    const handleSubmit = (event) => {
      event.preventDefault();
      setIsLoading(true);
    
        setTimeout(() => {
          setIsLoading(true);
          axios.post('http://localhost:8888/savage-dreams/api/user/save', inputs).then( (response) => {
            console.log(response.data)
              if(response.data.success == 0){
                setError(response.data.message)
                setIsError(true)
                setIsLoading(false);
              }else{
                localStorage.setItem('token', response.data.token)
              }
          })
        }, 1000);
        
    }
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };


  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{p: 6}}>
      <DialogTitle>Créer un utilisateur</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nom"
              name="name"
              autoComplete="name"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstname"
              label="Prénom"
              type="firstname"
              id="firstname"
              autoComplete="firstname"
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="E-mail"
              type="email"
              id="email"
              autoComplete="email"
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, display: show}}
            >
              Créer le compte
              
            </Button>
            <Box sx={{display: "flex", justifyContent: 'center'}}>
            <CircularProgress  size={20} sx={{ display: loading}}/>

            </Box>
        </Box>
      </Box>
      
    </Dialog>
  );
}

export default function Modal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
        </Fab>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}