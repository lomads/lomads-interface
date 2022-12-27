import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	height: 107,
	boxShadow: 'inherit',
	backgroundColor: 'transparent',
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
}));

const useStyles = makeStyles((theme: any) => ({
	root: {
		height: '100vh',
		background: '#C94B32',
		position: 'fixed',
		display: 'flex',
		flexDirection: 'column'
	},
	main: {
		flexGrow: 1,
		height: '100vh',
		display: 'flex',
		flexDirection: 'column'
	},
	logoStyle: {
		width: '70px',
		height: '70px',
		display: 'flex',
		transform: 'rotate(45deg)',
		border: '2px solid #fff',
		alignItems: 'center',
		borderRadius: '10px',
		justifyContent: 'center',
		background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		marginLeft: '2rem',
		marginTop: '2rem'
	},

	closeIconBox: {
		background: 'rgba(27, 43, 65, 0.2)',
		display: 'flex',
		justifyContent: 'center',
		width: '2.3rem',
		height: '2.3rem',
		alignItems: 'center',
		cursor: 'pointer'
	}
}));

export default ({ children }: any) => {

	const classes = useStyles();
	const navigate = useNavigate();

	const closeSettings = () => {
		navigate('/dashboard');
	}

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<AppBar position="absolute">
				<Toolbar
					style={{ background: 'transparent', height: '100%', paddingLeft: 0, paddingRight: 24, paddingTop:24 }}
				>
					<Box className={classes.logoStyle}>
						<Typography style={{ transform: 'rotate(-45deg)', color: '#C94B32', fontWeight: 600, fontSize: '2.1rem' }}>HG</Typography>
					</Box>
					<Container maxWidth="lg" style={{ padding: 0 }}>
						<Box sx={{ flexGrow: 1, justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
							<Typography style={{ color: '#fff', fontWeight:700, fontSize:'2rem' }}>Fashion Fusion</Typography>
							<Box className={classes.closeIconBox} onClick={closeSettings}>
								<CloseIcon />
							</Box>
						</Box>
						<Box>
							<Typography style={{ color: '#fff', fontWeight: 400, fontSize: '1.8rem', marginTop:'1.5rem' }}>Settings</Typography>
						</Box>
					</Container>
				</Toolbar>
			</AppBar>
			<Box
				component="main"
				className={classes.main}
			>
				<Toolbar />
				{/* <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> */}
					{children}
				{/* </Container> */}
			</Box>
		</Grid>
	);
}