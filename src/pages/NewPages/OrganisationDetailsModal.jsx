import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import { Box, Typography } from "@mui/material";
import Button from 'muiComponents/Button'
import { default as MuiIconButton } from 'muiComponents/IconButton'
import CloseSVG from 'assets/svg/close-new.svg'
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Image, Input, Textarea } from "@chakra-ui/react";
import { useAppSelector } from "state/hooks";
import { useCallback, useEffect, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import { isValidUrl } from "utils";
import { useDispatch } from "react-redux";
import axiosHttp from 'api'
import { updateDao, updateDaoLinks, storeGithubIssues, deleteDaoLink } from 'state/dashboard/actions';
import AddDiscordLink from 'components/AddDiscordLink';
import { setDAO, resetStoreGithubIssuesLoader, resetDeleteDaoLinkLoader } from "state/dashboard/reducer";
import AddGithubLink from "components/AddGithubLink";

import TextInput from "muiComponents/TextInput";

import ReactS3Uploader from 'components/ReactS3Uploader';
import { LeapFrog } from "@uiball/loaders";
import { nanoid } from "@reduxjs/toolkit";
import { useDropzone } from 'react-dropzone'
import uploadIcon from '../../assets/svg/ico-upload.svg';

import LoginGithub from 'react-login-github';
import Switch from "muiComponents/Switch";
import { title } from "process";
import useGithubAuth from "hooks/useGithubAuth";

const OrganisationDetails = ({ toggleOrganisationDetailsModal, githubLogin }) => {

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
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { onResetAuth } = useGithubAuth();
	const dispatch = useDispatch()

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
			dispatch(resetDeleteDaoLinkLoader);
		}
	}, [deleteDaoLinkLoading])

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
		dispatch(updateDao({ url: DAO?.url, payload: { name, description, image } }))
		// dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
		toggleOrganisationDetailsModal();
	}

	const addNewLink = (e) => {
		let errorCount = 0;
		for (var i = 0; i < daoLinks.length; i++) {
			const title = daoLinks[i].title;
			const link = daoLinks[i].link;
			if (title === '') {
				errorCount += 1;
				document.getElementById(`title${i}`).innerHTML = 'Please enter title'
			}
			else if (link === '') {
				errorCount += 1;
				document.getElementById(`link${i}`).innerHTML = 'Please enter link'
			}
		}
		if (errorCount === 0) {
			console.log("DAo links : ", daoLinks);
			// dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
		}
	}

	const deleteLink = (item) => {
		if (item.link.indexOf('github.') > -1) {
			let repoInfo = extractGitHubRepoPath(item.link);
			let ob = _get(DAO, `github.${repoInfo}`, null)
			if (ob) {
				dispatch(deleteDaoLink({ url: DAO?.url, payload: { link: item, repoInfo, webhookId: ob.webhookId } }))
			}
			else {
				// no import issues github link
				let links = daoLinks.filter(l => !(l.title === item.title && l.link === item.link))
				setDaoLinks(links);
			}
		}
		else {
			let links = daoLinks.filter(l => !(l.title === item.title && l.link === item.link))
			setDaoLinks(links);
		}
	}

	const handleOnServerAdded = serverId => {
		axiosHttp.post(`discord/guild/${serverId}/sync-roles`, { daoId: _get(DAO, '_id') })
			.then(res => {
				addLink()
				//dispatch(setDAO(res.data))
			})
	}

	const onDrop = useCallback(acceptedFiles => { setDroppedfiles(acceptedFiles) }, [])

	const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })

	const getSignedUploadUrl = (file, callback) => {
		console.log(file)
		const filename = `DAOThumbnail/${nanoid(32)}.${file.type.split('/')[1]}`
		return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
	}

	const onUploadProgress = (progress, message, file) => { }

	const onUploadError = error => { setDroppedfiles([]); setUploadLoading(false) }

	const onUploadStart = (file, next) => { setUploadLoading(true); return next(file); }

	const onFinish = finish => {
		setDroppedfiles([])
		setUploadLoading(false);
		var arr = finish.signedUrl.split('?');
		console.log("image : ", arr[0]);
		setImage(arr[0]);
	}

	const onSuccess = (response) => {
		setIsAuthenticating(true);
		const repoInfo = extractGitHubRepoPath(link);
		console.log("repo info : ", repoInfo);
		axiosHttp.get(`utility/getGithubAccessToken?code=${response.code}&repoInfo=${repoInfo}`)
			.then((res) => {
				if (res.data) {
					console.log("response : ", res.data);
					// check if issues has been previously pulled --- inside DAO object
					const githubOb = _get(DAO, 'github', null);

					if (githubOb) {
						console.log("githubOb : ", githubOb);
						if (_get(DAO, `github.${repoInfo}`, null)) {
							console.log("exists")
							const e = document.getElementById('error-msg');
							e.innerHTML = 'Repository already added';
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

	const extractGitHubRepoPath = (url) => {
		if (!url) return null;
		const match = url.match(
			/^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
		);
		if (!match || !(match.groups?.owner && match.groups?.name)) return null;
		return `${match.groups.owner}/${match.groups.name}`;
	}

	const handleGithub = (token, repoInfo) => {
		axiosHttp.get(`utility/get-issues?token=${token}&repoInfo=${repoInfo}&daoId=${_get(DAO, '_id', null)}`)
			.then((result) => {
				console.log("issues : ", result.data);
				if (result.data.message === 'error') {
					console.log("Not allowed");
					const e = document.getElementById('error-msg');
					e.innerHTML = 'Please check repository for ownership or typography error';
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

	const onFailure = response => console.error("git res : ", response);

	return (
		<>
			<div className="sidebarModal">
				<div
					onClick={() => {
						toggleOrganisationDetailsModal();
					}}
					className="overlay"
				></div>
				<div className="SideModalNew">
					<MuiIconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => toggleOrganisationDetailsModal()}>
						<img src={CloseSVG} />
					</MuiIconButton>
					<div className="MainComponent">
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Image
								src={OD}
								alt="Organisation details icon"
								style={{ width: "94.48px", height: "50px" }}
							/>
							<div id="title-type">Organisation Details</div>
						</div>
						{/* //! BODY */}
						<div
							style={{
								padding: "0 50px 100px 50px",
							}}
						>
							{/* <Input value={name} variant="filled" onChange={(evt) => setName(evt.target.value)} placeholder="Fashion Fusion" /> */}
							<TextInput value={name}
								onChange={(evt) => setName(evt.target.value)}
								placeholder="Fashion Fusion" sx={{ my: 2 }} fullWidth label="Name" />
							{/* <div id="text-type-od">Description</div>
							<Textarea value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder='DAO Description' variant="filled" /> */}
							{/* <Input value={name} variant="filled" onChange={(evt)=>setName(evt.target.value)}  placeholder="Fashion Fusion" /> */}
							<TextInput value={description}
								onChange={(e) => { setDescription(e.target.value) }}
								multiline
								rows={4}
								placeholder="DAO Description" sx={{ my: 2 }} fullWidth label="Description" />
							<TextInput value={process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}
								disabled sx={{ my: 2 }} fullWidth label="Organisation’s URL" />

							{/* <hr
								style={{
									height: "1px",
									width: 288,
									background: "#C94B32",
									margin: "35px auto 35px",
								}}
							/> */}
							<div id="text-type-od">Member visibility</div>
							<p id="paragraph-type">
								If unlocked, everyone in the organisation will be able to see
								who is part of which project. Otherwise, only members part of a
								project sees the members they are working with.
							</p>
							<Box ml={1} my={2}>
								<Switch />
							</Box>

							<div id="text-type-od">Import thumbnail</div>
							<div className="image-picker-wrapper">
								<div className="image-picker-container">
									{
										image
											?
											<div style={{ position: 'relative', width: '100%', height: '100%' }}>
												<div onClick={() => setImage(null)} style={{ cursor: 'pointer' }}>
													<img style={{ width: 18, height: 18, position: 'absolute', right: 8, top: 8, opacity: 0.7 }} src={require('../../assets/images/close.png')} />
												</div>
												<img src={image} alt="selected-token-icon" className="selected-img" />
											</div>
											:
											<div {...getRootProps()}>
												<ReactS3Uploader
													droppedfiles={droppedfiles}
													getSignedUrl={getSignedUploadUrl}
													accept="image/png,image/jpeg,image/jpg"
													className={{ display: 'none' }}
													onProgress={onUploadProgress}
													onError={onUploadError}
													preprocess={onUploadStart}
													onFinish={onFinish}
													multiple
													uploadRequestHeaders={{
													}}
													contentDisposition="auto"
												/>
												<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
													{uploadLoading ?
														<LeapFrog size={24} color="#C94B32" /> :
														<>
															<img src={uploadIcon} alt="upload-icon" />
															<p>Choose <br /> or drag an image</p>
															<span>maximum size 2mb</span>
														</>
													}
												</div>

												<input {...getInputProps()} />
											</div>

									}
								</div>
								<p className="text">Accepted formats:<br />jpg, svg or png</p>
							</div>

							<hr
								style={{
									height: "1px",
									width: 288,
									background: "#C94B32",
									margin: "36px auto 35px",
								}}
							/>
							<div id="text-type">Links</div>

							<div
								style={{
									display: "flex",
									flexDirection: "row",
									marginTop: "9px",
									alignItems: 'center',
									justifyContent: "space-between",
								}}
							>
								<TextInput
									placeholder="Ex Portfolio"
									fullWidth
									sx={{ mr: 1 }}
									value={linkTitle}
									onChange={(evt) => {
										const e = document.getElementById('error-msg');
										e.innerHTML = '';
										setLinkTitle(evt.target.value)
									}}
								/>
								<TextInput
									value={link}
									placeholder="link"
									fullWidth
									sx={{ mr: 1 }}
									onChange={(evt) => {
										const e = document.getElementById('error-msg');
										e.innerHTML = '';
										setLink(evt.target.value)
									}}
								/>
								{/* <IconButton icon={<AddIcon />} /> */}
								{link && link.indexOf('discord.') > -1 ?
									<AddDiscordLink
										renderButton={
											<IconButton
												className="addButton"
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
												<>
													{
														// isAuthenticating
														// 	?
														// 	<button className="githubAddButton active" disabled>
														// 		<LeapFrog size={20} color="#FFF" />
														// 	</button>
														// 	:
														// <LoginGithub
														// 	clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
														// 	scope="repo user admin:repo_hook admin:org"
														// 	onSuccess={onSuccess}
														// 	onFailure={onFailure}
														// 	className={linkTitle.length > 0 && isValidUrl(link) ? "githubAddButton active" : "githubAddButton"}
														// 	buttonText="+"
														// />
														<AddGithubLink onSuccess={onSuccess} title={linkTitle} link={link} />
													}
												</>
												:
												<IconButton
													className="addButton"
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
							</div>
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
												<div className="link-toggle-section">
													<label class="switch" style={{ marginTop: "10px" }}>
														<input type="checkbox" />
														<span class="slider round"></span>
													</label>
													<span className="toggle-text">IMPORT ROLES</span>
												</div>
												:
												null
										}
									</>
							}
							<span className="error-msg" id="error-msg"></span>
							{daoLinks.length > 0 &&
								<div
									style={{
										marginTop: "9px",
										padding: "9px 20px 9px 20px",
										backgroundColor: "#edf2f7",
										color: "#718096",
										borderRadius: "5px",
										justifyContent: 'space-between'
									}}>
									{daoLinks.map((item, index) => {
										return (
											<div
												style={{
													display: "flex",
													flexDirection: "row",
													marginTop: "9px",
													color: "#718096",
													justifyContent: 'space-between'
												}}>
												<div
													style={{
														display: "flex",
														flexDirection: "row"
													}}
												>
													<p width="50%">{item.title.length > 7 ? item.title.substring(0, 7) + "..." : item.title}</p>
													<p width="50%" style={{
														paddingLeft: 8,
														width: 250,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis'
													}}>{item.link}</p>
												</div>
												<div
													className="deleteButton"
													onClick={() => {
														deleteLink(item);
													}}
												>
													{
														deleteDaoLinkLoading
															?
															<LeapFrog size={24} color="#C94B32" />
															:
															<AiOutlineClose style={{ height: 15, width: 15 }} />
													}
												</div>
											</div>
										)
									})}
								</div>}
						</div>

						{/* //! FOOTER */}
						{/* <div className="button-section">
							<Button
								variant="outline"
								style={{ marginRight: 8 }}
								id="button-cancel"
								onClick={() => {
									toggleOrganisationDetailsModal();
								}}
							>
								CANCEL
							</Button>
							<Button onClick={() => {
								saveChanges()
							}} id="button-save">SAVE CHANGES</Button>
						</div> */}
						<Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: '567px', position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px', padding: "30px 0 20px" }}>
							<Box display="flex" mt={4} width={380} style={{ margin: '0 auto' }} flexDirection="row">
								<Button onClick={() => toggleOrganisationDetailsModal()} sx={{ mr: 1 }} fullWidth variant='outlined' size="small">Cancel</Button>
								<Button onClick={() => saveChanges()} sx={{ ml: 1 }} fullWidth variant='contained' size="small">Save</Button>
							</Box>
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrganisationDetails;
