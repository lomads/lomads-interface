import { useState, useEffect } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './CreateTask.css';
import { CgClose } from 'react-icons/cg'
import createProjectSvg from '../../../../assets/svg/createProject.svg';

import SimpleInputField from "UIpack/SimpleInputField";
import { HiOutlinePlus } from 'react-icons/hi';
import SelectRoles from './SelectRoles';

import { useAppSelector, useAppDispatch } from "state/hooks";

import { createTask } from 'state/dashboard/actions'
import { resetCreateTaskLoader } from 'state/dashboard/reducer';

const CreateTask = ({ toggleShowCreateTask }) => {

    const dispatch = useAppDispatch();
    const { DAO, createTaskLoading } = useAppSelector((state) => state.dashboard);

    const [contributionType, setContributionType] = useState('assign');
    const [isSingleContributor, setIsSingleContributor] = useState(false);
    const [isFilterRoles, setIsFilterRoles] = useState(false);
    const [select, setSelect] = useState(false);
    const [validRoles, setValidRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dchannel, setDChannel] = useState('');
    const [deadline, setDeadline] = useState('');
    const [projectId, setProjectId] = useState(null);
    const [subLink, setSubLink] = useState('');
    const [reviewer, setReviewer] = useState(null);
    const [currency, setCurrency] = useState('MATIC');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (createTaskLoading === false) {
            dispatch(resetCreateTaskLoader());
            setContributionType('assign');
            setIsSingleContributor(false);
            setIsFilterRoles(false);
            setValidRoles([]);
            setSelectedUser(null);
            setName('');
            setDescription('');
            setDChannel('');
            setDeadline('');
            setProjectId(null);
            setSubLink('');
            setReviewer(null);
            setCurrency('MATIC');
            setAmount(0);
            toggleShowCreateTask();
        }
    }, [createTaskLoading]);

    const toggleSelect = () => {
        setSelect(!select);
    }

    const handleSetApplicant = (userIndex) => {
        let user = DAO.members[userIndex].member;
        setSelectedUser({ _id: user._id, address: user.wallet });
    }

    const handleSubmit = () => {
        let task = {};
        task.daoId = DAO?._id;
        task.name = name;
        task.description = description;
        task.applicant = selectedUser;
        task.projectId = projectId;
        task.discussionChannel = dchannel;
        task.deadline = deadline;
        task.submissionLink = subLink;
        task.compensation = { currency, amount };
        task.reviewer = reviewer;
        task.contributionType = contributionType;
        task.isSingleContributor = isSingleContributor;
        task.isFilterRoles = isFilterRoles;
        task.validRoles = validRoles;

        console.log("task : ", task);
        dispatch(createTask({ payload: task }))
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
                                    value={name}
                                    onchange={(e) => setName(e.target.value)}
                                    placeholder="Name of the task"
                                />
                            </div>

                            <div className='createTask-inputRow'>
                                <span>Description</span>
                                <textarea
                                    style={{ width: '100%' }}
                                    className="inputField"
                                    placeholder='Enter task description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                        value={dchannel}
                                        onchange={(e) => setDChannel(e.target.value)}
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
                                        value={deadline}
                                        type="date"
                                        onchange={(e) => setDeadline(e.target.value)}
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
                                    name="project"
                                    id="project"
                                    className="tokenDropdown"
                                    style={{ width: '100%' }}
                                    onChange={(e) => setProjectId(e.target.value)}
                                >
                                    <option value="">Select project</option>
                                    {
                                        _get(DAO, 'projects', []).map((item, index) => {
                                            return (
                                                <option value={`${item._id}`}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className='hr-line'></div>

                            <div className='createTask-inputRow'>
                                <span>Contribution</span>
                                <div className='createTask-buttonRow'>
                                    <button onClick={() => { setContributionType('assign'); setIsFilterRoles(false) }} className={contributionType === 'assign' ? 'active' : null}>ASSIGN MEMBER</button>
                                    <button onClick={() => { setContributionType('open'); setSelectedUser(null) }} className={contributionType === 'open' ? 'active' : null}>OPEN</button>
                                </div>
                            </div>

                            {
                                contributionType === 'assign' &&
                                <div className='createTask-inputRow'>
                                    <p style={{ margin: '0' }}>This member will be in charge of completing this task</p>
                                    <select
                                        name="member"
                                        id="member"
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                        onChange={(e) => handleSetApplicant(e.target.value)}
                                    >
                                        <option value="">Select member</option>
                                        {
                                            _get(DAO, 'members', []).map((item, index) => {
                                                return (
                                                    <option value={`${index}`}>{item.member.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            }

                            {
                                contributionType === 'open' &&
                                <div className='contributor-section'>
                                    <div className='contributor-check'>
                                        <input type="checkbox" onChange={(e) => setIsSingleContributor(!isSingleContributor)} />
                                        <div>
                                            <h1>SINGLE CONTRIBUTOR</h1>
                                            <span>The reviewer will pick a contributor from the applicants (if unchecked, everyone can contribute)</span>
                                        </div>
                                    </div>
                                    <div className='contributor-check'>
                                        <input type="checkbox" onChange={(e) => setIsFilterRoles(!isFilterRoles)} />
                                        <div>
                                            <h1>FILTER BY ROLES (DISCORD)</h1>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                isFilterRoles &&
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
                                    value={subLink}
                                    onchange={(e) => setSubLink(e.target.value)}
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
                                        <option value="MATIC">MATIC</option>
                                    </select>
                                    <input
                                        className="inputField"
                                        type={'number'}
                                        style={{ height: '50px' }}
                                        value={amount}
                                        onChange={(e) => setAmount(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className='createTask-inputRow'>
                                <span>Reviewer</span>
                                <select
                                    name="reviewer"
                                    id="reviewer"
                                    className="tokenDropdown"
                                    style={{ width: '100%' }}
                                    onChange={(e) => setReviewer(e.target.value)}
                                >
                                    <option value="">Select member</option>
                                    {
                                        _get(DAO, 'members', []).map((item, index) => {
                                            return (
                                                <option value={`${item.member.wallet}`}>{item.member.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                        </div>

                        <div className='createTask-footer'>
                            <button onClick={() => toggleShowCreateTask()}>
                                SAVE AS DRAFT
                            </button>
                            <button onClick={handleSubmit}>
                                CREATE
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default CreateTask;