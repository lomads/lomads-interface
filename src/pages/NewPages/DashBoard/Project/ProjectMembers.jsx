import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';

import './ProjectMembers.css';

import { CgClose } from 'react-icons/cg';
import { BsCheck2 } from 'react-icons/bs'
import { useAppSelector, useAppDispatch } from "state/hooks";

import memberIcon from '../../../../assets/svg/memberIcon.svg';
import membersXL from '../../../../assets/svg/membersXL.svg';

import { resetEditProjectMemberLoader } from 'state/dashboard/reducer';
import { editProjectMembers } from "state/dashboard/actions";

import useTerminology from 'hooks/useTerminology';

import SimpleLoadButton from "UIpack/SimpleLoadButton";

const ProjectMembers = ({ toggleEditMember }) => {
    const dispatch = useAppDispatch();
    const { DAO, Project, editProjectMemberLoading } = useAppSelector((state) => state.dashboard);
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    const [updateMembers, setUpdateMembers] = useState(_get(Project, 'members', []).map((_item, _index) => { return _item._id }));

    // useEffect(() => {
    //     if (Project) {
    //         let arr = _get(Project, 'members', []).map((_item, _index) => { return _item._id });
    //         console.log("arr : ", arr)
    //         setUpdateMembers([...arr]);
    //         console.log("update members : ", updateMembers)
    //     }
    // }, [Project])

    // runs after deleting selected members from the project
    useEffect(() => {
        if (editProjectMemberLoading === false) {
            dispatch(resetEditProjectMemberLoader());
            setUpdateMembers([]);
            toggleEditMember();
        }
    }, [editProjectMemberLoading]);

    const handleAddMemberDelete = (userId) => {
        if (updateMembers.includes(userId)) {
            setUpdateMembers(updateMembers.filter((m) => m !== userId));
        }
        else {
            setUpdateMembers([...updateMembers, userId]);
        }
    }

    const handleEditMembers = () => {
        console.log("update memebrs : ", updateMembers);
        dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: updateMembers } }));
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
                        {
                            _get(DAO, 'members', []).map((item, index) => {
                                return (
                                    <div className="member-row" key={index}>
                                        <div className="member-name">
                                            <img src={memberIcon} alt="memberIcon" />
                                            <p>{item.member.name}</p>
                                        </div>
                                        <div className="member-address">
                                            <p>{item.member.wallet.slice(0, 6) + "..." + item.member.wallet.slice(-4)}</p>
                                        </div>
                                        <div className="member-checkbox">
                                            <div className="checkbox" onClick={() => handleAddMemberDelete(item.member._id)}>
                                                {
                                                    // updateMembers.includes(item._id)
                                                    !(updateMembers.some((m) => m === item.member._id) === false)
                                                        ?
                                                        <div className="active-box">
                                                            <BsCheck2 color="#FFF" />
                                                        </div>
                                                        :
                                                        <div className="inactive-box"></div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }

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
                    <SimpleLoadButton
                        condition={editProjectMemberLoading}
                        disabled={editProjectMemberLoading}
                        title="SAVE"
                        bgColor='#C94B32'
                        className="button"
                        fontsize={16}
                        fontweight={400}
                        height={40}
                        width={180}
                        onClick={handleEditMembers}
                    />
                    {/* <button onClick={handleEditMembers}>
                        SAVE
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default ProjectMembers;