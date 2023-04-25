import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import _ from 'lodash';
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import TextInput from '../../muiComponents/TextInput'
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { updateDaoAddress, updateDaoImage, updateDaoName } from "state/flow/reducer";
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from '../../api'
import ReactS3Uploader from 'components/ReactS3Uploader';
import { nanoid } from "@reduxjs/toolkit";
import { useDropzone } from 'react-dropzone'
import uploadIconOrange from '../../assets/svg/ico-upload-orange.svg';
import { Container, Grid, Button, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	root: {
		minHeight: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	maxText: {
		color: '#1B2D41',
		opacity: 0.2,
		letterSpacing: '-0.011em',
		fontFamily: 'Inter, sans-serif',
		fontWeight: 400,
		fontSize: 14,
	},
	chooseText: {
		color: "#C94B32",
		alignSelf: 'center',
		letterSpacing: '-0.011em',
		fontFamily: 'Inter, sans-serif',
		fontWeight: 400,
		fontSize: 16
	},
	text: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 14,
		letterSpacing: '-0.011em',
		color: '#76808d',
		marginLeft: 13,
	},
	headerText: {
		fontFamily: 'Insignia',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 35,
		paddingBottom: 35,
		textAlign: 'center',
		color: '#C94B32'
	},
	inputFieldTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 700,
		fontSize: 16,
		letterSpacing: '-0.011em',
		color: '#76808D',
		margin: '15px 0px 15px 0px'
	},
	createName: {
		margin: '25px 0px 15px 0px'
	},
	lomadsLogoParent: {
		backgroundColor: '#FFF',
		height: '100vh',
		zIndex: 99999,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	centerCard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyItems: 'center',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: 5,
		width: 394,
		padding: 22,
		minHeight: 'fit-content'
	},
	imagePickerWrapperText: {
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 16,
		color: 'rgba(118, 128, 141, 0.5)',
		marginLeft: 13
	},
	imagePickerWrapper: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
	},
	imagePickerContainer: {
		width: 150,
		height: 150,
		borderRadius: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#F5F5F5',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		margin: '1rem 0',
		cursor: 'pointer',
		position: 'relative',
	},
	informationPerm: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'italic',
		weight: 400,
		fontSize: 14,
		textAlign: 'center',
		color: '#76808D'
	},
	selectedImg: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
		objectFit: 'cover'
	},
	uploadIcon: {
		margin: 10
	}
}));

export default () => {
	const classes = useStyles()
	const dispatch = useAppDispatch();
	const location = useLocation();
	const [DAOListLoading, setDAOListLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<any>({});
	const [urlCheckLoading, setUrlCheckLoading] = useState<any>(false);
	const refSafeName = useRef<string>("");
	const daoName = useAppSelector((state) => state.flow.daoName);
	const daoAddress = useAppSelector((state) => state.flow.daoAddress);
	const { DAOList } = useAppSelector((state) => state.dashboard);

	const [image, setImage] = useState<any>(null);
	const [droppedfiles, setDroppedfiles] = useState([]);
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);

	useEffect(() => {
		dispatch(updateDaoName(""))
		dispatch(updateDaoAddress(""))
	}, [])

	const navigate = useNavigate();
	const handleClick = () => {
		let terrors: any = {};
		if (!daoName) {
			terrors.daoName = " * Organisation name is required.";
		}
		if (!daoAddress) {
			terrors.daoAddress = " * Organisation Address is required.";
		}
		if (_.isEmpty(terrors)) {
			handleNavigate();
		} else {
			setErrors(terrors);
		}
	};

	// useEffect(() => {
	//   if(location.pathname.indexOf('namedao') > -1) {
	//     if(DAOList.length == 0) {
	//       setDAOListLoading(true)
	//       axiosHttp.get("dao").then(res => { 
	//         setDAOList(res.data) 
	//         if(res.data.length > 0)
	//           navigate(`/${_.get(res.data, '[0].url')}`)
	//       })
	//       .finally(() => setDAOListLoading(false))
	//     }
	//   }
	// }, [DAOList])

	const checkAvailability = (e: any) => {
		if (e.target.value && e.target.value !== "") {
			setUrlCheckLoading(true)
			axiosHttp.get(`dao/${e.target.value.replace(/ /g, "-").toLowerCase()}`)
				.then(res => {
					if (!res.data) {
						dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase()))
					} else {
						let rand = Math.floor(1000 + Math.random() * 9000);
						axiosHttp.get(`dao/${e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand}`)
							.then(result => {
								rand = Math.floor(1000 + Math.random() * 9000);
								dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand))
							})
							.catch(err => {
								dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand))
							})
					}
				})
				.catch(err => {
					dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase()))
				})
				.finally(() => setUrlCheckLoading(false))
		} else {
			dispatch(updateDaoAddress(""))
		}
	}

	const checkAvailabilityAsync = useRef(_.debounce(checkAvailability, 500)).current

	const handleNavigate = () => {
		daoName.length >= 1 && navigate("/newsafe");
	};

	const handleDaoName = (event: any) => {
		refSafeName.current = event.target.value.replace(/[^a-z0-9 ]/gi, "");
		dispatch(updateDaoName(refSafeName.current.toString()));
	};

	const onDrop = useCallback((acceptedFiles: any) => { setDroppedfiles(acceptedFiles) }, [])

	const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })

	const getSignedUploadUrl = (file: any, callback: any) => {
		console.log(file)
		const filename = `DAOThumbnail/${nanoid(32)}.${file.type.split('/')[1]}`
		return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
	}

	const onUploadProgress = (progress: any, message: any, file: any) => { }

	const onUploadError = (error: any) => { setDroppedfiles([]); setUploadLoading(false) }

	const onUploadStart = (file: any, next: any) => { setUploadLoading(true); return next(file); }

	const onFinish = (finish: any) => {
		setDroppedfiles([])
		setUploadLoading(false);
		var arr = finish.signedUrl.split('?');
		console.log("image : ", arr[0]);
		dispatch(updateDaoImage(arr[0]));
		setImage(arr[0]);
	}

	return (
		<Container>
			<Grid className={classes.root}>
				{DAOListLoading ?
					<Box className={classes.lomadsLogoParent}>
						<img src={lomadsfulllogo} alt="" />
						<LeapFrog size={50} color="#C94B32" />
					</Box> : null
				}
				<Grid item sm={12}
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center">
					<Box className={classes.headerText}>
						1/2 Name of your Organisation
					</Box>
					<Box className={classes.centerCard}>
						<Box>
							<Box>
								<Box className={classes.inputFieldTitle}>Name Your Organisation</Box>
								<TextInput
									sx={{
										width: 350,
										height: 50
									}}
									placeholder="Epic Organisation"
									fullWidth
									value={daoName}
									onChange={(event: any) => {
										checkAvailabilityAsync(event)
										handleDaoName(event);
									}}
									error={errors.daoName}
									helperText={errors.daoName}
								/>
							</Box>
							<Box>
								<Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
									<Box className={classes.inputFieldTitle} style={{ marginRight: '16px' }}>Organisation address</Box>
									{urlCheckLoading && <LeapFrog size={20} color="#C94B32" />}
								</Box>
								<TextInput
									sx={{
										width: 350,
										height: 50
									}}
									fullWidth
									disabled
									value={daoAddress}
									placeholder="https://app.lomads.xyz/Name_of_the_Organisation"
									onChange={(e: any) => {
										dispatch(updateDaoAddress(e.target.value));
									}}
									error={errors.daoAddress}
									helperText={errors.daoAddress}
								/>
							</Box>
							<Box>
								<Box className={classes.inputFieldTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Import Thumbnail  <Box className='option-Box'>
									Optional
								</Box>
								</Box>
								<Box className={classes.imagePickerWrapper}>
									<Box className={classes.imagePickerContainer}>
										{
											image
												?
												<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
													<Box onClick={() => { setImage(null); dispatch(updateDaoImage(null)); }} style={{ cursor: 'pointer' }}>
														<img style={{ width: 18, height: 18, position: 'absolute', right: 8, top: 8, opacity: 0.7 }} src={require('../../assets/images/close.png')} />
													</Box>
													<img src={image} alt="selected-token-icon" className={classes.selectedImg} />
												</Box>
												:
												<Box {...getRootProps()}>
													<ReactS3Uploader
														droppedfiles={droppedfiles}
														getSignedUrl={getSignedUploadUrl}
														accept="image/png,image/jpeg,image/jpg"
														className={{ display: 'none', width: 150, height: 150 }}
														onProgress={onUploadProgress}
														onError={onUploadError}
														preprocess={onUploadStart}
														onFinish={onFinish}
														multiple
														uploadRequestHeaders={{
														}}
														contentDisposition="auto"
													/>
													<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
														{uploadLoading ?
															<LeapFrog size={24} color="#C94B32" /> :
															<>
																<img src={uploadIconOrange} alt="upload-icon" className={classes.uploadIcon} />
																<Typography sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
																	<span className={classes.chooseText}>Choose or </span>
																	<span className={classes.chooseText}> drag an image</span>
																	<span className={classes.maxText}>maximum size 2mb</span>
																</Typography>
															</>
														}
													</Box>

													<input {...getInputProps()} />
												</Box>

										}
									</Box>
									<p className={classes.text}>Accepted formats:<br />jpg, svg or png</p>
								</Box>
							</Box>
						</Box>
					</Box>
					<Box className={classes.createName}>
						<Button
							variant='contained'
							size="medium"
							onClick={handleClick}
						>
							CREATE PUBLIC ADDRESS
						</Button>
						<Typography sx={{ mt: 2 }} className={classes.informationPerm}>
							This infomation is permanent
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};