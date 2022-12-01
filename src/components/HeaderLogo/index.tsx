import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import palette from 'theme/palette';

const useStyles = makeStyles((theme: any) => ({
  root: {
    cursor: 'pointer',
    background: `linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%)`,
    minHeight: 107, 
    minWidth: 116,
    px: [1],
    borderBottomRightRadius: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    width: 35,
    height: 35,
    background: `linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)`,
    boxShadow: `inset 1px 0px 4px rgba(27, 43, 65, 0.1)`,
    borderRadius: 10,
    transform: `rotate(45deg)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: '600 !important',
    fontSize: '16px !important',
    lineHeight: 25,
    textAlign: 'center',
    letterSpacing: '-0.011em !important',
    color: `${palette.primary.main} !important`,
    transform: `rotate(-45deg)`,
  }
}));

export default ({ children, ...props } : any) => {

  const classes = useStyles();

  return (
      <Box { ...props }  className={classes.root}>
        <Box className={classes.logoContainer}>
            <Typography variant='h6' className={classes.title}>HG</Typography>
        </Box>
      </Box>
  );
}