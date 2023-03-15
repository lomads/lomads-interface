import React from "react";
import { get as _get } from 'lodash'
import BootstrapTooltip from "./WalkThrough/HelpToolTip";
import "../../../styles/pages/DashBoard/DashBoard.css";
import plus from "../../../assets/svg/plus.svg";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { useNavigate } from "react-router-dom";
import { setDAO } from "state/dashboard/reducer";
import { getDao } from "state/dashboard/actions";

const SideBar = (props: any) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch()
	const { DAOList, DAO } = useAppSelector((state) => state.dashboard);
	const name = props.name ? props.name.split(" ") : _get(DAO, 'name', '');

	const navigateTo = (url: string | undefined) => {
		if (!url) return;
		if (DAO && DAO.url === url) {
			dispatch(getDao(url))
		} else {
			dispatch(setDAO(null))
			navigate(`/${url}`);
		}
	}

	const SideBarStrip = () => {
		return (
			<>
				<div className="sideBarStrip">
					{
						DAOList && DAOList.map(dao => {
							console.log("const daoName", dao)
							const daoName = _get(dao, 'name', '') ? _get(dao, 'name', '').split(" ") : '';
							const daoImage = _get(dao, 'image', null);
							return (
								<>
									<div className="sideBarStripItem">
										<div
											className="stripInvertedBoxOutline"
											onClick={() => {
												navigateTo(dao?.url)
											}}
										>
											{
												daoImage
													?
													<img src={daoImage} />
													:
													<>
														{
															daoName &&
															<div className="navbarText" style={{ color: '#FFF' }}>
																{
																	daoName.length === 1
																		?
																		daoName[0].charAt(0).toUpperCase()
																		:
																		daoName[0].charAt(0).toUpperCase() + daoName[daoName.length - 1].charAt(0).toUpperCase()
																}
															</div>
														}
													</>
											}
										</div>
										<div id="createADAOText">{_get(dao, 'name', '')}</div>
									</div>
								</>
							)
						})
					}
					<div className="sideBarStripItem" style={{ paddingBottom: 32 }}>
						<div
							className="stripInvertedBoxOutline"
							onClick={() => {
								navigate("/createorg");
							}}
						>
							<div className="navbarText">
								<img style={{ transform: 'rotate(0deg)', marginLeft: -1 }} src={plus} alt="add" />
							</div>
						</div>
						<div id="createADAOText">Create</div>
					</div>
				</div>
			</>
		);
	};
	return (
		<>
		<BootstrapTooltip open={props.isHelpIconOpen} 
			placement="right-start"
			title="All your organisations are here">
			<div
				className={`navBarInitialBox ${props.isHelpIconOpen ? 'z-index-1000' : ''}`}
				onMouseEnter={() => {
					props.showSideBar(true);
				}}
			>
				<div className="invertedBox">
					{
						_get(DAO, 'image', null)
							?
							<img src={_get(DAO, 'image', null)} />
							:
							<>
								{name && <div className="navbarText">
									{name.length === 1
										? name[0].charAt(0)
										: name[0].charAt(0) + name[name.length - 1].charAt(0)}
								</div>}
							</>
					}
				</div>
			</div>
			</BootstrapTooltip>
			{props.showNavBar && <SideBarStrip />}
		</>
	);
};

export default SideBar;
