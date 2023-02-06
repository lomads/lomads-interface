import { useMemo, useState } from 'react';
import { get as _get } from 'lodash'
import './SelectRoles.css';
import { useAppSelector } from "state/hooks";
import useTerminology from 'hooks/useTerminology'
import { DEFAULT_ROLES } from "constants/terminology";

const SelectRoles = ({ toggleSelect, validRoles, handleValidRoles }) => {    
    const [roles, setRoles] = useState(validRoles);
	const { DAO } = useAppSelector((state) => state.dashboard);
    const { transformRole } = useTerminology(_get(DAO, 'terminologies', undefined))
    const handleRole = (role) => {
        console.log('onclickrolefetch',role);

        if (roles.includes(role)) {
            setRoles(roles.filter((i) => i !== role))
        }
        else {
            setRoles([...roles,role]);
            console.log('setting role',roles);
        }
    }
    const all_roles=useMemo(()=>{

        let roles=[];
        Object.keys(DAO?.discord).map((server)=>{
const r=DAO.discord[server].roles
roles=roles.concat(r);

        })
        return roles.filter(r => r.name !== "@everyone");
    },[DAO.discord])
    return (
        <div className="selectRoles-container">
            <div className='selectRoles-header'>
                <span>Select Roles</span>
            </div>

            {
                Object.keys(_get(DAO, 'terminologies.roles', {})).map((key, index) => {
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
            <div className='selectRoles-header'>
                <span>Discord Roles</span>
            </div>

            {
               



               all_roles.map((discord_value,index) => {
                    //alert(discord_value);
                 
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
                                <span>{ discord_value.name }</span>
                            </div>
                            {
                                roles.includes(discord_value.id)
                                    ?
                                    <input type="checkbox" onChange={() => handleRole(discord_value.id)} checked />
                                    :
                                    <input type="checkbox" onChange={() => handleRole(discord_value.id)} />
                            }
                           
                        </div>

                         
            
                        
                     
                       
                    );
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