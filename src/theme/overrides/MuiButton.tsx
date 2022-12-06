import palette from "theme/palette";

export default {
    props:{
        disableRipple: true
    },
	styleOverrides: {
		root: {
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            height: 50,
            minWidth: 150,
            fontSize: '20px',
            textAlign: 'center' as any,
            letterSpacing: '-0.011em',
            textTransform: 'uppercase' as any,
			padding: '0.2rem 2.5rem',
			boxShadow: 'none',
			borderRadius: 5,
			'&:hover': {
				boxShadow: `3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)`,
                background: palette.primary.light
			},
			'&:active': {
				boxShadow: 'none',
                background: palette.primary.dark
			},
			'&:focus': {
				boxShadow: 'none',
			},
            '&:disabled': {
                background: 'rgba(27, 43, 65, 0.2)',
				boxShadow: 'none',
                color: '#FFF'
			},
		},
        containedSecondary: {
            boxShadow: `3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)`,
            '&:hover': {
				boxShadow: `3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)`,
                background: palette.secondary.main
			},
            '&:active': {
				boxShadow: 'none',
                background: palette.secondary.main
			},
			'&:focus': {
				boxShadow: 'none',
			},
            '&:disabled': {
                background: 'rgba(27, 43, 65, 0.2)',
				boxShadow: 'none',
                color: '#FFF'
			},
        },
        sizeSmall: {
            height: 40,
            fontSize: '16px',
        },
        outlined: {
            '&:hover': {
				boxShadow: `3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)`,
                background: 'inherit'
			},
			'&:active': {
				boxShadow: 'none',
                background: 'inherit'
			},
            '&:disabled': {
                background: 'inherit',
				boxShadow: 'none',
                color: 'rgba(27, 43, 65, 0.2)'
			},
        }
	}
};
