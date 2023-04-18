import { Checkbox } from "@chakra-ui/react";
import { get as _get } from 'lodash';
import { Box } from "@mui/material";
import Button from "muiComponents/Button";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import doubleEuro from "../../../../assets/svg/doubleEuro.svg";
import daoMember2 from "../../../../assets/svg/daoMember2.svg";
import SafeButton from "UIpack/SafeButton";
import OutlineButton from "UIpack/OutlineButton";
import SimpleInputField from "UIpack/SimpleInputField";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import { IselectTransactionSend, IsetRecipientType } from "types/DashBoardType";
import AddRecipient from "./AddRecipient";
// import NumberInputStepper from "UIpack/NumberInputStepper";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { ImportSafe } from "connection/SafeCall";
import { SupportedChainId } from "constants/chains";
import {useSafeTokens} from "hooks/useSafeTokens";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import {
	Input,
	FormControl,
	FormErrorMessage,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberDecrementStepper,
	NumberIncrementStepper,
} from "@chakra-ui/react";
import Avatar from "muiComponents/Avatar";
import Dropdown from "muiComponents/Dropdown";


const TransactionSend = (props: IselectTransactionSend) => {
	console.log("error : ", props.error)
	const { DAO } = useAppSelector((state) => state?.dashboard);
	const { safeTokens } = useSafeTokens()
	const { chainId } = useWeb3React();
	
	const managePreviousNavigation = () => {
		const length = props.setRecipient.current.length;
		props.setRecipient.current.splice(0, length);
		props.showNavigation(true, false, false);
	};

	const deleteMember = (_address: any) => {
		const deleteMember = [...props.setRecipient.current];

		const newContract = deleteMember.splice(
			deleteMember.findIndex((ele) => ele.recipient === _address),
			1
		);
		props.setRecipient.current = deleteMember;
		console.log(newContract);
		setShowInput(props.setRecipient.current);
	};

	const [showInput, setShowInput] = useState(props.setRecipient.current);
	return (
		<>
			<div id="transactionSendPage">
				<div id="doubleEuroImage">
					<img src={doubleEuro} alt="euro" id="recipientDoubleEuro" />
				</div>
				<div id="transactionDetails">Transaction Details</div>
				<div className="currencySelectionArea">
					<div className="dashboardTextBold">Currency: </div>
					<div>
						<select
							name="chain"
							id="chain"
							className="tokenDropdown"
							placeholder="Select Token"
							onChange={(e) => {
								props.selectToken(e.target.value);
							}}
							defaultValue={props.selectedToken}
						>
							{safeTokens.map((result: any, index: any) => {
								return (
									(
										<>
											<option value={result?.tokenAddress} key={index}>
												{_get(result, 'token.symbol')}
											</option>
										</>
									)
								);
							})}
							{_get(DAO, 'sweatPoints', false) &&
								<option value="SWEAT">SWEAT</option>}
						</select>
					</div>
				</div>
				<div id="transactionSendDivider1"></div>
				<div id="recipientListandButtons">
					<div id="recipientList">
						{showInput.map((result: IsetRecipientType, index: number) => {
							console.log("result : ",result);
							return (
								<div id="assignAmount">
									<div id="recipientAvatarAndName" className="sendToken">
										<Avatar name={result.name} wallet={result.recipient}/>
										{/* <img src={daoMember2} alt={result.recipient} />
										<p className="nameText">
											{result.name.length < 1
												? result.recipient.slice(0, 6) +
												"..." +
												result.recipient.slice(-4)
												: result.name}
										</p> */}
										<div>
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
												height={25}
												width={25}
												className="sideModalCloseButton"
												onClick={(e) => {
													deleteMember(result.recipient);
												}}
											/>
										</div>
									</div>
									<div id="amountInputFields">
										<div>
											<NumberInput onChange={(e) => {
												props.setRecipient.current[index].amount = `${+e}`;
											}} style={{ width: (54 + 50), height: 40, borderRadius: '10px 10px 10px 10px', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)' }} step={1} min={0}>
												<NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 40, width: 54, backgroundColor: '#F5F5F5', borderRadius: '10px 0px 0px 10px', borderWidth: 0 }} />
												<NumberInputStepper style={{ width: 50, backgroundColor: 'transparent', borderRadius: '10px 10px 10px 10px' }}>
													<NumberIncrementStepper color="#C94B32" />
													<NumberDecrementStepper color="#C94B32" style={{ borderTopWidth: 0 }} />
												</NumberInputStepper>
											</NumberInput>
										</div>
										<div>
											<SimpleInputField
												height={40}
												width={195}
												padding={'0 10px'}
												placeholder="Reason for transaction"
												type="text"
												onchange={(e) => {
													props.setRecipient.current[index].reason =
														e.target.value;
												}}
											/>
										</div>
										<div style={{width:'192px'}}>
											<Dropdown 
												onChangeOption={(value:any) => props.setRecipient.current[index].tag = value}
											/>
										</div>
										
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div id="addMember">
					<div>
						<SafeButton
							bgColor="#FFFFFF"
							disabled={false}
							title="ADD A MEMBER"
							titleColor="#76808D"
							fontsize={16}
							fontweight={400}
							height={40}
							width={162}
							onClick={() => {
								managePreviousNavigation();
							}}
						/>
					</div>
				</div>
				{props.error && typeof props.error === 'string' && <div style={{ fontSize: 14, color: 'red', textAlign: 'center' }}>{props.error}</div>}
				<div id="transactionSendDivider2"></div>
				<Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: '500px',  position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px' , padding: "30px 0 20px" }}>
					<Box display="flex" mt={4} justifyContent="center" flexDirection="row">
						<Button loading={props.isLoading} onClick={() => props.createTransaction()} sx={{ ml:1 }}  variant='contained' size="small">SEND TOKENS</Button>
					</Box>
				</Box>
				{/* <div id="transactionSendButton">
					<SimpleLoadButton
						title="SEND TOKENS"
						height={50}
						width={180}
						bgColor="#C94B32"
						className="button"
						fontsize={20}
						fontweight={400}
						onClick={() => {
							props.createTransaction();
						}}
						condition={props.isLoading}
					/>
				</div> */}
			</div>
			{props.addNewRecipient && (
				<AddRecipient toggleAddNewRecipient={props.toggleAddNewRecipient} />
			)}
		</>
	);
};

export default TransactionSend;
