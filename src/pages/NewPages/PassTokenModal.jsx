import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import PT from "../../assets/images/drawer-icons/PT.svg";
import {  Image, Input } from "@chakra-ui/react";
import Button from "muiComponents/Button";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CreateMorePassTokenModal from "./CreateMorePassTokenModal";
import { useAppDispatch, useAppSelector } from "state/hooks";
import coin from '../../assets/svg/coin.svg';
import { get as _get, find as _find } from 'lodash';
import { updateContract } from "state/dashboard/actions";
import { useWeb3React } from "@web3-react/core";
import { SupportedChainId } from 'constants/chains'
import GOERLI_LOGO from 'assets/images/goerli.png';
import POLYGON_LOGO from 'assets/images/polygon.png';
import { resetUpdateContractLoading } from "state/dashboard/reducer";


const PassTokenModal = ({ togglePassToken }) => {

	const dispatch = useAppDispatch()
	const { provider, account, chainId, connector } = useWeb3React();
	const [openCreatePassToken, setOpenCreatePassToken] = useState(false);

	const { DAO, updateContractLoading } = useAppSelector((state) => state.dashboard);

	const [dWhiteListed, setDWhiteListed] = useState(_get(DAO?.sbt, 'whitelisted', false));
	const [contactDetail, setContactDetail] = useState(_get(DAO?.sbt, 'contactDetail', []));

	let toggleCreatePassTokenModal = () => {
		setOpenCreatePassToken(prev => !prev);
	};

	let changeContactDetails = (contact) => {
		if (contactDetail.indexOf(contact) > -1) {
			let newDetailsArray = contactDetail.filter(l => !(l === contact))
			setContactDetail(newDetailsArray)
		} else {
			let newDetailsArray = [...contactDetail, contact]
			setContactDetail(newDetailsArray)
		}
	}

	useEffect(() => {
		if (updateContractLoading === false) {
			dispatch(resetUpdateContractLoading())
			togglePassToken();
		}
	}, [updateContractLoading])

	const handleSave = () => {
		dispatch(updateContract({
			contractAddress: _get(DAO, 'sbt.address', ''),
			payload: {
				daoId: _get(DAO, '_id', ''),
				whitelisted: dWhiteListed,
				contactDetail
			}
		}))
	}

	return (
		<>
			<div className="sidebarModal">
				<div
					onClick={() => {
						togglePassToken();
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
							onClick={() => {
								togglePassToken();
							}}
						/>
					</div>

					<div className="MainComponent">
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center"
							}}
						>
							<Image
								src={PT}
								alt="Pass Token icon"
								style={{ width: "94.48px", height: "50px" }}
							/>
							<div id="title-type">Pass Tokens</div>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "flex-start",
							}}
						>
							{/* logo container  */}
							<div id="pass-tokens-logo-container"
								onClick={() => {
									return (
										chainId === SupportedChainId.POLYGON ?
											window.open(`https://polygonscan.com/address/${_get(DAO, 'sbt.address', '')}`, '_blank') :
											chainId === SupportedChainId.GOERLI ?
												window.open(`https://etherscan.io/address/${_get(DAO, 'sbt.address', '')}`, '_blank') :
												undefined)
								}}
							>
								{DAO?.sbt?.image ? <img style={{ width: 24, height: 24 }} src={DAO?.sbt?.image} alt="asset" /> : <img src={coin} alt="asset" />}
							</div>
							<div
								style={{
									marginTop: "7px",
									marginLeft: "15px",
									width: "290px",
									display: "flex",
									justifyContent: "end",
								}}
							>
								<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} id="token-title">{_get(DAO, 'sbt.token', _get(DAO, 'sbt.name', ''))}
									<span onClick={() => {
										window.open(
											chainId === SupportedChainId.GOERLI ?
												`https://goerli.etherscan.io/address/${_get(DAO, 'sbt.address')}` :
												`https://polygonscan.com/address/${_get(DAO, 'sbt.address')}`
										)
									}}><img style={{ width: 20, height: 20, objectFit: 'contain', marginLeft: 16 }} src={chainId === SupportedChainId.GOERLI ? GOERLI_LOGO : POLYGON_LOGO} /></span>
								</div>
								{DAO?.sbt?.tokenSupply && <div id="#number-100"></div>}
							</div>
						</div>
						{/* <div id="create-more-section">
              <Button
                id="button-create-more"
                onClick={toggleCreatePassTokenModal}
              >
                <AddIcon id="add-icon" />
                CREATE MORE
              </Button>
            </div> */}
						<div id="hr" />
						<div
							id="membership-policy-section"
						// style={{
						//   display: "flex",
						//   flexDirection: "column",
						//   justifyContent: "start",
						// }}
						>
							<div id="text-type">Membership policy:</div>

							<div style={{ display: "flex", alignItems: "center" }}>
								<label class="switch">
									<input defaultChecked={dWhiteListed} onChange={(e, d) => setDWhiteListed(e.target.checked)} type="checkbox" />
									<span class="slider round"></span>
								</label>
								<div id="switch-title">WHITELISTED</div>
							</div>
						</div>
						<div id="contact-details-section">
							<div id="text-type">Contact details</div>
							<p id="paragraph-type-1">
								Get certain member details could be useful for the smooth
								functioning of your organisation
							</p>
							<div
								style={{
									marginTop: "20px",
									display: "flex",
									alignItems: "center",
								}}
							>
								<label class="switch">
									<input defaultChecked={contactDetail.indexOf('email') > -1} onChange={(e, d) => changeContactDetails("email")} type="checkbox" />
									<span class="slider check round"></span>
								</label>
								<div id="switch-title">Email</div>
							</div>
							<p id="paragraph-type">
								Please select if you intend to use services such as Notion,
								Google Workspace and GitHub.
							</p>

							<div
								style={{
									marginTop: "20px",
									display: "flex",
									alignItems: "center",
								}}
							>
								<label class="switch">
									<input defaultChecked={contactDetail.indexOf('discord') > -1} onChange={(e, d) => changeContactDetails("discord")} type="checkbox" />
									<span class="slider check round"></span>
								</label>
								<div id="switch-title">Discord user-id</div>
							</div>
							<p id="paragraph-type">
								Please select if you intend to use access-controlled channels in
								Discord.
							</p>

							<div
								style={{
									marginTop: "20px",
									display: "flex",
									alignItems: "center",
								}}
							>
								<label class="switch">
									<input defaultChecked={contactDetail.indexOf('telegram') > -1} onChange={(e, d) => changeContactDetails("telegram")} type="checkbox" />
									<span class="slider check round"></span>
								</label>
								<div id="switch-title">Telegram user-id</div>
							</div>
							<p id="paragraph-type">
								Please select if you intend to use access-controlled Telegram
								groups.
							</p>
						</div>
						{/* //! FOOTER */}
						
						<Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 300, background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px', padding: "30px 0 20px" }}>
							<Button
								size="small"
								style={{ marginRight: 6 }}
								variant="outlined"
								onClick={() => {
									togglePassToken();
								}}
							>
								CANCEL
							</Button>
							<Button  size="small" variant="contained" disabled={updateContractLoading == true} onClick={() => handleSave()}>SAVE</Button>
						</Box>
					</div>
				</div>
			</div>

			{openCreatePassToken && (
				<CreateMorePassTokenModal
					navFromSetting={false}
					toggleCreatePassTokenModal={toggleCreatePassTokenModal}
				/>
			)}
		</>
	);
};

export default PassTokenModal;