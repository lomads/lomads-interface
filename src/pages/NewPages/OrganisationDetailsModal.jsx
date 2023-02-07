import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input, Textarea } from "@chakra-ui/react";
import { useAppSelector } from "state/hooks";
import { useCallback, useEffect, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import { isValidUrl } from "utils";
import { useDispatch } from "react-redux";
import axiosHttp from 'api'
import { updateDao, updateDaoLinks } from 'state/dashboard/actions';
import AddDiscordLink from 'components/AddDiscordLink';
import { setDAO } from "state/dashboard/reducer";

const OrganisationDetails = ({
	toggleModal,
	toggleOrganisationDetailsModal,
}) => {

	const { DAO, updateDaoLoading, updateDaoLinksLoading } = useAppSelector((state) => state.dashboard);
	const [name, setName] = useState(_get(DAO, 'name', ''));
	const [oUrl, setOUrl] = useState(_get(DAO, 'url', ''));
	const [description, setDescription] = useState(_get(DAO, 'description', ''));
	const [daoLinks, setDaoLinks] = useState(_get(DAO, 'links', []));
	const [linkTitle, setLinkTitle] = useState("");
	const [link, setLink] = useState("");
	const dispatch = useDispatch()

	useEffect(() => {
		setDaoLinks(_get(DAO, 'links', []));
	}, [DAO])

	const addLink = useCallback(() => {
		let tempLink = link
		if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
			tempLink = 'https://' + link;
		}
		setDaoLinks([...daoLinks, { title: linkTitle, link: tempLink }]);
		setLinkTitle("")
		setLink("")
	},[link])

	const saveChanges = () => {
		console.log(description)
		dispatch(updateDao({ url: DAO?.url, payload: { name, description } }))
		dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
		toggleModal();
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
		// let links = _get(DAO, 'links', []);
		let links = daoLinks.filter(l => !(l.title === item.title && l.link === item.link))
		setDaoLinks(links)
		// dispatch(updateDao({ url: DAO?.url, payload: { links } }))
	}

	const handleOnServerAdded = serverId => {
		axiosHttp.post(`discord/guild/${serverId}/sync-roles`, { daoId: _get(DAO, '_id') })
		.then(res => {
			addLink()
			//dispatch(setDAO(res.data))
		})
	}

	return (
		<>
			<div className="sidebarModal">
				<div
					onClick={() => {
						toggleModal();
						toggleOrganisationDetailsModal();
					}}
					className="overlay"
				></div>
				<div className="SideModalNew">
					<div className="closeButtonArea">
						<IconButton
							Icon={
								<AiOutlineClose
									style={{
										color: "#C94B32",
										height: "16px",
										width: "16px",
									}}
								/>
							}
							bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
							height={37}
							width={37}
							className="sideModalCloseButton"
							onClick={toggleModal}
						/>
					</div>
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
								padding: "0 50px",
							}}
						>
							<div id="text-type-od">Name</div>
							<Input value={name} variant="filled" onChange={(evt) => setName(evt.target.value)} placeholder="Fashion Fusion" />
							<div id="text-type-od">Description</div>
							<Textarea value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder='DAO Description' variant="filled" />
							{/* <Input value={name} variant="filled" onChange={(evt)=>setName(evt.target.value)}  placeholder="Fashion Fusion" /> */}
							<div id="text-type-od">Organisation’s URL</div>
							<Input
								variant="filled"
								placeholder="https://app.lomads.xyz/Name"
								disabled
								value={process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}
							/>

							<hr
								style={{
									height: "1px",
									width: 288,
									background: "#C94B32",
									margin: "35px auto 35px",
								}}
							/>
							<div id="text-type">Member visibility</div>
							<p id="paragraph-type">
								If unlocked, everyone in the organisation will be able to see
								who is part of which project. Otherwise, only members part of a
								project sees the members they are working with.
							</p>
							<label class="switch" style={{ marginTop: "10px" }}>
								<input type="checkbox" />
								<span class="slider round"></span>
							</label>

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
									justifyContent: "space-between",
								}}
							>
								<Input
									placeholder="Ex Portfolio"
									variant="filled"
									width="35%"
									value={linkTitle}
									onChange={(evt) => setLinkTitle(evt.target.value)}
								/>
								<Input value={link} placeholder="link" variant="filled" width="50%" onChange={(evt) => setLink(evt.target.value)} />
								{/* <IconButton icon={<AddIcon />} /> */}
								{ link && link.indexOf('discord.') > -1 ?
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
								onGuildCreateSuccess={handleOnServerAdded} accessControl={true} link={link} /> : 
								<IconButton
									className="addButton"
									Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
									height={40}
									width={40}
									onClick={addLink}
									bgColor={
										(linkTitle.length > 0 && isValidUrl(link))
											? "#C94B32"
											: "rgba(27, 43, 65, 0.2)"
									}
								/>
								}
							</div>
							{ daoLinks.length > 0 &&
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
												<p width="50%" style={{ paddingLeft: 8 }}>{item.link.length > 6 ? item.link.substring(0, 40) + "..." : item.link}</p>
											</div>
											<div
												className="deleteButton"
												onClick={() => {
													deleteLink(item);
												}}
											>
												<AiOutlineClose style={{ height: 15, width: 15 }} />
											</div>
										</div>
									)
								})}
							</div> }
						</div>

						{/* //! FOOTER */}
						<div className="button-section">
							<Button
								variant="outline"
								style={{ marginRight: 8 }}
								id="button-cancel"
								onClick={() => {
									toggleModal();
									toggleOrganisationDetailsModal();
								}}
							>
								CANCEL
							</Button>
							<Button onClick={() => {
								saveChanges()
							}} id="button-save">SAVE CHANGES</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrganisationDetails;
