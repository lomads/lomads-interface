import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./TerminologyModal.css";
import OD from "../../assets/images/drawer-icons/Frameterminology.svg";
import editIcon from 'assets/svg/editButton.svg';

import { useAppSelector, useAppDispatch } from "state/hooks";

import { updateDao } from 'state/dashboard/actions';
import { resetUpdateDAOLoader } from 'state/dashboard/reducer';

import SimpleLoadButton from "UIpack/SimpleLoadButton";

const TerminologyModal = ({ toggleModal, toggleTerminology }) => {

	const dispatch = useAppDispatch();
	const { DAO, updateDaoLoading } = useAppSelector((state) => state.dashboard);

	const [showEdit, setShowEdit] = useState(false);

	const [ob, setOb] = useState(_get(DAO, 'terminologies', null));

	useEffect(() => {
		if (updateDaoLoading === false) {
			dispatch(resetUpdateDAOLoader());
			setShowEdit(false);
		}
	}, [updateDaoLoading]);

	const handleChange = (e) => {
		let tempOb = { ...ob };
		tempOb[e.target.id] = e.target.value;
		setOb(tempOb);
	}

	const handleSubmit = () => {
		const terminologies = ob;
		dispatch(updateDao({ url: _get(DAO, 'url', ''), payload: { terminologies } }));
	}

	return (
		<div className="sidebarModal">
			<div
				onClick={() => {
					toggleTerminology();
				}}
				style={{ opacity: '1', background: 'rgba(27, 43, 65, 0.25)' }}
				className="overlay"
			>
				<div className="terminology-container">
					<div
						className="terminology-modal"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<div className='terminology-header'>
							<button style={{ marginRight: '22px' }} onClick={() => setShowEdit(true)}>
								<img src={editIcon} alt="editIcon" />
							</button>
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
								onClick={toggleTerminology}
							/>
						</div>

						<div className="terminology-body">
							<img src={OD} alt="frame-icon" />
							<h1>Terminologies</h1>

							{!showEdit && <p>Labels used in all your organisation’s interface.</p>}

							{
								!showEdit
									?
									<>
										<div className="section" style={{ width: '320px' }}>
											<h1>Projects : <span>{ob.Projects}</span></h1>
											<h1>Tasks : <span>{ob.Tasks}</span></h1>
										</div>
										<div className="divider"></div>
										<div className="section" style={{ width: '320px' }}>
											<h1>Admin : <span>{ob.Admin}</span></h1>
											<h1>Core Contributor : <span>{ob["Core Contributor"]}</span></h1>
											<h1>Active Contributor : <span>{ob["Active Contributor"]}</span></h1>
											<h1>Contributor : <span>{ob.Contributor}</span></h1>
										</div>
									</>
									:
									<>
										<div className="section" style={{ width: '375px' }}>
											<div style={{ marginBottom: '15px' }}>
												<h1>Projects</h1>
												<select
													name="project"
													className="tokenDropdown"
													id="Projects"
													style={{ width: '200px', margin: '0' }}
													onChange={handleChange}
												>
													<option value={'Projects'} selected={ob.Projects === 'Projects'}>Projects</option>
													<option value={'Pods'} selected={ob.Projects === 'Pods'}>Pods</option>
													<option value={'Departments'} selected={ob.Projects === 'Departments'}>Departments</option>
													<option value={'Functions'} selected={ob.Projects === 'Functions'}>Functions</option>
													<option value={'Guilds'} selected={ob.Projects === 'Guilds'}>Guilds</option>
												</select>
											</div>
											<div>
												<h1>Tasks</h1>
												<select
													name="project"
													id="Tasks"
													className="tokenDropdown"
													style={{ width: '200px', margin: '0' }}
													onChange={handleChange}
												>
													<option value={'Tasks'} selected={ob.Tasks === 'Tasks'}>Tasks</option>
													<option value={'Bounties'} selected={ob.Tasks === 'Bounties'}>Bounties</option>
												</select>
											</div>
										</div>
										<div className="divider"></div>
										<div className="section" style={{ width: '375px' }}>
											<div style={{ marginBottom: '15px' }}>
												<h1>Admin</h1>
												<input type={"text"} id={"Admin"} value={ob.Admin} onChange={handleChange} />
											</div>

											<div style={{ marginBottom: '15px' }}>
												<h1>Core Contributor</h1>
												<input type={"text"} id={"Core Contributor"} value={ob["Core Contributor"]} onChange={handleChange} />
											</div>

											<div style={{ marginBottom: '15px' }}>
												<h1>Active Contributor</h1>
												<input type={"text"} id={"Active Contributor"} value={ob["Active Contributor"]} onChange={handleChange} />
											</div>

											<div style={{ marginBottom: '15px' }}>
												<h1>Contributor</h1>
												<input type={"text"} id={"Contributor"} value={ob.Contributor} onChange={handleChange} />
											</div>
										</div>
									</>
							}

							{showEdit &&
								<div className="section-footer">
									<button onClick={() => setShowEdit(false)}>
										CANCEL
									</button>
									<SimpleLoadButton
										title="SAVE CHANGES"
										height={40}
										width={185}
										fontsize={16}
										fontweight={400}
										onClick={handleSubmit}
										bgColor={"#C94B32"}
										condition={updateDaoLoading}
									/>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TerminologyModal;
