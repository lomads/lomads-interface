
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AddMember from "./AddMember";
import CreateProject from "./CreateProject";
import Settings from "./Settings";

const useStyles = makeStyles((theme: any) => ({
}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();
	
	return (
		<>
			<Grid container>
				<Grid xs={12} item display="flex" flexDirection="column" rowGap={"30px"}>
					<Settings />
					<CreateProject />
					<AddMember />
				</Grid>
			</Grid >
		</>
	)
}