import React, { useState } from "react";
import { get as _get } from 'lodash'
import "../../../styles/pages/DashBoard/DashBoard.css";
import plus from "../../../assets/svg/plus.svg";
import { useAppSelector } from "state/hooks";
import { useNavigate } from "react-router-dom";

const SideBar = (props: any) => {
	const navigate = useNavigate();
	const { DAOList } = useAppSelector((state) => state.dashboard);
	const name = props.name.split(" ");
	const SideBarStrip = () => {
		return (
			<>
				<div className="sideBarStrip">
					{
						DAOList.map(dao => {
							const daoName = _get(dao, 'name', '').split(" ");
							return (
								<div className="sideBarStripItem">
									<div
										className="stripInvertedBoxOutline"
										onClick={() => {
											navigate(`/${dao.url}`);
										}}
									>
										<div className="navbarText" style={{ color: '#FFF' }}>
											{daoName.length === 1
												? daoName[0].charAt(0)
												: daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}
										</div>
									</div>
									<div id="createADAOText">{_get(dao, 'name', '')}</div>
								</div>
							)
						})
					}
					<div className="sideBarStripItem">
						<div
							className="stripInvertedBoxOutline"
							onClick={() => {
								navigate("/namedao");
							}}
						>
							<div className="navbarText">
								<img src={plus} alt="add" />
							</div>
						</div>
						<div id="createADAOText">Create a DAO</div>
					</div>
				</div>
			</>
		);
	};
	return (
		<>
			<div
				className="navBarInitialBox"
				onMouseEnter={() => {
					props.showSideBar(true);
				}}
			>
				<div className="invertedBox">
					<div className="navbarText">
						{name.length === 1
							? name[0].charAt(0)
							: name[0].charAt(0) + name[name.length - 1].charAt(0)}
					</div>
				</div>
			</div>
			{props.showNavBar && <SideBarStrip />}
		</>
	);
};

export default SideBar;
