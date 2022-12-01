import * as React from 'react';
import { makeStyles } from '@mui/styles';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import HeaderLogo from 'components/HeaderLogo';
import Account from 'components/Account';


const drawerWidth: number = 116;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  height: 107,
  boxShadow: 'inherit',
  backgroundColor: 'transparent',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'absolute',
      left: 0,
      whiteSpace: 'nowrap',
      width: drawerWidth,
      background: `linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%)`,
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
        width: 0,
        [theme.breakpoints.up('sm')]: {
          width: 0,
        },
      }),
    },
  }),
);

const useStyles = makeStyles((theme: any) => ({
    root: {
      display: 'flex',
      background: `linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)`,
    },
    main: {
        background: `linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)`,
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    }
  }));

export default ({ children }: any) => {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const hideDrawer = () => {
    setOpen(false);
  };

  return (
      <Box className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            style={{ background: 'transparent', height: '100%', paddingLeft: 0, paddingRight: 24 }}
          >
            <HeaderLogo onMouseLeave={hideDrawer} onMouseEnter={showDrawer} />
            <Container maxWidth="lg" style={{ padding: 0 }}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant='h4'>Fashion Fusion</Typography>
                        <Typography variant='subtitle2'>Collaborative design mixing all influences</Typography>
                    </Box>
                    <Account/>
                </Box>
            </Container>
          </Toolbar>
        </AppBar>
        <Box style={{ width: drawerWidth, background: 'transparent' }} ></Box>
        <Drawer onMouseLeave={hideDrawer} onMouseEnter={showDrawer} variant="permanent" open={open}>

        </Drawer>
        <Box
          component="main"
          className={classes.main}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            { children }
          </Container>
        </Box>
      </Box>
  );
}