import { Container, Grid, Typography, Box, Paper } from "@mui/material"
import { makeStyles } from '@mui/styles';
import CHEERS from '../../assets/svg/cheers.svg'
import LOMADS_LOGO from '../../assets/svg/lomadsfulllogo.svg'
import METAMASK from '../../assets/svg/metamask.svg'

const useStyles = makeStyles((theme: any) => ({
    root: {
         height: "100vh",
         maxHeight: 'fit-content'
    },
    logo: {
        width: 138,
        height: 81
    },
    cheers: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center'
    },
    metamaskButton: {
        cursor: 'pointer',
        alignContent: "inherit",
        background: "#fff",
        borderColor: "#c94b32",
        borderRadius: '10px !important',
        borderWidth: 0,
        filter: "drop-shadow(3px 5px 4px rgba(27,43,65,.05)) drop-shadow(-3px -3px 8px rgba(201,75,50,.1)) !important",
        margin: "10px",
        padding: 40
    },
  }));

export default () => {
    const classes = useStyles();
    return (
        <>
            <Grid container alignItems="space-around" justifyContent="center" className={classes.root}>
                <Grid item display="flex" direction="column" justifyContent="center" alignItems="center" sm={12}>
                    <img className={classes.logo} src={LOMADS_LOGO} />
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography>Hello there!</Typography>
                        <Typography>Connect your wallet</Typography>
                    </Box>
                    <Box>
                        <Box className={classes.metamaskButton}>
                                <img src={METAMASK} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}