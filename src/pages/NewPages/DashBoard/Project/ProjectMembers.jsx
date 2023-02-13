import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';

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
import { DEFAULT_ROLES } from "constants/terminology";

const ProjectMembers = ({ toggleEditMember }) => {
    const dispatch = useAppDispatch();
    const { DAO, Project, editProjectMemberLoading } = useAppSelector((state) => state.dashboard);
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    const [updateMembers, setUpdateMembers] = useState(_get(Project, 'members', []).map((_item, _index) => { return _item._id }));
    const [toggle, setToggle] = useState(_get(Project, 'inviteType', '') === 'Open' ? false : true);
    const [selectType, setSelectType] = useState(_get(Project, 'inviteType', ''));

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState(_get(Project, 'validRoles', []));

    // useEffect(() => {
    //     if (Project) {
    //         let arr = _get(Project, 'members', []).map((_item, _index) => { return _item._id });
    //         console.log("arr : ", arr)
    //         setUpdateMembers([...arr]);
    //         console.log("update members : ", updateMembers)
    //     }
    // }, [Project])

    useEffect(() => {
        const rolesArr = _get(DAO, 'terminologies.roles', DEFAULT_ROLES);
        const discordOb = _get(DAO, 'discord', {});
        let temp = [];
        if (rolesArr) {
            Object.keys(rolesArr).forEach(function (key, _index) {
                temp.push({ lastRole: _index === 3, title: key, value: rolesArr[key].label, 
                    roleColor: _index == 0 ? '#92e1a8' :
                    _index == 1 ? '#89b3e5' :
                    _index == 2 ? '#e96447' : '#92e1a8'
                });
            });
        }
        if (discordOb) {
            Object.keys(discordOb).forEach(function (key, _index) {
                const discordChannel = discordOb[key];
                discordChannel.roles.forEach((item) => {
                    if (item.name !== '@everyone' && item.name !== 'LomadsTestBot' && item.name !== 'Lomads' && (temp.some((m) => m.title.toLowerCase() === item.id.toLowerCase()) === false)) {
                        temp.push({ title: item.id, value: item.name, roleColor: item?.roleColor });
                    }
                })
            });
        }
        setRoles(temp);
    }, [DAO])

    const all_roles = useMemo(() => {
        let roles = [];
        Object.keys(_get(DAO, 'discord', {})).map((server) => {
            const r = DAO.discord[server].roles
            roles = roles.concat(r);
        })
        return roles.filter(r => r.name !== "@everyone" && r.name !== 'Lomads' && r.name !== 'LomadsTestBot');
    }, [DAO.discord])

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
            dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: arr, inviteType: 'Open', validRoles: [] } }));
        }

        else if (toggle && selectType === 'Invitation') {
            dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: updateMembers, inviteType: 'Invitation', validRoles: [] } }));
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
            dispatch(editProjectMembers({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: arr, inviteType: 'Roles', validRoles: selectedRoles } }));
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
                                    _sortBy(_get(DAO, 'members', []), m => _get(m, 'member.name', '').toLowerCase(), 'asc').map((item, index) => {
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
                            toggle && selectType === 'Roles'
                            &&
                            <>
                                <div className='project-members'>
                                    <h1>Organisation Roles</h1>
                                    <div className="member-list">
                                        {
                                            Object.keys(_get(DAO, 'terminologies.roles', {})).map((key, index) => {
                                                return (
                                                    <div className='roles-li'>
                                                        <div
                                                            className='roles-pill'
                                                            style={{ backgroundColor: '#d5d5d550' }}
                                                        >
                                                            <div
                                                                className='roles-circle'
                                                                style={{ backgroundColor: '#d5d5d5' }}
                                                            ></div>
                                                            <span>{_get(transformRole(key), 'label')}</span>
                                                        </div>
                                                        <div className='checkbox' onClick={() => handleAddRoles(key)}>
                                                            {
                                                                !(selectedRoles.some((m) => m.toLowerCase() === key.toLowerCase()) === false)
                                                                    ?
                                                                    <div className="active-box">
                                                                        <BsCheck2 color="#FFF" />
                                                                    </div>
                                                                    :
                                                                    <div className="inactive-box"></div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                {
                                    all_roles && all_roles.length > 0
                                        ?
                                        <div className='project-members' style={{ marginBottom: '100px' }}>
                                            <h1>Discord Roles</h1>
                                            <div className="member-list">
                                                {
                                                    all_roles.map((discord_value, index) => {
                                                        return (
                                                            <div className='roles-li'>
                                                                <div
                                                                    className='roles-pill'
                                                                    style={discord_value.color ? { background: `${discord_value.color}50` } : { background: `#d5d5d550` }}
                                                                >
                                                                    <div
                                                                        className='roles-circle'
                                                                        style={discord_value.color ? { background: `${discord_value.color}` } : { background: `#d5d5d5` }}
                                                                    ></div>
                                                                    <span>{discord_value.name}</span>
                                                                </div>
                                                                <div className='checkbox' onClick={() => handleAddRoles(discord_value.id)}>
                                                                    {
                                                                        !(selectedRoles.some((m) => m.toLowerCase() === discord_value.id.toLowerCase()) === false)
                                                                            ?
                                                                            <div className="active-box">
                                                                                <BsCheck2 color="#FFF" />
                                                                            </div>
                                                                            :
                                                                            <div className="inactive-box"></div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </>
                        }


                        {/* 
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
                                                            style={{ backgroundColor: `${_get(item, 'roleColor', '#99aab5')}50` }}
                                                        >
                                                            <div
                                                                className='roles-circle'
                                                                style={{ background: `${_get(item, 'roleColor', '#99aab5')}` }}
                                                            ></div>
                                                            <span>{item.value}</span>
                                                        </div>
                                                        <div className='checkbox' onClick={() => handleAddRoles(item.title)}>
                                                            {
                                                                !(selectedRoles.some((m) => m.toLowerCase() === item.title.toLowerCase()) === false)
                                                                    ?
                                                                    <div className="active-box">
                                                                        <BsCheck2 color="#FFF" />
                                                                    </div>
                                                                    :
                                                                    <div className="inactive-box"></div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        item.lastRole && <div style={{ marginLeft: 30, marginTop: 10, marginBottom: 30, width: 230, backgroundColor: '#C94B32', height: 3 }}></div>
                                                    }
                                                </>

                                            )
                                        })
                                    }
                                </div>
                            </div>
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