import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from '../components/listItems';
import {useEffect, useState} from 'react';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../components/Title';
import AddUserModal from '../components/AddUserModal';
import Config from '../config.json';
import Checkbox from '@mui/material/Checkbox';
import ImportUserModal from '../components/ImportUserModaj';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

const drawerWidth = 240;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [successMsg, setSuccessMsg] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false)

  const [users, setUsers] = useState([])
  const [date, setDate] = useState(Date.now())
  const [roles, setRoles] = useState([])
  
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSuccess}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

    useEffect(() => {
        const fetchUsers = async () => {
            const usersFromApi = await axios.get(Config.BASE_URL + '/api/users');
            // console.log(usersFromApi.data)
            setUsers(usersFromApi.data)

        };

        const loadRole = async () => {
          const rolesFromApi = await axios.get(Config.BASE_URL + '/api/roles')
      
          setRoles(rolesFromApi.data)
        }

        
        
        fetchUsers()
        loadRole()
      }, [date]);

      // console.log(roles)
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Title>Utilisateurs</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Selectionner</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Rôle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  edge="start"
                  // checked={checked.indexOf(value) !== -1}
                  // tabIndex={-1}
                  disableRipple
                  // inputProps={{ 'aria-labelledby': labelId }}
                />
                </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.mail}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
                </Paper>
              </Grid>
            </Grid>
            
          </Container>
          <Snackbar
            open={openSuccess}
            autoHideDuration={4000}
            onClose={handleCloseSuccess}
            action={action}
          >
            <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
              {successMsg}
            </Alert>
          </Snackbar>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex' }}>
          <AddUserModal roles={roles} setDate={setDate} setSuccessMsg={setSuccessMsg} setOpenSuccess={setOpenSuccess}/>
          <ImportUserModal roles={roles} setDate={setDate} setSuccessMsg={setSuccessMsg} setOpenSuccess={setOpenSuccess}/>
          </Container>
          
        </Box>
        
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}