import { get as _get } from 'lodash'
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/system';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Header from "components/Header";
import { useAppSelector } from 'state/hooks';
import palette from 'muiTheme/palette';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%);'
  },
  logoContainer: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg,#fbf4f2,#eef1f5)',
    borderRadius: '10px',
    boxShadow: 'inset 1px 0 4px rgb(27 43 65 / 10%)',
    height: '70.71px',
    left: '83px',
    position: 'absolute',
    top: '69px',
    transform: 'rotate(45deg)',
    width: '70.71px',
    overflow: 'hidden'
  },
  text: {
    color: palette.primary.main,
    fontSize: '35px !important',
    fontWeight: 600,
    transform: 'rotate(-45deg)'
  },
  image: {
    transform: 'rotate(-45deg)',
    width: '141%',
    maxWidth: '141% !important',
    height: '141%;',
    flexShrink: 0
  }
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MuiAppBarProps>(({ theme }) => ({
  height: 107,
  boxShadow: 'inherit',
  backgroundColor: 'transparent',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default ({ children } : { children: React.ReactNode }) => {

  const classes = useStyles();
  const navigate = useNavigate()
  const { DAO } = useAppSelector(store => store.dashboard);
  
  return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed">
          <Header/>
          <Toolbar
            style={{ background: 'transparent', height: '100%', paddingLeft: 0 }}
          >
            <Grid container>
                <Grid item xs={12} display="flex" flexDirection="row" alignItems="center">
                  <Box onClick={() => navigate(`/${_get(DAO, 'url')}`)} className={classes.logoContainer}>
                    { DAO?.image ? <img className={classes.image} src={_get(DAO, 'image')} /> :
                      <Typography className={classes.text}>{ _get(DAO, 'name[0]', '') }</Typography>
                    }
                  </Box>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    {/* <Account/> */}
                </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          { children }
        </Container>
      </Grid>
  );
}