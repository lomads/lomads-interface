import { green, blue, orange, red, grey } from "@mui/material/colors";

const white = '#FFFFFF';
const black = '#000000';

export default {
	type: 'light',
	black,
	white,
	primary: {
		contrastText: white,
		dark: '#B12F15',
		main: '#C94B32',
		light: '#EA6447'
	},
	secondary: {
		contrastText: '#76808D',
		dark: '#5f1775',
		main: '#FFFFFF',
		light: '#a42ac9',
	},
	success: {
		contrastText: white,
		dark: '#005e50',
		main: "#188C7C",
		light: '#56bdab'
	},
	info: {
		contrastText: white,
		dark: blue[900],
		main: blue[600],
		light: blue[400]
	},
	warning: {
		contrastText: white,
		dark: orange[900],
		main: orange[600],
		light: orange[400]
	},
	error: {
		contrastText: white,
		dark: red[900],
		main: red[600],
		light: red[400]
	},
	text: {
		primary: '#76808D',
		secondary: '#6f7894',
		light1: '#fafbff',
		light2: '#f3f5f9 ',
		light3: '#abadbc',
		light4: '#979797',
		light5: '#888a98',
		link: blue[600]
	},
	background: {
		default: '#F8F8FA',
		default2: '#303030',
		default3: '#202020',
		default4: '#111010',
		paper: '#fff'
	},
	icon: grey[900],
	divider: grey[200]
};
