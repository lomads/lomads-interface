import palette from "theme/palette";

export default {
	styleOverrides: {
		root: {
			"&.Mui-focused fieldset": {
				borderColor: palette.primary.main
			},
			"'&:hover $notchedOutline'": {
				borderColor: palette.primary.main
			},
		},
		input: {
			background: '#F5F5F5',
			borderColor: 'transparent',
			borderRadius: 10,
			"&::placeholder": {
				fontFamily: 'Inter, sans-serif',
				fontStyle: 'italic',
				fontWeight: 400,
				fontSize: '16px',
				lineHeight: '18px',
				color: 'rgba(27, 45, 65, 0.2)'
			}
		},
		notchedOutline: {
			borderRadius: 10,
			boxShadow: `inset 1px 0px 4px rgba(27, 43, 65, 0.1)`,
			borderColor: 'transparent',
		},
		multiline: {
			background: '#F5F5F5'
		}
	}
};
