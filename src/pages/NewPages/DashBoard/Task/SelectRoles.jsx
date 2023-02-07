import { useState } from 'react';
import { get as _get } from 'lodash'
import './SelectRoles.css';
import { useAppSelector } from "state/hooks";
import useTerminology from 'hooks/useTerminology'
import { DEFAULT_ROLES } from "constants/terminology";

const SelectRoles = ({ toggleSelect, validRoles, handleValidRoles }) => {
    const [roles, setRoles] = useState(validRoles);
	const { DAO } = useAppSelector((state) => state.dashboard);
    const { transformRole } = useTerminology(_get(DAO, 'terminologies'))
    const handleRole = (role) => {
        if (roles.includes(role)) {
            setRoles(roles.filter((i) => i !== role))
        }
        else {
            setRoles([...roles, role]);
        }
    }
    return (
        <div className="selectRoles-container">
            <div className='selectRoles-header'>
                <span>Select Roles</span>
            </div>

            {
                Object.keys(_get(DAO, 'terminologies.roles', DEFAULT_ROLES)).map((key, index) => {
                    return (
                        <div className='roles-li'>
                            <div
                                className='roles-pill'
                                style={index === 0 ? { background: 'rgba(146, 225, 168, 0.3)' } : index === 1 ? { background: 'rgba(137,179,229,0.3)' } : index === 2 ? { background: 'rgba(234,100,71,0.3)' } : { background: 'rgba(146, 225, 168, 0.3)' }}
                            >
                                <div
                                    className='roles-circle'
                                    style={index === 0 ? { background: 'rgba(146, 225, 168, 1)' } : index === 1 ? { background: 'rgba(137,179,229,1)' } : index === 2 ? { background: 'rgba(234,100,71,1)' } : { background: 'rgba(146, 225, 168, 1)' }}
                                ></div>
                                <span>{ _get(transformRole(key), 'label') }</span>
                            </div>
                            {
                                roles.includes(key)
                                    ?
                                    <input type="checkbox" onChange={() => handleRole(key)} checked />
                                    :
                                    <input type="checkbox" onChange={() => handleRole(key)} />
                            }
                        </div>
                    )
                })
            }

            <div className='selectRoles-footer'>
                <button onClick={toggleSelect}>
                    CANCEL
                </button>
                <button onClick={() => { handleValidRoles(roles); toggleSelect() }}>
                    SELECT
                </button>
            </div>
        </div>
    )
}

export default SelectRoles;