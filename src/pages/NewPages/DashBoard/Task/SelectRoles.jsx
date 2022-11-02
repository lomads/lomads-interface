import './SelectRoles.css';

const SelectRoles = ({ toggleSelect }) => {
    return (
        <div className="selectRoles-container">
            <div className='selectRoles-header'>
                <span>Select Roles</span>
            </div>

            <div className='roles-li'>
                <div className='roles-pill' style={{ background: 'rgba(146, 225, 168, 0.3)' }}>
                    <div className='roles-circle' style={{ background: 'rgba(146, 225, 168, 1)' }}></div>
                    <span>Roles 1</span>
                </div>
                <input type="checkbox" />
            </div>
            <div className='roles-li'>
                <div className='roles-pill' style={{ background: 'rgba(137,179,229,0.3)' }}>
                    <div className='roles-circle' style={{ background: 'rgba(137,179,229,1)' }}></div>
                    <span>Roles 2</span>
                </div>
                <input type="checkbox" />
            </div>
            <div className='roles-li'>
                <div className='roles-pill' style={{ background: 'rgba(234,100,71,0.3)' }}>
                    <div className='roles-circle' style={{ background: 'rgba(234,100,71,1)' }}></div>
                    <span>Roles 3</span>
                </div>
                <input type="checkbox" />
            </div>


            <div className='selectRoles-footer'>
                <button onClick={toggleSelect}>
                    CANCEL
                </button>
                <button>
                    SELECT
                </button>
            </div>
        </div>
    )
}

export default SelectRoles;