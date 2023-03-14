import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./TerminologyModal.css";
import OD from "../../assets/images/drawer-icons/Frameterminology.svg";
import editIcon from 'assets/svg/editButton.svg';
import { useAppSelector, useAppDispatch } from "state/hooks";
import { updateDao } from 'state/dashboard/actions';
import { resetUpdateDAOLoader, setTask } from 'state/dashboard/reducer';
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { TASK_OPTIONS, WORKSPACE_OPTIONS, DEFAULT_ROLES } from '../../constants/terminology';


const TerminologyModal = ({ toggleTerminology }) => {

	const dispatch = useAppDispatch();
	const { DAO, updateDaoLoading } = useAppSelector((state) => state.dashboard);
	const [showEdit, setShowEdit] = useState(false);

	const [workspaceTerminology, setWorkspaceTerminology] = useState('WORKSPACE')
	const [taskTerminology, setTaskTerminology] = useState('TASK')
	const [roles, setRoles] = useState(DEFAULT_ROLES)

	useEffect(() => {
		if (updateDaoLoading === false) {
			dispatch(resetUpdateDAOLoader());
			setShowEdit(false);
		}
	}, [updateDaoLoading]);

	useEffect(() => {
		if (DAO?.terminologies) {
			setWorkspaceTerminology(_get(DAO, 'terminologies.workspace.value'))
			setTaskTerminology(_get(DAO, 'terminologies.task.value'))
			setRoles(_get(DAO, 'terminologies.roles'))
		}
	}, [DAO?.terminologies])

	const handleChange = (e) => {
		setRoles(prev => {
			return {
				...prev,
				[e.target.name]: {
					...prev[e.target.name],
					label: e.target.value && e.target.value !== '' ? e.target.value : ''
				}
			}
		})
	}

	const handleSubmit = () => {
		let r = {}
		Object.keys(roles).map(key => {
			const role = roles[key]
			const rv = {
				...role,
				label: role.label && role.label !== '' ? (role.label).trim().replace(/ +(?= )/g, '') : DEFAULT_ROLES[key].label,
				value: role.label && role.label !== '' ? (role.label).trim().toUpperCase().split(' ').join('_').replace(/ +(?= )/g, '').replace(/[^a-zA-Z0-9_]/g, '') : DEFAULT_ROLES[key].value
			}
			r[key] = rv
		})
		const terminologies = {
			workspace: _find(WORKSPACE_OPTIONS, wo => wo.value === workspaceTerminology),
			task: _find(TASK_OPTIONS, to => to.value === taskTerminology),
			roles: r
		}
		//console.log("terminologies", terminologies)
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
							{/* <button style={{ marginRight: '22px' }} onClick={() => setShowEdit(true)}>
								<img src={editIcon} alt="editIcon" />
							</button> */}
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

							{!showEdit && <p>Make it yours. Customize the terminology for<br /> everything in your organization's space.</p>}

							{
								!showEdit
									?
									<>
										<div className="section" style={{ width: '320px' }}>
											<h1>Workspaces : <span>{_find(WORKSPACE_OPTIONS, wo => wo.value === workspaceTerminology)?.labelPlural}</span></h1>
											<h1>Tasks : <span>{_find(TASK_OPTIONS, wo => wo.value === taskTerminology)?.labelPlural}</span></h1>
										</div>
										<div className="divider"></div>
										<div className="section" style={{ width: '320px' }}>
											{
												Object.keys(roles).map(key => {
													return (
														<h1>{key} : <span>{_get(roles, `${key}.label`)}</span></h1>
													)
												})
											}
										</div>
									</>
									:
									<>
										<div className="section" style={{ width: '375px' }}>
											<div style={{ marginBottom: '15px' }}>
												<h1>Workspaces</h1>
												<select
													name="workspace"
													className="tokenDropdown"
													id="workspace"
													value={workspaceTerminology}
													style={{ width: '200px', margin: '0' }}
													onChange={e => setWorkspaceTerminology(e.target.value)}
												>
													{
														WORKSPACE_OPTIONS.map(option => {
															return <option key={option.value} value={option.value}>{option.labelPlural}</option>
														})
													}
												</select>
											</div>
											<div>
												<h1>Tasks</h1>
												<select
													name="task"
													id="Tasks"
													className="tokenDropdown"
													value={taskTerminology}
													style={{ width: '200px', margin: '0' }}
													onChange={e => setTaskTerminology(e.target.value)}
												>
													{
														TASK_OPTIONS.map(option => {
															return <option key={option.value} value={option.value}>{option.labelPlural}</option>
														})
													}
												</select>
											</div>
										</div>
										<div className="divider"></div>
										<div className="section" style={{ width: '375px' }}>
											<div style={{ marginBottom: '15px' }}>
												<h1>Role 1</h1>
												<input type="text" name="role1" value={_get(roles, 'role1.label')} onChange={handleChange} />
											</div>

											<div style={{ marginBottom: '15px' }}>
												<h1>Role 2</h1>
												<input type="text" name="role2" value={_get(roles, 'role2.label')} onChange={handleChange} />
											</div>

											<div style={{ marginBottom: '15px' }}>
												<h1>Role 3</h1>
												<input type="text" name="role3" value={_get(roles, 'role3.label')} onChange={handleChange} />
											</div>

											<div style={{ marginBottom: '15px' }}>
												<h1>Role 4</h1>
												<input type="text" name="role4" value={_get(roles, 'role4.label')} onChange={handleChange} />
											</div>
										</div>
									</>
							}

							{showEdit
								?
								<div className="section-footer">
									<button onClick={() => setShowEdit(false)} className="edit-btn">
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
								:
								<div className="section-footer">
									<button onClick={() => setShowEdit(true)} className="edit-btn">
										EDIT
									</button>
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
