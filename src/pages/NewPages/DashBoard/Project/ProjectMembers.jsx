import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';

import './ProjectMembers.css';

import { CgClose } from 'react-icons/cg';
import { useAppSelector, useAppDispatch } from "state/hooks";

import memberIcon from '../../../../assets/svg/memberIcon.svg';
import membersXL from '../../../../assets/svg/membersXL.svg';

import { resetUpdateProjectMemberLoader, resetDeleteProjectMemberLoader, } from 'state/dashboard/reducer';
import { updateProjectMember, deleteProjectMember } from "state/dashboard/actions";

import useTerminology from 'hooks/useTerminology';

const ProjectMembers = ({ toggleEditMember }) => {
    const dispatch = useAppDispatch();
    const { DAO, Project, updateProjectMemberLoading, deleteProjectMemberLoading } = useAppSelector((state) => state.dashboard);
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    const [deleteMembers, setDeleteMembers] = useState([]);

    // runs after deleting selected members from the project
    useEffect(() => {
        if (deleteProjectMemberLoading === false) {
            dispatch(resetDeleteProjectMemberLoader());
            setDeleteMembers([]);
            // setEditMember(false);
        }
    }, [deleteProjectMemberLoading]);

    const handleAddMemberDelete = (userId) => {
        if (deleteMembers.includes(userId)) {
            setDeleteMembers(deleteMembers.filter((m) => m !== userId));
        }
        else {
            setDeleteMembers([...deleteMembers, userId]);
        }
    }

    const handleDeleteMembers = () => {
        // dispatch(deleteProjectMember({ projectId, payload: { daoId: _get(DAO, '_id', null), memberList: deleteMembers } }));
    }

    return (
        <div className="editMemberOverlay">
            <div className="editMemberContainer">
                <div className="editMember-header">
                    <button onClick={() => toggleEditMember()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                    <div className="editMember-body">
                        <img src={membersXL} alt="frame-icon" />
                        <h1>Project Members</h1>
                        <span>Invite the best team or set this workspace open so anyone can participate.</span>

                        {/* {
                        _uniqBy(Project?.members, '_id').map((item, index) => (
                            <div onClick={() => handleAddMemberDelete(item._id)} className="editMember-row" key={index}>
                                <div>
                                    <img src={memberIcon} alt="memberIcon" />
                                    <p>{item.name}</p>
                                </div>
                                <span>{item.wallet.slice(0, 6) + "..." + item.wallet.slice(-4)}</span>
                                <input
                                    type='checkbox'
                                    onChange={() => handleAddMemberDelete(item._id)}
                                    checked={!(deleteMembers.some((m) => m === item._id) === false)}
                                />
                            </div>
                        ))
                    } */}
                    </div>
                </div>
                <div className="editMember-footer">
                    <button onClick={() => toggleEditMember()} style={{ marginRight: '20px' }}>
                        CANCEL
                    </button>
                    <button onClick={handleDeleteMembers}>
                        SAVE
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProjectMembers;