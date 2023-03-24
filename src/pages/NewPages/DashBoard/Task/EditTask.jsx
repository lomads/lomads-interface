import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce, isEqual as _isEqual } from 'lodash';
import './CreateTask.css';
import { CgClose } from 'react-icons/cg'
import createProjectSvg from '../../../../assets/svg/createProject.svg';
import createTaskSvg from '../../../../assets/svg/task.svg';
import useTerminology from 'hooks/useTerminology';
import SimpleInputField from "UIpack/SimpleInputField";
import { HiOutlinePlus } from 'react-icons/hi';
import SelectRoles from './SelectRoles';

import { useAppSelector, useAppDispatch } from "state/hooks";
import { getCurrentUser } from "state/dashboard/actions";

import { editTask } from 'state/dashboard/actions'
import { resetEditTaskLoader } from 'state/dashboard/reducer';

import { useWeb3React } from "@web3-react/core";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { SupportedChainId } from "constants/chains";
import { beautifyHexToken, getSafeTokens } from '../../../../utils'

import useRole from '../../../../hooks/useRole'
import { isValidUrl } from 'utils';
import { Editor } from '@tinymce/tinymce-react';

import SimpleLoadButton from "UIpack/SimpleLoadButton";

import {
    Input,
    FormControl,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
} from "@chakra-ui/react";

const EditTask = ({ close, task, daoURL }) => {
    const dispatch = useAppDispatch();
    const { DAO, user, editTaskLoading } = useAppSelector((state) => state.dashboard);
    const { transformTask, transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies', null))
    const { chainId, account } = useWeb3React();

    const { myRole, can } = useRole(DAO, account)

    const editorRef = useRef(null);

    const [contributionType, setContributionType] = useState(task.contributionType);
    const [isSingleContributor, setIsSingleContributor] = useState(task.isSingleContributor);
    const [isFilterRoles, setIsFilterRoles] = useState(task.isFilterRoles);
    const [select, setSelect] = useState(false);
    const [validRoles, setValidRoles] = useState(task.validRoles);
    const [selectedUser, setSelectedUser] = useState(null);
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [dchannel, setDChannel] = useState(task.discussionChannel);
    const [deadline, setDeadline] = useState(task.deadline ? new Date(task.deadline).toISOString().substring(0, 10) : new Date());
    const [projectId, setProjectId] = useState(task.project ? task.project._id : null);
    const [subLink, setSubLink] = useState(task.submissionLink);
    const [reviewer, setReviewer] = useState(task.reviewer ? task.reviewer._id : null);
    const [currency, setCurrency] = useState({ currency: task.compensation.currency });
    const [amount, setAmount] = useState(task.compensation.amount);
    const [safeTokens, setSafeTokens] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const getTokens = async (safeAddress) => {
        const tokens = await getSafeTokens(chainId, safeAddress)
        setSafeTokens(tokens)
    };

    const getrolename = (roleId) => {

        for (let index = 0; index < Object.keys(_get(DAO, 'discord', {})).length; index++) {
            const element = Object.keys(_get(DAO, 'discord', {}))[index];
            const rolename_discord = _find(DAO.discord[element].roles, r => r.id === roleId)
            if (rolename_discord) {
                return rolename_discord.name
            }
        }
        return "";

    };

    useEffect(() => {
        if (account && chainId && (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))) {
            dispatch(getCurrentUser({}))
        }
    }, [account, chainId, user])

    useEffect(() => {
        getTokens(_get(DAO, 'safe.address'));
        return () => { };
    }, [DAO]);

    useEffect(() => { setReviewer(task.reviewer ? task?.reviewer?._id : null) }, [task])

    useEffect(() => {
        var date = new Date();
        var tdate = date.getDate();
        var month = date.getMonth() + 1;
        if (tdate < 10) {
            tdate = "0" + tdate;
        }
        if (month < 10) {
            month = "0" + month
        }
        var year = date.getUTCFullYear();
        var minDate = year + "-" + month + "-" + tdate;
        document.getElementById("deadlineInput").setAttribute("min", minDate);
    }, [])

    useEffect(() => {
        if (editTaskLoading === false) {
            dispatch(resetEditTaskLoader());
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                close();
            }, 3000);
        }
    }, [editTaskLoading]);

    const toggleSelect = () => {
        setSelect(!select);
    }

    const handleSetApplicant = (value) => {
        let user = _find(DAO.members, m => m.member._id === value);
        setSelectedUser({ _id: user.member._id, address: user.wallet });
        document.getElementById('error-applicant').innerHTML = ''
    }

    const handleRemoveRole = (role) => {
        setValidRoles(validRoles.filter((item) => item !== role))
    }

    const handleEditTask = () => {
        if (name === '') {
            let e = document.getElementById('error-name');
            e.innerHTML = 'Enter name';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (description === '') {
            let e = document.getElementById('error-desc');
            e.innerHTML = 'Enter description';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (!currency || amount === '' || amount === 0) {
            let e = document.getElementById('error-compensation');
            e.innerHTML = 'Enter compensation';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (dchannel && !isValidUrl(dchannel)) {
            let e = document.getElementById('error-dchannel');
            e.innerHTML = 'Please enter a valid link';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (subLink && !isValidUrl(subLink)) {
            let e = document.getElementById('error-sublink');
            e.innerHTML = 'Please enter a valid link';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (deadline === '') {
            let e = document.getElementById('error-deadline');
            e.innerHTML = 'Enter application deadline';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (contributionType === 'assign' && selectedUser === null) {
            let e = document.getElementById('error-applicant');
            e.innerHTML = 'Select one applicant for the task';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else if (reviewer === null) {
            let e = document.getElementById('error-reviewer');
            e.innerHTML = 'Select a reviewer';
            e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            return;
        }
        else {
            let tempLink, tempSub = null;
            if (dchannel && dchannel !== '') {
                tempLink = dchannel;
                if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                    tempLink = 'https://' + tempLink;
                }
            }
            if (subLink && subLink !== '') {
                tempSub = subLink;
                if (tempSub !== '' && tempSub.indexOf('https://') === -1 && tempSub.indexOf('http://') === -1) {
                    tempSub = 'https://' + tempSub;
                }
            }

            let symbol = _find(safeTokens, tkn => tkn.tokenAddress === currency.currency)
            symbol = _get(symbol, 'token.symbol', null)
            if (!symbol)
                symbol = currency.currency === process.env.REACT_APP_MATIC_TOKEN_ADDRESS || currency === process.env.REACT_APP_GOERLI_TOKEN_ADDRESS ? chainId === SupportedChainId.GOERLI ? 'GOR' : 'MATIC' : 'SWEAT'

            let members = _get(task, 'members', [])

            console.log(task.contributionType !== contributionType, task.isSingleContributor !== isSingleContributor, task.isFilterRoles !== isFilterRoles, !_isEqual(task.validRoles, validRoles))

            if(
                (task.contributionType !== contributionType) || 
                (task.isSingleContributor !== isSingleContributor) ||
                (task.isFilterRoles !== isFilterRoles) ||
                !_isEqual(task.validRoles, validRoles)
            ) {
                members = []
            }

            members = contributionType === 'assign' && selectedUser ? [{ member: selectedUser._id, status: 'approved' }] : members;

            let taskOb = {};
            taskOb.name = name;
            taskOb.description = description;
            taskOb.projectId = projectId;
            taskOb.discussionChannel = tempLink;
            taskOb.deadline = deadline;
            taskOb.submissionLink = tempSub ? tempSub : '';
            taskOb.compensation = { currency: currency.currency, amount, symbol };
            taskOb.contributionType = contributionType;
            taskOb.isSingleContributor = isSingleContributor;
            taskOb.isFilterRoles = isFilterRoles;
            taskOb.validRoles = isFilterRoles ? validRoles : [];
            taskOb.members = members
            taskOb.reviewer = reviewer;
            console.log("task ob : ", taskOb)
            dispatch(editTask({ payload: taskOb, daoUrl: daoURL, taskId: task._id }))
        }
    }

    const eligibleContributors = useMemo(() => {
        return _get(DAO, 'members', []).filter(m => (reviewer || "").toLowerCase() !== m.member._id && m.member._id !== _find(_get(task, 'members', []), m => m?.status === 'approved')?.member?._id)
    }, [DAO, selectedUser, reviewer])

    const eligibleReviewers = useMemo(() => {
        return _get(DAO, 'members', []).filter(m => _get(selectedUser, "_id", "").toLowerCase() !== m.member._id.toLowerCase())
    }, [DAO, reviewer, selectedUser])

    const eligibleProjects = useMemo(() => {
        return _get(DAO, 'projects', []).filter(p => _find(p?.members, m => m?._id === user?._id) && p?._id !== task?.project?._id)
    }, [DAO, reviewer, selectedUser])

    return (
        <div className="createTaskOverlay">
            {
                select
                    ?
                    <SelectRoles toggleSelect={toggleSelect} validRoles={validRoles} handleValidRoles={(value) => setValidRoles(value)} />
                    :
                    <div className="createTaskContainer">
                        <div className='createTask-header'>
                            <button onClick={close}>
                                <CgClose size={20} color="#C94B32" />
                            </button>
                        </div>
                        {
                            showSuccess
                                ?
                                <div className='createTask-success'>
                                    <img src={createTaskSvg} alt="frame-icon" />
                                    <h1>{transformTask().label} Edited!</h1>
                                    <span>The {transformTask().label} has been edited successfully.<br />You will be redirected in a few seconds.</span>
                                </div>
                                :
                                <>
                                    <div className='createTask-body'>
                                        <img src={createTaskSvg} alt="frame-icon" />
                                        <h1>Edit {transformTask().label}</h1>

                                        <div className='createTask-inputRow'>
                                            <span>Name of the {transformTask().label}</span>
                                            <SimpleInputField
                                                className="inputField"
                                                id="nameInput"
                                                height={50}
                                                width={'100%'}
                                                value={name}
                                                onchange={(e) => { setName(e.target.value); document.getElementById('error-name').innerHTML = '' }}
                                                placeholder={`Name of the ${transformTask().label}`}
                                            />
                                            <span className='error-msg' id="error-name"></span>
                                        </div>

                                        <div className='createTask-inputRow'>
                                            <span>Description</span>
                                            <Editor
                                                apiKey='p0turvzgbtf8rr24txekw7sgjye6xunw2near38hwoohdg13'
                                                onInit={(evt, editor) => editorRef.current = editor}
                                                init={{
                                                    height: 150,
                                                    menubar: false,
                                                    statusbar: false,
                                                    toolbar: false,
                                                    branding: false,
                                                    body_class: "mceBlackBody",
                                                    default_link_target: "_blank",
                                                    extended_valid_elements: "a[href|target=_blank]",
                                                    link_assume_external_targets: true,
                                                    plugins: [
                                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                                    ],
                                                    // toolbar: 'undo redo | blocks | ' +
                                                    //     'bold italic forecolor | alignleft aligncenter ' +
                                                    //     'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    //     'removeformat | help',
                                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                }}
                                                value={description}
                                                onEditorChange={(text) => { setDescription(text); document.getElementById('error-desc').innerHTML = '' }}

                                            />
                                            {/* <textarea
                                                style={{ width: '100%' }}
                                                className="inputField"
                                                placeholder='Enter task description'
                                                value={description}
                                                onChange={(e) => { setDescription(e.target.value); document.getElementById('error-desc').innerHTML = '' }}
                                            /> */}
                                            <span className='error-msg' id="error-desc"></span>
                                        </div>

                                        <div className='createTask-inputRow row-align'>
                                            <div className='createTask-inputRow-half' style={{ height: '70px' }}>
                                                <span>Discussion channel</span>
                                                <SimpleInputField
                                                    className="inputField"
                                                    id="discussionInput"
                                                    height={50}
                                                    width={'100%'}
                                                    placeholder="Discussion channel url"
                                                    value={dchannel}
                                                    onchange={(e) => { setDChannel(e.target.value); document.getElementById('error-dchannel').innerHTML = '' }}
                                                />
                                                <span className='error-msg' id="error-dchannel"></span>
                                            </div>
                                            <div className='createTask-inputRow-half' style={{ height: '70px' }}>
                                                <span>Deadline</span>
                                                <SimpleInputField
                                                    className="inputField"
                                                    id="deadlineInput"
                                                    height={50}
                                                    width={'100%'}
                                                    placeholder="Deadline"
                                                    value={deadline}
                                                    type="date"
                                                    onchange={(e) => { setDeadline(e.target.value); document.getElementById('error-deadline').innerHTML = '' }}
                                                />
                                                <span className='error-msg' id="error-deadline"></span>
                                            </div>
                                        </div>

                                        <div className='createTask-inputRow'>
                                            <div className='createTask-optionalDiv'>
                                                <span>In {transformWorkspace().label}:</span>
                                                <div className='option-div'>
                                                    Optional
                                                </div>
                                            </div>
                                            <select
                                                name="project"
                                                id="project"
                                                className="tokenDropdown"
                                                style={{ width: '100%' }}
                                                onChange={(e) => setProjectId(e.target.value)}
                                            >
                                                {
                                                    task.project
                                                        ?
                                                        <>
                                                            <option value={task.project._id}>{task.project.name}</option>
                                                            {
                                                                eligibleProjects.filter(p => !p.archivedAt && !p.deletedAt).map((item, index) => {
                                                                    return (
                                                                        <option value={`${item._id}`}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            <option value={null}>Select {transformWorkspace().label.toLowerCase()}</option>
                                                            {
                                                                eligibleProjects.filter(p => !p.archivedAt && !p.deletedAt).map((item, index) => {
                                                                    return (
                                                                        <option value={`${item._id}`}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                }

                                            </select>

                                        </div>

                                        <div className='hr-line'></div>

                                        <div className='createTask-inputRow'>
                                            <span>Contribution</span>
                                            <div className='createTask-buttonRow'>
                                                <button
                                                    onClick={() => { setContributionType('open'); setSelectedUser(null) }}
                                                    className={contributionType === 'open' ? 'active' : null}
                                                // disabled
                                                // style={{ cursor: 'not-allowed' }}
                                                >
                                                    OPEN
                                                </button>
                                                <button
                                                    onClick={() => { setContributionType('assign'); setIsFilterRoles(false); setValidRoles([]); setIsSingleContributor(false); }}
                                                    className={contributionType === 'assign' ? 'active' : null}
                                                // disabled
                                                // style={{ cursor: 'not-allowed' }}
                                                >
                                                    ASSIGN MEMBER
                                                </button>
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
                                                    // style={{ width: '100%', cursor: 'not-allowed' }}
                                                    onChange={(e) => handleSetApplicant(e.target.value)}
                                                // disabled
                                                >
                                                    {
                                                        task.contributionType === 'assign'
                                                        &&
                                                        <option value={null}>{_find(_get(task, 'members', []), m => m?.status === 'approved')?.member?.name && _find(_get(task, 'members', []), m => m?.status === 'approved')?.member?.name !== "" ? `${_find(_get(task, 'members', []), m => m?.status === 'approved')?.member?.name}  (${beautifyHexToken(_find(_get(task, 'members', []), m => m?.status === 'approved')?.member?.wallet)})` : beautifyHexToken(_find(_get(task, 'members', []), m => m?.status === 'approved')?.member?.wallet)}</option>
                                                    }
                                                    {
                                                        eligibleContributors.map((item, index) => {
                                                            return (
                                                                <option value={`${item.member._id}`}>{item.member.name && item.member.name !== "" ? `${item.member.name}  (${beautifyHexToken(item.member.wallet)})` : beautifyHexToken(item.member.wallet)}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <span className='error-msg' id="error-applicant"></span>
                                            </div>
                                        }

                                        {
                                            contributionType === 'open' &&
                                            <div className='contributor-section'>
                                                <div className='contributor-check'>
                                                    <label class="switch">
                                                        <input
                                                            // disabled
                                                            // style={{ cursor: 'not-allowed' }}
                                                            defaultChecked={isSingleContributor}
                                                            onChange={(e) => setIsSingleContributor(!isSingleContributor)}
                                                            type="checkbox"
                                                        />
                                                        <span class="slider check round"></span>
                                                    </label>
                                                    <div>
                                                        <h1>SINGLE CONTRIBUTOR</h1>
                                                        <span>The reviewer will pick a contributor from the applicants (if unchecked, everyone can contribute)</span>
                                                    </div>
                                                </div>
                                                <div className='contributor-check'>
                                                    <label class="switch">
                                                        <input
                                                            // disabled
                                                            // style={{ cursor: 'not-allowed' }}
                                                            defaultChecked={isFilterRoles}
                                                            onChange={(e) => setIsFilterRoles(!isFilterRoles)}
                                                            type="checkbox"
                                                        />
                                                        <span class="slider check round"></span>
                                                    </label>

                                                    <div>
                                                        <h1>FILTER BY ROLES</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {
                                            isFilterRoles &&
                                            <>
                                                <div className='selected-roles'>
                                                    <div className='roles-left'>
                                                        {
                                                            validRoles.map((item, index) => {
                                                                console.log("Valid roles : ", validRoles);
                                                                return (
                                                                    <div className='roles-li'>
                                                                        <div
                                                                            className='roles-pill'
                                                                            style={{ background: '#99aab550' }}
                                                                        >
                                                                            <div
                                                                                className='roles-circle'
                                                                                style={{ background: '#99aab5' }}
                                                                            ></div>
                                                                            <span>{item == "role1" || item == "role2" || item == "role3" || item == "role4" ? transformRole(item).label : getrolename(item)}</span>
                                                                        </div>
                                                                        <div className='roles-close' style={{ cursor: 'not-allowed' }}>
                                                                            <CgClose color='#FFF' />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className='roles-right'>
                                                        <button
                                                            onClick={toggleSelect}
                                                        // disabled 
                                                        // style={{ cursor: 'not-allowed' }}
                                                        >
                                                            <HiOutlinePlus size={24} color='#C94B32' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
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
                                                onchange={(e) => { setSubLink(e.target.value); document.getElementById('error-sublink').innerHTML = '' }}
                                                placeholder="Google drive folder, notion page, github"
                                            />
                                            <span className='error-msg' id="error-sublink"></span>
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
                                                    onChange={e => {
                                                        let el = document.getElementById('error-compensation');
                                                        el.innerHTML = '';
                                                        setCurrency({ currency: e.target.value })
                                                    }}
                                                    value={currency.currency}
                                                >

                                                    <option value={null}>
                                                        select a token
                                                    </option>
                                                    {safeTokens.map((result, index) => {
                                                        console.log("tokens_RESULT", result)
                                                        return (
                                                            (
                                                                <>
                                                                    <option value={result.tokenAddress ? result.tokenAddress : chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS} key={index}>
                                                                        {_get(result, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}
                                                                    </option>
                                                                </>
                                                            )
                                                        );
                                                    })}
                                                    {can(myRole, 'task.create.sweat') && _get(DAO, 'sweatPoints', false) && <option value="SWEAT">SWEAT</option>}
                                                </select>
                                                {/* <input
                                                    className="inputField"
                                                    type={'number'}
                                                    style={{ height: '55px' }}
                                                    value={amount}
                                                    step={0.01}
                                                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                                                /> */}
                                                {/* <NumberInputStepper
                                                    className="inputField"
                                                    height={55}
                                                    step={0.01}
                                                    value={amount}
                                                    placeholder="Amount"
                                                    type="number"
                                                    onchange={(e) => setAmount(parseFloat(e.target.value))}
                                                /> */}
                                                <NumberInput value={amount} onChange={(e) => setAmount(parseFloat(e))} style={{ marginTop: 10, width: 350, height: 50, borderRadius: '10px 10px 10px 10px', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)' }} step={1} min={0}>
                                                    <NumberInputField placeholder='Amount' className='input' style={{ padding: 0, width: 130, textAlign: "center", height: 50, backgroundColor: '#F5F5F5', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', borderRadius: '10px 0px 0px 10px', borderWidth: 0 }} />
                                                    <NumberInputStepper style={{ width: 50, backgroundColor: '#FFF', borderRadius: '0px 10px 10px 0px' }}>
                                                        <NumberIncrementStepper color="#C94B32" />
                                                        <NumberDecrementStepper color="#C94B32" style={{ borderTopWidth: 0 }} />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </div>
                                            <span className='error-msg' id="error-compensation"></span>
                                        </div>

                                        <div className='createTask-inputRow'>
                                            <span>Reviewer</span>
                                            <select
                                                name="reviewer"
                                                id="reviewer"
                                                className="tokenDropdown"
                                                value={reviewer}
                                                style={{ width: '100%' }}
                                                onChange={(e) => { setReviewer(e.target.value); document.getElementById('error-reviewer').innerHTML = '' }}
                                            >
                                                <option value={null}>Select member</option>
                                                {
                                                    eligibleReviewers.map((item, index) => {
                                                        return (
                                                            <option value={`${item.member._id}`}>{item.member.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            <span className='error-msg' id="error-reviewer"></span>
                                        </div>

                                    </div>

                                    <div className='createTask-footer' style={{ justifyContent: 'center' }}>
                                        {/* <button onClick={handleDraftTask}>
                                            SAVE AS DRAFT
                                        </button> */}
                                        <SimpleLoadButton
                                            title="SAVE"
                                            height={40}
                                            width={180}
                                            fontsize={20}
                                            fontweight={400}
                                            onClick={handleEditTask}
                                            bgColor={"#C94B32"}
                                            condition={editTaskLoading}
                                        />
                                        {/* <button onClick={handleEditTask}>
                                            EDIT
                                        </button> */}
                                    </div>
                                </>
                        }
                    </div>
            }
        </div>
    )
}

export default EditTask;