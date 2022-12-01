import { Typography, Box, TextField, FormControl, FormLabel, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    chip: {
        backgroundColor: 'rgba(201,75,50, 0.1) !important',
        '& .MuiChip-label': {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '14px',
            color: '#B12F15'
        }
    },
  }));

export default ({ required, fullWidth, label, ...props }: any) => {
    const classes = useStyles();
    return (
        <FormControl fullWidth={fullWidth}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <FormLabel component="legend">{ label }</FormLabel>
                <Chip className={classes.chip} label="Required" size="small" />
            </Box>
            <TextField
                placeholder="Enter password"
                variant="outlined"
            />
        </FormControl>
    )
}