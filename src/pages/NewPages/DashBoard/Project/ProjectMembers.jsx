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
    const [toggle, setToggle] = useState(_get(Project, 'inviteType', '') === 'Open' ? false : true);
    const [selectType, setSelectType] = useState(_get(Project, 'inviteType', ''));

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    // useEffect(() => {
    //     if (Project) {
    //         let arr = _get(Project, 'members', []).map((_item, _index) => { return _item._id });
    //         console.log("arr : ", arr)
    //         setUpdateMembers([...arr]);
    //         console.log("update members : ", updateMembers)
    //     }
    // }, [Project])

    useEffect(() => {
        const rolesArr = _get(DAO, 'terminologies.roles', {});
        const discordOb = _get(DAO, 'discord', {});
        let temp = [];
        if (rolesArr) {
            Object.keys(rolesArr).forEach(function (key, _index) {
                temp.push({ title: key, value: rolesArr[key].label, color: '#d5d5d5' });
            });
        }
        if (discordOb) {
            Object.keys(discordOb).forEach(function (key, _index) {
                const discordChannel = discordOb[key];
                discordChannel.roles.forEach((item) => {
                    if (item.name !== '@everyone' && item.name !== 'LomadsTestBot' && item.name !== 'Lomads' && (temp.some((m) => m.title.toLowerCase() === item.id.toLowerCase()) === false)) {
                        temp.push({ title: item.id, value: item.name, color: item.color ? item.color : '#d5d5d5' });
                    }
                })
            });
        }
        setRoles(temp);
    }, [DAO])

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

    const handleAddRoles = (role) => {
        const roleExists = _find(selectedRoles, m => m.toLowerCase() === role.toLowerCase())
        if (roleExists)
            setSelectedRoles(prev => prev.filter((item) => item.toLowerCase() !== role.toLowerCase()));
        else {
            setSelectedRoles([...selectedRoles, role]);
        }
    }

    const handleEditMembers = () => {

        if (!toggle) {
            console.log("open")
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                arr.push(user.member._id)
            }
            dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: arr, inviteType: 'Open' } }));
        }

        else if (toggle && selectType === 'Invitation') {
            dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: updateMembers, inviteType: 'Invitation' } }));
        }

        if (toggle && selectType === 'Roles') {
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                if (user.discordRoles) {
                    let myDiscordRoles = []
                    Object.keys(user.discordRoles).forEach(function (key, index) {
                        myDiscordRoles = [...myDiscordRoles, ...user.discordRoles[key]]
                    })
                    let index = selectedRoles.findIndex(item => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);

                    if (index > -1) {
                        arr.push(user.member._id)
                    }
                }
                else {
                    if (selectedRoles.includes(user.role)) {
                        arr.push(user.member._id)
                    }
                }
            }
            dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: arr, inviteType: 'Roles' } }));
        }

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
                        <h1>{transformWorkspace().label} Members</h1>
                        <span className="head-text">Invite the best team or set this {transformWorkspace().label} open so anyone can participate.</span>
                        <div className="toggle-box">
                            <label class="switch">
                                <input type="checkbox" onChange={() => { setToggle(!toggle); setSelectType('') }} checked={toggle} />
                                <span class="slider round"></span>
                            </label>
                            <span className="toggle-text">
                                {
                                    toggle
                                        ?
                                        'FILTER BY'
                                        :
                                        'OPEN FOR ALL'
                                }
                            </span>
                        </div>
                        {
                            toggle &&
                            <div className="members-dropdown">
                                <select
                                    name="project"
                                    id="project"
                                    className="tokenDropdown"
                                    style={{ width: '100%', margin: '0' }}
                                    value={selectType}
                                    onChange={(e) => setSelectType(e.target.value)}
                                >
                                    <option value="" selected disabled>Select</option>
                                    <option value={"Invitation"}>Invitation</option>
                                    <option value={"Roles"}>Roles</option>
                                </select>
                            </div>
                        }
                        {
                            toggle && selectType === 'Invitation'
                            &&
                            <>
                                <div className="divider"></div>
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
                            </>
                        }

                        {
                            toggle && selectType === 'Roles' && roles.length > 0
                            &&
                            <div className='project-members'>
                                <div className="member-list">
                                    {
                                        roles.map((item, index) => {
                                            return (
                                                <>
                                                    <div className='roles-li' key={index}>
                                                        <div
                                                            className='roles-pill'
                                                            style={{ backgroundColor: `${item.color}50` }}
                                                        >
                                                            <div
                                                                className='roles-circle'
                                                                style={{ background: `${item.color}` }}
                                                            ></div>
                                                            <span>{item.value}</span>
                                                        </div>
                                                        {
                                                            !(selectedRoles.some((m) => m.toLowerCase() === item.title.toLowerCase()) === false)
                                                                ?
                                                                <input type="checkbox" onChange={() => handleAddRoles(item.title)} checked />
                                                                :
                                                                <input type="checkbox" onChange={() => handleAddRoles(item.title)} />
                                                        }
                                                    </div>
                                                </>

                                            )
                                        })
                                    }
                                </div>
                            </div>
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