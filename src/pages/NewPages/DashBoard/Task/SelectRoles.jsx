import { useState } from 'react';
import './SelectRoles.css';

const options = ['Admin', 'Active Contributor', 'Core Contributor', 'Contributor'];

const SelectRoles = ({ toggleSelect, validRoles, handleValidRoles }) => {
    const [roles, setRoles] = useState(validRoles);

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
                options.map((item, index) => {
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
                                <span>{item}</span>
                            </div>
                            {
                                roles.includes(item)
                                    ?
                                    <input type="checkbox" onChange={() => handleRole(item)} checked />
                                    :
                                    <input type="checkbox" onChange={() => handleRole(item)} />
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