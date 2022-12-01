import clsx from 'clsx'
import { LeapFrog } from "@uiball/loaders";
import { Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import palette from 'theme/palette';

const useStyles = makeStyles((theme: any) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
  }));

export default ({ loading, children, className, ...props }: any) => {
    const classes = useStyles();
    const size = props.size === 'small' ? 24 : 30;
    let color = palette.secondary.main
    if(props.variant === 'outlined' || props.color === 'secondary')
        color = palette.primary.main
    return (
        <Button className={clsx(classes.root, className)} {...props}> { loading ? <LeapFrog size={size} color={color} /> : children }</Button>
    )
}

