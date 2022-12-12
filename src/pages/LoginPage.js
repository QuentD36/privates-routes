import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from "axios";
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Config from "../config.json";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://com-maker.fr/">
        Com' Maker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  spacing: 2
});

export default function SignIn() {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (event) => {
      setOpen(false)
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}));
  }
  

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();

    setTimeout(() => {
      setIsLoading(true);
      axios.post(Config.BASE_URL + '/api/login', inputs).then( (response) => {
        // console.log(response.data)
          if(response.data.success == 0){
            setError(response.data.message)
            setIsError(true)
            setOpen(true)
            setIsLoading(false);
          }else{
            localStorage.setItem('token', response.data.token)
            navigate("/dashboard");
          }
      })
    }, 1000);
    
  }

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

  return (    
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div>
  </div>
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Connexion  
          </Typography>
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2, display: display, marginTop: 7 }}
            >
              {error}
            </Alert>
          </Collapse>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse mail"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, display: show}}
            >
              Sign In
              
            </Button>
            <Box sx={{display: "flex", justifyContent: 'center'}}>
            <CircularProgress  size={20} sx={{ display: loading}}/>

            </Box>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}