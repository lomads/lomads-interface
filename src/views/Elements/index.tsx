import { Typography, Box, TextField, FormControl, FormLabel } from '@mui/material';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

export default () => {
    return (
        <div>
            <Box mt={4}>
                <Typography variant='h4'>Buttons</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Button variant='contained'>SEND</Button>
                    <Button disabled variant='contained'>SEND</Button> 
                    <Button size='small' variant='contained'>SEND</Button>
                    <Button variant='outlined'>SEND</Button>
                    <Button disabled variant='outlined'>SEND</Button> 
                    <Button size='small' variant='outlined'>SEND</Button>
                    <Button variant='contained' color='secondary'>SEND</Button>
                </Box>
                <Box display="flex" alignItems="center" mt={4} justifyContent="space-between">
                    <Button loading variant='contained'>SEND</Button>
                    <Button loading disabled variant='contained'>SEND</Button> 
                    <Button loading size='small' variant='contained'>SEND</Button>
                    <Button loading variant='outlined'>SEND</Button>
                    <Button loading disabled variant='outlined'>SEND</Button> 
                    <Button loading size='small' variant='outlined'>SEND</Button>
                    <Button loading variant='contained' color='secondary'>SEND</Button>
                </Box>
            </Box>
            <Box mt={4}>
                <Typography variant='h4'>Inputs</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <TextInput label="Enter your number" />
                </Box>
            </Box>
        </div>
    )
}