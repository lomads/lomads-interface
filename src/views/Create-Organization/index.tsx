
import { throttle as _throttle, debounce as _debounce, get as _get } from 'lodash'
import { Container, Grid, Typography, Box, Paper,} from "@mui/material"
import { makeStyles } from '@mui/styles';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

const useStyles = makeStyles((theme: any) => ({
	root: {
		height: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	headingText: {
		color: '#C94B32 !important'
	},
	formBox: {
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px',
		padding: '26px 22px 30px',
		lineHeight: '35px',
		marginBottom: '3rem'
	},
	buttonStyle: {
		borderRadius: '5px',
	},
	addressInputField: {
		cursor: 'no-drop'
	}

}));

export default () => {
	const classes = useStyles();

	return (
		<>
			<Grid container className={classes.root}>
				<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
					<Box style={{ marginBottom: '40px' }}>
						<Typography variant="h1" className={classes.headingText}>1/3 Name of your Organisation</Typography>
					</Box>
					<Box className={classes.formBox}>
						<TextInput
							style={{ marginBottom: '1.5rem' }}
							fullWidth
							label={"Name Your Organisation"}
							placeholder={"Epic Organisation"}
						>
						</TextInput>
						<TextInput
							fullWidth
							label={"Organisation Address"}
							disabled
						>
						</TextInput>
					</Box>
					<Button variant='contained' color='primary' className={classes.buttonStyle}>
						Create Public Address
					</Button>
				</Grid>
			</Grid>
		</>
	)
}