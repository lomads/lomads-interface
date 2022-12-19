import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: '100vh',
    background: 'linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)',
	position:'fixed',
	overflow:'auto'

  },
}));

export default ({ children } : any) => {

  const classes = useStyles();

  return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        {/* <Container maxWidth="lg"> */}
          { children }
        {/* </Container> */}
      </Grid>
  );
}