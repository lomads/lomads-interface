import { FormControl } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import { ExpandMoreOutlined } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme: any) => ({
}));

export default ({ required, label, ...props }: any) => {
	const classes = useStyles();
	return (


		<FormControl sx={{ m: 1, minWidth: 160 }} >
			<Select
				{...props}
				IconComponent={(props) => (<ExpandMoreOutlined {...props} />)}
			>
				{props.options.map((item:any) => {
					return <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
				})}

			</Select>
		</FormControl>
	)
}