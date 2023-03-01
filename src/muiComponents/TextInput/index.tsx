import { Typography, Box, TextField, FormControl, FormLabel, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default ({ labelChip, fullWidth, label, ...props }: any) => {
    return (
        <FormControl fullWidth={fullWidth}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <FormLabel error={props.error} component="legend">{ label }</FormLabel>
                { labelChip }
            </Box>
            <TextField { ...props }/>
        </FormControl>
    )
}