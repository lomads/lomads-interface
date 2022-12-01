import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import palette from 'theme/palette';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: 223, 
    height: 60,
    background: `#FFFFFF`,
    boxShadow: `3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)`,
    borderRadius: 30
  }
}));

export default ({ children, ...props } : any) => {

  const classes = useStyles();

  return (
      <Box { ...props }  className={classes.root}>

      </Box>
  );
}