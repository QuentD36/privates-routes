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
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { generate } from '@wcj/generate-password';
import Tooltip from '@mui/material/Tooltip';


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function SimpleDialog(props) {
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  var [inputs, setInputs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState('')
  const [openError, setOpenError] = useState(false)
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  

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
    setOpenError(false)
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({...values, [name]: value}))
  }

  const handleRole = (e) => {
    setRole(e.target.value)
    setOpenError(false)
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  const handlePwd = (e) => {
    setPassword(e.target.value)
    setOpenError(false)
    setInputs(values => ({...values, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(inputs)
    setIsLoading(true);
      setTimeout(() => {
        // setIsLoading(true);
        axios.post(Config.BASE_URL + '/api/user/save', inputs).then( (response) => {
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
              setRole('')
              setPassword('')
              props.setSuccessMsg(response.data.message)
              props.setOpenSuccess(true)
              setInputs([])
            }
        })
      }, 1000);
       
  }

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue)
    setPassword('')
  };

  const generatePwd = () => {
      var randPassword = generate({length: 12})
      setPassword(randPassword)
      setInputs(values => ({...values, ["password"]: randPassword}))
    
  }


  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{p: 6}}>
      <DialogTitle>Créer un utilisateur</DialogTitle>
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
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              id='password'
              label='Password'
              variant="outlined"
              type={showPassword ? "text" : "password"} // <-- This is where the magic happens
              value={password}
              onChange={handlePwd}
              onClick={generatePwd}
              InputProps={{ // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ minWidth: 120, mt: 2 }}>
              <FormControl fullWidth >
                <InputLabel id="role-select-label">Rôle</InputLabel>
                <Select
                  labelId="role-select-label"
                  required
                  id="role"
                  label="Rôle t"
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

export default function AddUserModal({roles, setDate, setSuccessMsg, setOpenSuccess}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      
      <Tooltip title="Ajouter" placement="top">
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
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