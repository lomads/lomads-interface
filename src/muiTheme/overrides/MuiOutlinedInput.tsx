import palette from "muiTheme/palette";

export default {
	styleOverrides: {
		root: {
			background: '#f0f0f0',
			borderRadius: 10,
			"&.Mui-focused fieldset": {
				borderColor: palette.primary.main
			},
			"&.Mui-disabled fieldset": {
				borderColor: 'transparent !important',
			},
			"'&:hover $notchedOutline'": {
				borderColor: palette.primary.main
			}
		},
		multiline: {

        },
		input: {
			background: '#f0f0f0',
			borderColor: 'transparent',
			borderRadius: 10,
			"&::placeholder": {
				fontFamily: 'Inter, sans-serif',
				fontStyle: 'normal',
				fontWeight: 400,
				fontSize: '16px',
				lineHeight: '18px',
				color: '#76808D'
			}
		},
		notchedOutline: {
			borderRadius: 10,
            boxShadow: `inset 1px 0px 4px rgba(27, 43, 65, 0.1)`,
			borderColor: 'transparent',
		}
	}
};
