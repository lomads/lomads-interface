import { Typography, Box, TextField, FormControl, FormLabel, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    chip: {
        backgroundColor: 'rgba(201,75,50, 0.1) !important',
        width: 110,
        height: 25,
        padding: "4px 20px",
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
			<Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: '10px' }}>
                <FormLabel error={props.error} component="legend">{ label }</FormLabel>
                { required && <Chip className={classes.chip} label="Required" size="small" /> }
            </Box>
            <TextField { ...props }
				inputProps={{
					style: { cursor: props.disabled === true ? 'no-drop' : '' },
				}}
			/>
        </FormControl>
    )
}