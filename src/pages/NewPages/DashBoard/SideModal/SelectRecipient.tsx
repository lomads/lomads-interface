import { Checkbox } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import SimpleButton from "UIpack/SimpleButton";
import daoMember2 from "../../../../assets/svg/daoMember2.svg";
import SafeButton from "UIpack/SafeButton";
import OutlineButton from "UIpack/OutlineButton";
import { InviteGangType } from "types/UItype";
import { IselectRecipientType, IsetRecipientType } from "types/DashBoardType";
import AddRecipient from "./AddRecipient";

const SelectRecipient = (props: IselectRecipientType) => {
	{ console.log(props.totalMembers) }
	const [selectedRecipientCount, setSelectedRecipientCount] =
		useState<number>(0);
	const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		if (checked) {
			const index = props.totalMembers.findIndex(
				(result: InviteGangType) => result.address === event.target.value
			);
			const newData: InviteGangType = props.totalMembers[index];

			props.selectedRecipients.current.push(newData);
		} else {
			const refIndex = props.selectedRecipients.current.findIndex(
				(result: InviteGangType) => result.address === event.target.value
			);
			console.log(props.selectedRecipients.current[refIndex]);
			props.selectedRecipients.current.splice(refIndex, 1);
		}
	};

	useEffect(() => {
		console.log(props.selectedRecipients)
	}, [])

	const handleSetRecipient = () => {
		props.selectedRecipients.current.forEach(
			(result: InviteGangType, index: number) => {
				const obj: IsetRecipientType = {
					amount: "",
					name: "",
					recipient: "",
					reason: "",
				};
				obj["name"] = result.name;
				obj["recipient"] = result.address;
				props.setRecipient.current.push(obj);
			}
		);
		let length = props.selectedRecipients.current.length;
		props.selectedRecipients.current.splice(0, length);
		props.showNavigation(false, false, true);
	};

	const managePreviousNavigation = () => {
		const length = props.selectedRecipients.current.length;
		props.selectedRecipients.current.splice(0, length);
		props.showNavigation(false, false, false);
	};
	return (
		<>
			<div className="SelectNewRecipientPage">
				<div id="SelectRecipientsHeader">
					<div className="dashboardTextBold">Select recipients</div>
					<div>
						<SafeButton
							bgColor="#FFFFFF"
							disabled={false}
							title="ADD NEW RECIPIENT"
							titleColor="#76808D"
							fontsize={16}
							fontweight={400}
							height={40}
							width={209}
							onClick={props.toggleAddNewRecipient}
						/>
					</div>
				</div>
				{props.totalMembers &&
					props.totalMembers.map((result: any, index: any) => {
						return (
							<div className="selectRecipient">
								<div className="avatarName">
									<img src={daoMember2} alt={result.address} />
									<p className="nameText">{result.name}</p>
								</div>
								<p className="addressText">
									{result.address.slice(0, 6) +
										"..." +
										result.address.slice(-4)}
								</p>
								<Checkbox
									size="lg"
									colorScheme="orange"
									name="owner"
									defaultChecked={false}
									disabled={false}
									value={result.address}
									onChange={(event) => {
										handleCheck(event);
									}}
								/>
							</div>
						);
					})}
				<div id="recipientButtonArea">
					<OutlineButton
						title="CANCEL"
						borderColor="#C94B32"
						bgColor="#FFFFFF"
						height={40}
						width={129}
						fontsize={16}
						fontweight={400}
						onClick={() => {
							managePreviousNavigation();
						}}
					/>
					<SimpleButton
						title="NEXT"
						bgColor={"#C94B32"}
						className="button"
						height={40}
						width={184}
						fontsize={16}
						onClick={() => {
							handleSetRecipient();
						}}
					/>
				</div>
			</div>
			{props.addNewRecipient && (
				<AddRecipient
					toggleAddNewRecipient={props.toggleAddNewRecipient}
					isTransactionSendPage={false}
				/>
			)}
		</>
	);
};

export default SelectRecipient;
