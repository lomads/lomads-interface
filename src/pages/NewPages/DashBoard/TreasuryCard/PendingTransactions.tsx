import React, { useState } from "react";
import sendTokenOutline from "../../../../assets/svg/sendTokenOutline.svg";
import SimpleInputField from "UIpack/SimpleInputField";
import IconButton from "UIpack/IconButton";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import SimpleButton from "UIpack/SimpleButton";
import { useAppSelector } from "state/hooks";

const PendingTransactions = (props: any) => {
	console.log("10 txs : ", props.txs);
	const safeThreshold = useAppSelector((state) => state.flow.safeThreshold);
	const handleChange = () => {
		console.log(props.tokens);
	};
	return (
		<>
			<div className="transactionRow">
				<div className="coinText">
					<img src={sendTokenOutline} alt="" />

					<div className="dashboardTextBold">
						{props.amount === "multisend" || props.amount === "rejection"
							? props.amount === "multisend"
								? "Multisend"
								: "rejection"
							: props.amount / 10 ** 18}{" "}
						{props.tokens !== undefined &&
							props.tokens.map((result: any, index: any) => {
								return (
									props.tokenAddress === result.tokenAddress &&
									result.token.symbol
								);
							})}
					</div>
				</div>
				<div className="transactionName">
					<SimpleInputField
						className="inputField"
						height={30}
						width={"100%"}
						placeholder="Name Transaction"
						onchange={(e) => {
							handleChange();
						}}
					/>
				</div>
				<div className="transactionAddress">
					<div className="dashboardText">
						to{" "}
						{props.recipient === "multisend"
							? "Multisend"
							: props.recipient.slice(0, 6) + "..." + props.recipient.slice(-4)}
					</div>
				</div>
				<div id="voteArea">
					<div className="dashboardTextBold">
						{props.confirmations + "/" + props.ownerCount} vote
					</div>
				</div>
				{props.isAddressValid && (
					<div className="confirmIconGrp">
						{props.confirmations === safeThreshold &&
							props.multiIndex &&
							props.multiIndex !== 0 ? null : (
							<>
								<SimpleButton
									width={"100%"}
									height={30}
									title="EXECUTE"
									bgColor={"#C94B32"}
									className="button"
									onClick={(e) => {
										if (props.confirmations === safeThreshold) {
											props.executeTransactions(props.txs);
										}
									}}
								/>
							</>
						)}
						{!props.showExecute &&
							props.confirmations !== safeThreshold &&
							props.isOwner && (
								<>
									{props.amount !== "rejection" && (
										<>
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
												bgColor="#FFFFFF"
												height={30}
												width={30}
												border="2px solid #C94B32"
												className="iconButtons"
												onClick={(e: any) => {
													props.rejectTransaction(props.txs.nonce);
												}}
											/>
										</>
									)}
									<IconButton
										Icon={
											<AiOutlineCheck
												style={{
													color: "#FFFFFF",
													height: "16px",
													width: "16px",
												}}
											/>
										}
										bgColor="#C94B32"
										height={30}
										width={30}
										border="2px solid #C94B32"
										className="iconButtons"
										onClick={(e) => {
											props.confirmTransaction(props.safeTxHash);
										}}
									/>
								</>
							)}
					</div>
				)}
			</div>
		</>
	);
};

export default PendingTransactions;
