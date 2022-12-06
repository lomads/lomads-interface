import palette from './palette';

export default {
	fontFamily: [
		'Inter',
		'sans-serif',
	].join(','),
	h1: {
		color: palette.text.primary,
		fontFamily: "Insignia",
		fontWeight: 500,
		fontSize: '2.5rem',
		letterSpacing: '-0.24px',
		lineHeight: '2.75rem',
	},
	h2: {
		color: palette.text.primary,
		fontFamily: "Insignia",
		fontWeight: 400,
		fontSize: '35px',
		lineHeight: '35px'
	},
	h3: {
		color: palette.text.primary,
		fontFamily: "Insignia",
		fontWeight: 500,
		fontSize: '1.75rem',
		letterSpacing: '-0.06px',
		lineHeight: '2rem'
	},
	h4: {
		color: palette.text.primary,
		fontFamily: "Insignia",
		fontWeight: 600,
		fontSize: '1.3rem',
		letterSpacing: '-0.06px',
		lineHeight: '1.75rem',
		margin: '.5rem 0'
	},
	h5: {
		color: palette.text.primary,
		fontFamily: "Insignia",
		fontWeight: 600,
		fontSize: '1rem',
		letterSpacing: '-0.05px',
		lineHeight: '1.5rem',
		margin: '.25rem 0'
	},
	h6: {
		color: palette.text.primary,
		fontFamily: 'Inter, sans-serif',
		fontWeight: 600,
		fontSize: '0.875rem',
		letterSpacing: '-0.05px',
		lineHeight: '1.334rem',
		margin: '.15rem 0'
	},
	subtitle1: {
		color: palette.text.primary,
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: '22px',
		lineHeight: '25px',
		letterSpacing: '-0.011em'
	},
	subtitle2: {
		color: palette.text.primary,
		fontFamily: 'Inter, sans-serif',
		fontWeight: 400,
		fontSize: '0.875rem',
		letterSpacing: '-0.05px',
		lineHeight: '1.15rem'
	},
	body1: {
		//color: palette.text.primary,
		fontFamily: 'Inter, sans-serif',
		fontSize: '0.875rem',
		fontWeight: 'normal',
		letterSpacing: '-0.04px',
		lineHeight: '1.15rem'
	},
	body2: {
		color: palette.text.secondary,
		fontFamily: 'Inter, sans-serif',
		fontSize: '0.75rem',
		fontWeight: 'normal',
		letterSpacing: '-0.04px',
		lineHeight: '1rem'
	},
	button: {
		fontFamily: 'Inter, sans-serif',
		fontSize: '14px'
	},
	caption: {
		color: palette.text.secondary,
		fontFamily: 'Inter, sans-serif',
		fontSize: '11px',
		letterSpacing: '0.33px',
		lineHeight: '13px'
	},
	overline: {
		//color: palette.text.primary,
		fontFamily: 'Inter, sans-serif',
		fontSize: '11px',
		fontWeight: 500,
		letterSpacing: '0.33px',
		lineHeight: '13px'
	}
};
