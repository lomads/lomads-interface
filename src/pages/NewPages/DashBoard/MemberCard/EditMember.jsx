import { useState, useEffect, useMemo } from 'react';
import './EditMember.css';

import { CgClose } from 'react-icons/cg'
import memberIcon from '../../../../assets/svg/memberIcon.svg';
import SimpleInputField from "UIpack/SimpleInputField";

import binRed from '../../../../assets/svg/bin-red.svg';
import binWhite from '../../../../assets/svg/bin-white.svg';

import { manageDaoMember, updateDaoMember } from 'state/dashboard/actions';
import { resetManageMemberLoader } from 'state/dashboard/reducer';
import { useAppSelector, useAppDispatch } from "state/hooks";
import { updateCurrentUser } from 'state/dashboard/actions';

import { get as _get, find as _find } from 'lodash';
import useRole from 'hooks/useRole';

const EditMember = ({ DAO, toggleShowEditMember, amIAdmin, account }) => {

    const dispatch = useAppDispatch();
    const { manageMemberLoading } = useAppSelector((state) => state.dashboard);
    const [deleteMembers, setDeleteMembers] = useState([]);
    const [updateMembers, setUpdateMembers] = useState([]);
    const [editableName, setEditableName] = useState();

    const { myRole, can } = useRole(DAO, account)

    console.log("MYROLE", myRole)

    useEffect(() => {
        if (manageMemberLoading === false) {
            dispatch(resetManageMemberLoader());
            setDeleteMembers([]);
            setUpdateMembers([]);
            setEditableName('');
            toggleShowEditMember();
        }
    }, [manageMemberLoading]);

    useEffect(() => {
        let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
        setEditableName(user.member.name)
    }, []);

    const handleChangeName = (e) => {
        setEditableName(e.target.value);
    }

    const editableMembers = useMemo(() => {
        let members = []
        if(myRole === 'ADMIN'){
            members = _get(DAO, 'members', []).filter(m => m.role !== 'ADMIN')
        }
        let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
        members.push(user)
        return members
    }, [DAO])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const inputElement = document.getElementById('nameInput');
            inputElement.blur();
            const member = { name: editableName };
            dispatch(updateDaoMember({ url: DAO?.url, payload: member }))
        }
    }

    const handleDeleteMembers = (userId) => {
        if (deleteMembers.includes(userId)) {
            setDeleteMembers(deleteMembers.filter((m) => m !== userId));
        }
        else {
            setDeleteMembers([...deleteMembers, userId]);
        }
    }

    const handleChangeRoles = (userId, role) => {
        let temp = updateMembers;
        const index = temp.map(object => object.id).indexOf(userId);
        if (index === -1) {
            setUpdateMembers([...updateMembers, { id: userId, role }])
        }
        else {
            temp[index] = { id: userId, role }
            setUpdateMembers(temp);
        }
    }

    const handleSubmit = () => {
        if(editableName && editableName.length > 0)
            dispatch(updateCurrentUser({ name: editableName }))
        if (deleteMembers.length > 0 || updateMembers.length > 0) {
            dispatch(manageDaoMember({ url: DAO?.url, payload: { deleteList: deleteMembers, updateList: updateMembers } }));
        }
        else {
            toggleShowEditMember();
        }
    }

    return (
        <div className="editDaoMemberOverlay">
            <div className="editDaoMemberContainer">
                <div className="editDaoMember-header">
                    <p>Manage members</p>
                    <button onClick={() => toggleShowEditMember()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div className="editDaoMember-body">
                    {
                        editableMembers.map((item, index) => (
                            <div className="editDaoMember-row" key={index}>
                                {
                                    deleteMembers.includes(item.member._id)
                                        ?
                                        <div className='row-overcast'></div>
                                        :
                                        null
                                }
                                <div>
                                    <img src={memberIcon} alt="memberIcon" />
                                    {
                                        item.member.wallet.toLowerCase() === account.toLowerCase()
                                            ?
                                            <SimpleInputField
                                                className="inputField"
                                                id="nameInput"
                                                height={50}
                                                width={135}
                                                placeholder="Name"
                                                value={editableName}
                                                onchange={(e) => handleChangeName(e)}
                                                onKeyDown={(e) => handleKeyDown(e)}
                                                autofocus
                                            />
                                            :
                                            <p>{item.member.name}</p>
                                    }
                                </div>
                                <span>{item.member.wallet.slice(0, 6) + "..." + item.member.wallet.slice(-4)}</span>
                                <select
                                    name="chain"
                                    id="chain"
                                    className="tokenDropdown"
                                    onChange={(e) => handleChangeRoles(item._id, e.target.value)}
                                    defaultValue={item.role}
                                    disabled={!amIAdmin || item.role === "ADMIN"}
                                >
                                    { item.role === "ADMIN" && <option selected={item.role === "ADMIN"} value="ADMIN">Admin</option> }
                                    <option selected={item.role === "CORE_CONTRIBUTOR"} value="CORE_CONTRIBUTOR">Core Contributor</option>
                                    <option selected={item.role === "ACTIVE_CONTRIBUTOR"} value="ACTIVE_CONTRIBUTOR">Active Contributor</option>
                                    <option selected={item.role === "CONTRIBUTOR"} value="CONTRIBUTOR">Contributor</option>
                                </select>
                                { can(myRole, 'members.delete') && _get(item, 'member.wallet', '').toLowerCase() !== account?.toLowerCase() ? <button className={deleteMembers.includes(item.member._id) ? 'selected' : null} onClick={() => handleDeleteMembers(item.member._id)}>
                                    {
                                        deleteMembers.includes(item.member._id)
                                            ?
                                            <img src={binWhite} alt="bin-red" />
                                            :
                                            <img src={binRed} alt="bin-red" />
                                    }
                                </button> : <button style={{ backgroundColor: 'grey' }}><img src={binWhite} alt="bin-red" /></button> }
                            </div>
                        ))
                    }
                </div>
                <div className="editDaoMember-footer">
                    <button onClick={() => toggleShowEditMember()}>
                        CANCEL
                    </button>
                    <button onClick={handleSubmit}>
                        SAVE CHANGES
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditMember;