import { useMemo, useState } from 'react';
import { get as _get } from 'lodash'
import './SelectRoles.css';
import { useAppSelector } from "state/hooks";
import useTerminology from 'hooks/useTerminology'
import { DEFAULT_ROLES } from "constants/terminology";
import { BsCheck2 } from "react-icons/bs";

const SelectRoles = ({ toggleSelect, validRoles, handleValidRoles }) => {
    const [roles, setRoles] = useState(validRoles);
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { transformRole } = useTerminology(_get(DAO, 'terminologies', undefined));

    const handleRole = (role) => {
        console.log("role : ", role)
        if (roles.includes(role)) {
            setRoles(roles.filter((i) => i !== role))
        }
        else {
            setRoles([...roles, role]);
            console.log('setting role', roles);
        }
    }

    const all_roles = useMemo(() => {
        let roles = [];
        Object.keys(_get(DAO, 'discord', {})).map((server) => {
            const r = DAO.discord[server].roles
            roles = roles.concat(r);
        })
        return roles.filter(r => r.name !== "@everyone" && r.name !== 'Lomads' && r.name !== 'LomadsTestBot');
    }, [DAO.discord])

    return (
        <div className="selectRoles-container">
            <div className='selectRoles-header'>
                <h1>Select Roles</h1>
            </div>
            <div className='selectRoles-header'>
                <span>Organisation Roles</span>
            </div>

            {
                (_get(DAO, 'terminologies') ? Object.keys(_get(DAO, 'terminologies.roles', {})) : Object.keys(DEFAULT_ROLES)).map((key, index) => {
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
                                <span>{_get(transformRole(key), 'label')}</span>
                            </div>
                            <div className='checkbox' onClick={() => handleRole(key)}>
                                {
                                    (roles.includes(key))
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

            <div className='selectRoles-header'>
                <span>Discord Roles</span>
            </div>

            {
                all_roles && all_roles.length > 0
                    ?
                    <>
                        {
                            all_roles.map((discord_value, index) => {
                                return (
                                    <div className='roles-li'>
                                        <div
                                            className='roles-pill'
                                            style={{ background: `${_get(discord_value, 'roleColor', '#99aab5')}50` }}
                                        >
                                            <div
                                                className='roles-circle'
                                                style={{ background: _get(discord_value, 'roleColor', '#99aab5') }}
                                            ></div>
                                            <span>{discord_value.name}</span>
                                        </div>
                                        <div className='checkbox' onClick={() => handleRole(discord_value.id)}>
                                            {
                                                (roles.includes(discord_value.id))
                                                    ?
                                                    <div className="active-box">
                                                        <BsCheck2 color="#FFF" />
                                                    </div>
                                                    :
                                                    <div className="inactive-box"></div>
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </>
                    :
                    <div style={{ fontStyle: 'italic', fontSize: '14px', opacity: 0.5 }}>To sync discord roles, please add discord under organisation setting</div>
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