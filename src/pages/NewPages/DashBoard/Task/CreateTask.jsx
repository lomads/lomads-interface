import './CreateTask.css';
import { CgClose } from 'react-icons/cg'
import createProjectSvg from '../../../../assets/svg/createProject.svg';

import SimpleInputField from "UIpack/SimpleInputField";
import { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import SelectRoles from './SelectRoles';

const CreateTask = ({ toggleShowCreateTask }) => {
    const [tab, setTab] = useState(2);
    const [rolesEnabled, setRolesEnabled] = useState(false);
    const [select, setSelect] = useState(false);

    const toggleSelect = () => {
        setSelect(!select);
    }

    return (
        <div className="createTaskOverlay">
            {
                select
                    ?
                    <SelectRoles toggleSelect={toggleSelect} />
                    :
                    <div className="createTaskContainer">
                        <div className='createTask-header'>
                            <button onClick={() => toggleShowCreateTask()}>
                                <CgClose size={20} color="#C94B32" />
                            </button>
                        </div>

                        <div className='createTask-body'>
                            <img src={createProjectSvg} alt="frame-icon" />
                            <h1>Create task</h1>

                            <div className='createTask-inputRow'>
                                <span>Name of the task</span>
                                <SimpleInputField
                                    className="inputField"
                                    id="nameInput"
                                    height={50}
                                    width={'100%'}
                                    placeholder="Name of the task"
                                />
                            </div>

                            <div className='createTask-inputRow'>
                                <span>Description</span>
                                <textarea
                                    style={{ width: '100%' }}
                                    className="inputField"
                                    placeholder='Enter task description'
                                />
                            </div>

                            <div className='createTask-inputRow row-align'>
                                <div className='createTask-inputRow-half'>
                                    <span>Discussion channel</span>
                                    <SimpleInputField
                                        className="inputField"
                                        id="discussionInput"
                                        height={50}
                                        width={'100%'}
                                        placeholder="Dsicussion channel url"
                                    />
                                </div>
                                <div className='createTask-inputRow-half'>
                                    <span>Deadline</span>
                                    <SimpleInputField
                                        className="inputField"
                                        id="deadlineInput"
                                        height={50}
                                        width={'100%'}
                                        placeholder="Deadline"
                                    />
                                </div>
                            </div>

                            <div className='createTask-inputRow'>
                                <div className='createTask-optionalDiv'>
                                    <span>In project:</span>
                                    <div className='option-div'>
                                        Optionnal
                                    </div>
                                </div>
                                <select
                                    name="chain"
                                    id="chain"
                                    className="tokenDropdown"
                                    style={{ width: '100%' }}
                                >
                                    <option value="ADMIN">Project Name</option>
                                </select>
                            </div>

                            <div className='hr-line'></div>

                            <div className='createTask-inputRow'>
                                <span>Contribution</span>
                                <div className='createTask-buttonRow'>
                                    <button onClick={() => { setTab(1); setRolesEnabled(false) }} className={tab === 1 ? 'active' : null}>ASSIGN MEMBER</button>
                                    <button onClick={() => setTab(2)} className={tab === 2 ? 'active' : null}>OPEN</button>
                                </div>
                            </div>

                            {
                                tab === 1 &&
                                <div className='createTask-inputRow'>
                                    <p style={{ margin: '0' }}>This member will be in charge of completing this task</p>
                                    <select
                                        name="chain"
                                        id="chain"
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                    >
                                        <option value="ADMIN">Select member</option>
                                    </select>
                                </div>
                            }

                            {
                                tab === 2 &&
                                <div className='contributor-section'>
                                    <div className='contributor-check'>
                                        <input type="checkbox" onChange={(e) => console.log(e.target.value)} />
                                        <div>
                                            <h1>SINGLE CONTRIBUTOR</h1>
                                            <span>The reviewer will pick a contributor from the applicants (if unchecked, everyone can contribute)</span>
                                        </div>
                                    </div>
                                    <div className='contributor-check'>
                                        <input type="checkbox" onChange={(e) => setRolesEnabled(!rolesEnabled)} />
                                        <div>
                                            <h1>FILTER BY ROLES (DISCORD)</h1>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                rolesEnabled &&
                                <div className='selected-roles'>
                                    <div className='roles-left'>
                                        <div className='roles-li'>
                                            <div className='roles-pill' style={{ background: 'rgba(146, 225, 168, 0.3)' }}>
                                                <div className='roles-circle' style={{ background: 'rgba(146, 225, 168, 1)' }}></div>
                                                <span>Roles 1</span>
                                            </div>
                                            <div className='roles-close'>
                                                <CgClose color='#FFF' />
                                            </div>
                                        </div>
                                        <div className='roles-li'>
                                            <div className='roles-pill' style={{ background: 'rgba(137,179,229,0.3)' }}>
                                                <div className='roles-circle' style={{ background: 'rgba(137,179,229,1)' }}></div>
                                                <span>Roles 2</span>
                                            </div>
                                            <div className='roles-close'>
                                                <CgClose color='#FFF' />
                                            </div>
                                        </div>
                                        <div className='roles-li'>
                                            <div className='roles-pill' style={{ background: 'rgba(234,100,71,0.3)' }}>
                                                <div className='roles-circle' style={{ background: 'rgba(234,100,71,1)' }}></div>
                                                <span>Roles 3</span>
                                            </div>
                                            <div className='roles-close'>
                                                <CgClose color='#FFF' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='roles-right'>
                                        <button onClick={toggleSelect}>
                                            <HiOutlinePlus size={24} color='#C94B32' />
                                        </button>
                                    </div>
                                </div>
                            }

                            <div className='createTask-inputRow'>
                                <div className='createTask-optionalDiv'>
                                    <span>Submission link</span>

                                    <div className='option-div'>
                                        Optionnal
                                    </div>
                                </div>
                                <p>Provide a link here only if the submissions will come from trusted contributors</p>
                                <SimpleInputField
                                    className="inputField"
                                    id="nameInput"
                                    height={50}
                                    width={'100%'}
                                    placeholder="Google drive folder, notion page, github"
                                />
                            </div>

                            <div className='hr-line'></div>

                            <div className='createTask-inputRow'>
                                <span>Compensation</span>
                                <div className='createTask-compensation'>
                                    <select
                                        name="chain"
                                        id="chain"
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                    >
                                        <option value="ADMIN">MATIC</option>
                                    </select>
                                    <input className="inputField" type={'number'} style={{ height: '50px' }} />
                                </div>
                            </div>

                            <div className='createTask-inputRow'>
                                <span>Reviewer</span>
                                <select
                                    name="chain"
                                    id="chain"
                                    className="tokenDropdown"
                                    style={{ width: '100%' }}
                                >
                                    <option value="ADMIN">Select member</option>
                                </select>
                            </div>

                        </div>

                        <div className='createTask-footer'>
                            <button onClick={() => toggleShowCreateTask()}>
                                SAVE AS DRAFT
                            </button>
                            <button>
                                CREATE
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default CreateTask;