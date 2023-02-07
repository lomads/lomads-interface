import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import './ProjectEdit.css';
import { CgClose } from 'react-icons/cg'
import settingSvg from '../../../../assets/svg/settingXL.svg';
import editTokenvg from '../../../../assets/svg/editToken.svg';

import { HiOutlinePlus } from "react-icons/hi";

import { useAppSelector, useAppDispatch } from "state/hooks";

const ProjectEdit = ({ toggleShowEdit, toggleDeletePrompt, toggleClosePrompt, toggleWorkspaceInfo, toggleProjectMembers, toggleProjectMilestone, toggleProjectKRA, toggleProjectResources }) => {

    const { DAO, Project } = useAppSelector((state) => state.dashboard);

    return (
        <div className="ProjectEditOverlay">
            <div className="ProjectEditContainer">
                <div className='ProjectEdit-header'>
                    <button onClick={() => toggleShowEdit()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>

                    <div className='ProjectEdit-body'>
                        <img src={settingSvg} alt="frame-icon" />
                        <h1>Workspace settings</h1>

                        <div className='edit-card'>
                            <h1>Workspace infos</h1>
                            <button onClick={() => toggleWorkspaceInfo(true)}>
                                <img src={editTokenvg} alt="editToken" />
                            </button>
                        </div>
                        <div className='edit-card'>
                            <h1>Project members</h1>
                            <button onClick={() => toggleProjectMembers(true)}>
                                <img src={editTokenvg} alt="editToken" />
                            </button>
                        </div>
                        <div className='edit-card'>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1>Project resources</h1>
                                <span>Add links for your team to access</span>
                            </div>
                            {
                                _get(Project, 'links', []).length === 0
                                    ?
                                    <button className='add-btn' onClick={() => toggleProjectResources(true)}>
                                        <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                        ADD
                                    </button>
                                    :
                                    <button onClick={() => toggleProjectResources(true)}>
                                        <img src={editTokenvg} alt="editToken" />
                                    </button>
                            }
                        </div>
                        <div className='edit-card'>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1>Milestones</h1>
                                <span>Organise and link payments to milestones</span>
                            </div>
                            {
                                _get(Project, 'milestones', []).length === 0
                                    ?
                                    <button className='add-btn' onClick={() => toggleProjectMilestone(true)}>
                                        <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                        ADD
                                    </button>
                                    :
                                    <button onClick={() => toggleProjectMilestone(true)}>
                                        <img src={editTokenvg} alt="editToken" />
                                    </button>
                            }
                        </div>
                        <div className='edit-card'>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1>Key results</h1>
                                <span>Set objective for your team</span>
                            </div>
                            {
                                _get(Project, 'kra.results', []).length === 0
                                    ?
                                    <button className='add-btn' onClick={() => toggleProjectKRA(true)}>
                                        <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                        ADD
                                    </button>
                                    :
                                    <button onClick={() => toggleProjectKRA(true)}>
                                        <img src={editTokenvg} alt="editToken" />
                                    </button>
                            }
                        </div>
                        <div className='delete-card'>
                            <h1>Delete workspace</h1>
                            <span>The project will not appear in archives</span>
                            <button onClick={() => toggleDeletePrompt(true)}>DELETE WORKSAPCE</button>
                        </div>
                    </div>

                    <div className='ProjectEdit-footer'>
                        <button onClick={() => toggleClosePrompt(true)}>
                            CLOSE PROJECT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectEdit;