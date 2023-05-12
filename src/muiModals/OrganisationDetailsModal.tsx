import React, { useState, useCallback, useEffect, useRef } from 'react'
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import {
	Drawer, Box, Typography, Button
} from '@mui/material';
import IconButton from 'muiComponents/IconButton';
import OD from "../assets/images/drawer-icons/OD.svg";
import { makeStyles } from '@mui/styles';
import CloseSVG from '../assets/svg/close-new.svg'
import { useAppSelector, useAppDispatch } from "state/hooks";
import { get as _get, find as _find } from 'lodash';
import { Image } from "@chakra-ui/react";
import axiosHttp from 'api'
import { updateDao, updateDaoLinks, storeGithubIssues, deleteDaoLink } from 'state/dashboard/actions';
import AddDiscordLink from 'components/AddDiscordLink';
import { resetStoreGithubIssuesLoader, resetDeleteDaoLinkLoader, resetUpdateDAOLoader, resetUpdateDaoLinksLoader } from "state/dashboard/reducer";
import AddGithubLink from "components/AddGithubLink";
import TextInput from "muiComponents/TextInput";
import ReactS3Uploader from 'components/ReactS3Uploader';
import { LeapFrog } from "@uiball/loaders";
import { nanoid } from "@reduxjs/toolkit";
import { useDropzone } from 'react-dropzone'
import { isValidUrl } from "utils";
import uploadIconOrange from '../assets/svg/ico-upload-orange.svg';
import Switch from "muiComponents/Switch";
import useGithubAuth from "hooks/useGithubAuth";

const useStyles = makeStyles((theme: any) => ({
	textTypeOd: {
		fontFamily: 'Inter, sans-serif',
		fontWeight: '700',
		fontSize: '16px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		marginBottom: '10px',
	},
	textType: {
		fontFamily: 'Inter, sans-serif',
		fontWeight: '700',
		fontSize: '16px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		marginBottom: '10px',
	},
	imagePickerWrapper: {
		width: '100%',
		display: 'flex',
		alignItems: 'center'
	},
	imagePickerWrapperText: {
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 6,
		lineHeight: 6,
		color: 'gba(118, 128, 141, 0.5)',
		marginLeft: '3px',
	},
	imagePickerContainer: {
		width: '200px',
		height: '200px',
		borderRadius: '10px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#F5F5F5',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		margin: '1rem 0',
		cursor: 'pointer',
		position: 'relative'
	},
	errorMsg: {
		marginBottom: '',
		fontSize: '3px',
		color: '#C94B32',
	},
	deleteButton: {
		backgroundColor: '#76808D',
		padding: '5px',
		borderRadius: '5px',
		color: '#FFFFFF',
		cursor: 'pointer'
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
		opacity: 0.5,
		marginLeft: 13,
	},
	uploadIcon: {
		margin: 10
	},
	addButton: {
		padding: '0px 10px 0px 10px',
		borderRadius: '5px',
		borderWidth: '0px',
		borderColor: '#FFFFFF',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: '#FFFFFF'
	}
}))

export default ({ open, onClose }: { open: boolean, onClose: any }) => {
	const classes = useStyles();
	const { DAO, updateDaoLoading, updateDaoLinksLoading, storeGithubIssuesLoading, deleteDaoLinkLoading } = useAppSelector((state) => state.dashboard);
	const [name, setName] = useState(_get(DAO, 'name', ''));
	const [oUrl, setOUrl] = useState(_get(DAO, 'url', ''));
	const [description, setDescription] = useState(_get(DAO, 'description', ''));
	const [daoLinks, setDaoLinks] = useState(_get(DAO, 'links', []));
	const [linkTitle, setLinkTitle] = useState("");
	const [link, setLink] = useState("");
	const [image, setImage] = useState(_get(DAO, 'image', ''));
	const [droppedfiles, setDroppedfiles] = useState([]);
	const [uploadLoading, setUploadLoading] = useState(false);
	const [pullIssues, setPullIssues] = useState(false);
	const [importRoles, setImportRoles] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { onResetAuth } = useGithubAuth();
	const dispatch = useAppDispatch()

	useEffect(() => {
		setDaoLinks(_get(DAO, 'links', []));
	}, [DAO])

	useEffect(() => {
		if (storeGithubIssuesLoading === false) {
			dispatch(resetStoreGithubIssuesLoader());
			setIsAuthenticating(false);
			addLink();
		}
	}, [storeGithubIssuesLoading]);

	useEffect(() => {
		if (deleteDaoLinkLoading === false) {
			dispatch(resetDeleteDaoLinkLoader());
		}
	}, [deleteDaoLinkLoading])

	useEffect(() => {
		if (updateDaoLoading === false && updateDaoLinksLoading === false) {
			dispatch(resetUpdateDAOLoader());
			dispatch(resetUpdateDaoLinksLoader());
			onClose();
		}
	}, [updateDaoLoading, updateDaoLinksLoading])

	const addLink = useCallback(() => {
		if (!linkTitle || !link || (linkTitle && linkTitle === '') || (link && link === ''))
			return;
		let tempLink = link
		if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
			tempLink = 'https://' + link;
		}
		setDaoLinks([...daoLinks, { title: linkTitle, link: tempLink }]);
		setLinkTitle("")
		setLink("")

	}, [link, linkTitle]);

	const saveChanges = () => {
		console.log("save...", daoLinks)
		dispatch(updateDao({ url: DAO?.url, payload: { name, description, image } }))
		dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
	}

	const addNewLink = (e: any) => {
		let errorCount = 0;
		for (var i = 0; i < daoLinks.length; i++) {
			const title = daoLinks[i].title;
			const link = daoLinks[i].link;
			if (title === '') {
				errorCount += 1;
				const title = document.getElementById(`title${i}`)
				if (title) {
					title.innerHTML = 'Please enter title'
				}
			}
			else if (link === '') {
				errorCount += 1;
				const link = document.getElementById(`link${i}`)
				if (link) {
					link.innerHTML = 'Please enter link'
				}
			}
		}
		if (errorCount === 0) {
			console.log("DAo links : ", daoLinks);
			// dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
		}
	}

	const deleteLink = (response: any, item: any) => {
		if (item.link.indexOf('github.') > -1) {
			let repoInfo = extractGitHubRepoPath(item.link);
			let ob = _get(DAO, `github.${repoInfo}`, null)
			if (ob) {
				axiosHttp.get(`utility/getGithubAccessToken?code=${response.code}&repoInfo=${repoInfo}`)
					.then((res) => {
						if (res.data) {
							dispatch(deleteDaoLink({ url: DAO?.url, payload: { link: item, repoInfo, webhookId: ob.webhookId, token: res.data.access_token } }))
						}
						else {
							console.log("No res : Something went wrong");
						}
						onResetAuth();
					})
					.catch((e) => {
						onResetAuth()
						console.log("error : ", e);
					})

			}
			else {
				// no import issues github link
				let links = daoLinks.filter((l: any) => !(l.title === item.title && l.link === item.link))
				setDaoLinks(links);
			}
		}
		else {
			let links = daoLinks.filter((l: any) => !(l.title === item.title && l.link === item.link))
			setDaoLinks(links);
		}
	}

	const handleOnServerAdded = (serverId: any) => {
		if (importRoles) {
			axiosHttp.post(`discord/guild/${serverId}/sync-roles`, { daoId: _get(DAO, '_id') })
				.then(res => {
					addLink()
				})
		} else {
			addLink()
		}
	}

	const onDrop = useCallback((acceptedFiles: any) => { setDroppedfiles(acceptedFiles) }, [])

	const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })

	const getSignedUploadUrl = (file: any, callback: any) => {
		console.log(file)
		const filename = `DAOThumbnail/${nanoid(32)}.${file.type.split('/')[1]}`
		return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
	}

	//const onUploadProgress = (progress, message: string, file: string) => { }

	const onUploadError = () => { setDroppedfiles([]); setUploadLoading(false) }

	const onUploadStart = (file: string, next: any) => { setUploadLoading(true); return next(file); }

	const onFinish = (finish: any) => {
		setDroppedfiles([])
		setUploadLoading(false);
		var arr = finish.signedUrl.split('?');
		console.log("image : ", arr[0]);
		setImage(arr[0]);
	}

	const onSuccess = (response: any) => {
		setIsAuthenticating(true);
		const repoInfo = extractGitHubRepoPath(link);
		console.log("repo info : ", repoInfo);
		axiosHttp.get(`utility/getGithubAccessToken?code=${response.code}&repoInfo=${repoInfo}`)
			.then((res: any) => {
				if (res.data) {
					console.log("response : ", res.data);
					// check if issues has been previously pulled --- inside DAO object
					const githubOb = _get(DAO, 'github', null);

					if (githubOb) {
						console.log("githubOb : ", githubOb);
						if (_get(DAO, `github.${repoInfo}`, null)) {
							console.log("exists")
							const errorMsg = document.getElementById('error-msg');
							if (errorMsg) {
								errorMsg.innerHTML = 'Repository already added';
							}
							setIsAuthenticating(false);
							return;
						}
						else {
							console.log("doesnt exists")
							handleGithub(res.data.access_token, repoInfo);
						}
					}
					else {
						console.log("githubOb doesnt exists");
						handleGithub(res.data.access_token, repoInfo);
					}
				}
				else {
					alert("No res : Something went wrong");
					setIsAuthenticating(false);
				}
				onResetAuth();
			})
			.catch((e) => {
				onResetAuth()
				console.log("error : ", e);
				alert("Something went wrong");
				setIsAuthenticating(false);
			})
	}

	const onUploadProgress = (progress: any, message: any, file: any) => { }

	const extractGitHubRepoPath = (url: string) => {
		if (!url) return null;
		const match = url.match(
			/^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
		);
		if (!match || !(match.groups?.owner && match.groups?.name)) return null;
		return `${match.groups.owner}/${match.groups.name}`;
	}

	const handleGithub = (token: string, repoInfo: string | null) => {
		axiosHttp.get(`utility/get-issues?token=${token}&repoInfo=${repoInfo}&daoId=${_get(DAO, '_id', null)}`)
			.then((result: any) => {
				console.log("issues : ", result.data);
				if (result.data.message === 'error') {
					console.log("Not allowed");
					const e = document.getElementById('error-msg');
					if (e) {
						e.innerHTML = 'Please check repository for ownership or typography error';
					}
					setIsAuthenticating(false);
					return;
				}
				else {
					console.log("Allowed to pull and store issues")
					dispatch(storeGithubIssues({
						payload:
						{
							daoId: _get(DAO, '_id', null),
							issueList: result.data.data,
							token,
							repoInfo,
							linkOb: { title: linkTitle, link: link }
						}
					}));
				}
			})
	}

	const onFailure = (response: any) => console.error("git res : ", response);

	return (
		<Drawer
			PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
			sx={{ zIndex: 99999 }}
			anchor={'right'}
			open={open}
			onClose={() => onClose()}>
			<Box sx={{ width: 575, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
				<IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
					<img src={CloseSVG} />
				</IconButton>
				<Box>
					<Box sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginTop: 11,
							marginBottom: 5
						}}
					>
						<Image
							src={OD}
							alt="Organisation details icon"
							style={{ width: "94.48px", height: "50px" }}
						/>
						<Box id="title-type">Organisation Details</Box>
					</Box>
					<Box sx={{ padding: "0 50px 100px 50px"}}>
						<TextInput value={name}
							onChange={(evt: any) => setName(evt.target.value)}
							placeholder="Fashion Fusion" sx={{ my: 2 }} fullWidth label="Name" />
						<TextInput value={process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}
							disabled sx={{ my: 2 }} fullWidth label="Organisation’s URL" />

						<Box className={classes.textTypeOd}>Import thumbnail</Box>
						<Box className={classes.imagePickerWrapper}>
							<Box className={classes.imagePickerContainer}>
								{
									image
										?
										<Box style={{ position: 'relative', width: '100%', height: '100%' }}>
											<Box onClick={() => setImage(null)} style={{ cursor: 'pointer' }}>
												<img style={{ width: 18, height: 18, position: 'absolute', right: 8, top: 8, opacity: 0.7 }} src={require('../assets/images/close.png')} />
											</Box>
											<img src={image} alt="selected-token-icon" className="selected-img" />
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

						<hr
							style={{
								height: 2,
								width: 208,
								background: "#C94B32",
								margin: "36px auto 35px",
							}}
						/>
						<Box className={classes.textType}>Links</Box>

						<Box
							style={{
								display: "flex",
								flexDirection: "row",
								marginTop: 9,
								alignItems: 'center',
								justifyContent: "space-between",
							}}
						>
							<Box>
								<TextInput
									placeholder="Ex Portfolio"
									fullWidth
									sx={{ mr: 1 }}
									value={linkTitle}
									onChange={(evt: any) => {
										const e = document.getElementById('error-msg');
										if (e) {
											e.innerHTML = '';
										}
										setLinkTitle(evt.target.value)
									}}
								/>
							</Box>
							<Box>
								<TextInput
									value={link}
									placeholder="link"
									fullWidth
									sx={{ mr: 1 }}
									onChange={(evt: any) => {
										const e = document.getElementById('error-msg');
										if (e) {
											e.innerHTML = '';
										}
										setLink(evt.target.value)
									}}
								/>
							</Box>
						</Box>
						{
							link && link.indexOf('github.') > -1
								?
								<Box ml={2} my={2}>
									<Switch checked={pullIssues} onChange={() => setPullIssues(prev => !prev)} label="IMPORT ISSUES" />
								</Box>
								:
								<>
									{
										link && link.indexOf('discord.') > -1
											?
											<Box ml={2} my={2}>
												<Switch checked={importRoles} onChange={() => setImportRoles(prev => !prev)} label="IMPORT ROLES" />
											</Box>
											:
											null
									}
								</>
						}
						<Box className={classes.errorMsg} id="error-msg"></Box>
						{daoLinks.length > 0 &&
							<Box
								style={{
									marginTop: 9,
									padding: "9px 20px 9px 20px",
									backgroundColor: "rgba(118, 128, 141, 0.05)",
									color: "#718096",
									borderRadius: 5,
									justifyContent: 'space-between'
								}}>
								{daoLinks.map((item: any, index: any) => {
									return (
										<Box
											style={{
												display: "flex",
												flexDirection: "row",
												marginTop: 9,
												color: "#718096",
												justifyContent: 'space-between'
											}}>
											<Box
												style={{
													display: "flex",
													flexDirection: "row"
												}}
											>
												<Typography sx={{
													width: 98
												}}>{item.title.length > 10 ? item.title.substring(0, 10) + "..." : item.title}</Typography>
												<Typography variant="body1" sx={{
													width: 250,
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													fontStyle: 'italic'
												}}>
													{item.link}
												</Typography>
											</Box>
											{link && link.indexOf('discord.') > -1 ?
												<AddDiscordLink
													renderButton={
														<IconButton
															className={classes.addButton}
															Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
															height={40}
															width={40}
															bgColor={
																(linkTitle.length > 0 && isValidUrl(link))
																	? "#C94B32"
																	: "rgba(27, 43, 65, 0.2)"
															}
														/>
													}
													title={''}
													desc={''}
													roleName={''}
													okButton={false}
													onLinkError={false}
													onGuildCreateSuccess={handleOnServerAdded}
													accessControl={true}
													link={link}
												/>
												:
												<>
													{console.log(link)}
													{

														link && link.indexOf('github.') > -1 && pullIssues
															?
															<AddGithubLink
																renderButton={''}
																onSuccess={onSuccess}
																title={linkTitle}
																link={link}
																loading={isAuthenticating}
																desc=''
																roleName=''
																accessControl={false}
																okButton={false}
																onGuildCreateSuccess=''
																innerRef=''
																validate={false}
															/>
															:
															<IconButton
																className={classes.addButton}
																Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
																height={40}
																width={40}
																onClick={() => addLink()}
																bgColor={
																	(linkTitle.length > 0 && isValidUrl(link))
																		? "#C94B32"
																		: "rgba(27, 43, 65, 0.2)"
																}
															/>
													}
												</>
											}
											{
												item.link && item.link.indexOf('github.') > -1
													?
													<AddGithubLink
														renderButton={
															<Box
																className={classes.deleteButton}
															>
																<AiOutlineClose style={{ height: 15, width: 15 }} />
															</Box>
														}
														onSuccess={(res: any) => deleteLink(res, item)}
														title=''
														desc=''
														loading={false}
														roleName=''
														accessControl={false}
														okButton={false}
														onGuildCreateSuccess=''
														innerRef=''
														validate={false}
														link={item.link}
													/>
													:
													<Box
														className={classes.deleteButton}
														onClick={() => {
															deleteLink(null, item);
														}}
													>
														<AiOutlineClose style={{ height: 100, width: 100 }} />
													</Box>

											}
										</Box>
									)
								})}
							</Box>}
					</Box>
					<Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: '567px', position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px', padding: "30px 0 20px" }}>
						<Box display="flex" mt={4} width={380} style={{ margin: '0 auto' }} flexDirection="row">
							<Button onClick={() => onClose()} sx={{ mr: 1 }} fullWidth variant='outlined' size="small">Cancel</Button>
							<Button onClick={() => saveChanges()} sx={{ ml: 1 }} fullWidth variant='contained' size="small">Save</Button>
						</Box>
					</Box>
				</Box>
			</Box>
		</Drawer>
	)
}