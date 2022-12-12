import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import Config from '../config.json';


function SimpleDialog(props) {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  var [inputs, setInputs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');

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

  const handleRole = (e) => {
    setRole(e.target.value)
    
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    
      setTimeout(() => {
        // setIsLoading(true);
        axios.post(Config.BASE_URL + '/api/user/save', inputs).then( (response) => {
          console.log(response.data)
        //     // if(response.data.success == 0){
        //     //   setError(response.data.message)
        //     //   setIsError(true)
        //     //   setIsLoading(false);
        //     // }else{
        //     //   localStorage.setItem('token', response.data.token)
        //     // }
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
            <Box sx={{ minWidth: 120, mt: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="role-select-label">Rôle</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  label="Rôle"
                  name="role"
                  onChange={handleRole}
                  value={role}
                >
                  {props.roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>{role.intitule}</MenuItem>

                  ))}
                </Select>
              </FormControl>
            </Box>
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

export default function UserModal(props) {
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
        roles={props.roles}
      />
    </div>
  );
}