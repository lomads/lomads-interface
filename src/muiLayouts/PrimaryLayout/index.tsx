import CssBaseline from '@mui/material/CssBaseline';
import {Grid, Box} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/system';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Header from "components/Header";
import React from 'react';

const useStyles = makeStyles((theme: any) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%);'
  },
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