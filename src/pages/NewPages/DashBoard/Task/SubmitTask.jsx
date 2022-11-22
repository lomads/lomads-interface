import { useState, useEffect, useCallback } from 'react';
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';

import { CgClose } from 'react-icons/cg';
import createTaskSvg from '../../../../assets/svg/task.svg';

import SimpleInputField from "UIpack/SimpleInputField";
import AddressInputField from "UIpack/AddressInputField";
import SUBMISSION_DONE from '../../../../assets/svg/submission-done.svg'
import { AiOutlinePlus } from "react-icons/ai";

import { isValidUrl } from 'utils';

import { useAppDispatch, useAppSelector } from "state/hooks";

import { applyTask, submitTaskAction } from 'state/dashboard/actions'
import { resetApplyTaskLoader, resetSubmitTaskLoading } from 'state/dashboard/reducer';

import folder from '../../../../assets/svg/folder.svg';

const SubmitTask = ({ task, close }) => {
    const dispatch = useAppDispatch();

    const { DAO, applyTaskLoading, submitTaskLoading } = useAppSelector((state) => state.dashboard);

    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [resourceList, setResourceList] = useState([]);

    const [submissionDone, setSubmissionDone] = useState(false);

    useEffect(() => {
        if (applyTaskLoading === false) {
            dispatch(resetApplyTaskLoader());
            close();
        }
    }, [applyTaskLoading]);

    useEffect(() => {
        if (submitTaskLoading === false) {
            dispatch(resetSubmitTaskLoading());
            setSubmissionDone(true);
            setTimeout(() => {
                setSubmissionDone(false);
                close();
            }, 3000);
        }
    }, [submitTaskLoading]);

    const handleChangeNote = (e) => {
        document.getElementById('note-error').innerHTML = '';
        setNote(e.target.value);
    }

    const handleChangeTitle = (e) => {
        document.getElementById('title-error').innerHTML = '';
        document.getElementById('resource-error').innerHTML = '';
        setTitle(e.target.value);
    }

    const handleChangeLink = (e) => {
        document.getElementById('link-error').innerHTML = '';
        document.getElementById('resource-error').innerHTML = '';
        setLink(e.target.value);
    }

    const handleAddResource = () => {
        if (title === '') {
            document.getElementById('title-error').innerHTML = 'Please enter a title';
            return;
        }
        else if (link === '') {
            document.getElementById('link-error').innerHTML = "Please enter a link";
            return;
        }
        else if (!isValidUrl(link)) {
            document.getElementById('link-error').innerHTML = "Please enter a valid link"
            return;
        }
        else {
            let tempLink = link;
            if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                tempLink = 'https://' + tempLink;
            }
            let resource = {};
            resource.title = title;
            resource.link = tempLink;
            setResourceList([...resourceList, resource]);
            setTitle('');
            setLink('');
        }
    }

    const handleRemoveResource = (position) => {
        setResourceList(resourceList.filter((_, index) => index !== position));
    }

    const handleSubmitWork = useCallback(() => {
        if (note === '') {
            document.getElementById('note-error').innerHTML = 'Please enter a note';
            return;
        }
        else if (task.submissionLink && task.submissionLink.length == 0 && resourceList.length === 0) {
            document.getElementById('resource-error').innerHTML = 'Please provide atleast one link';
            return;
        }
        else {
            // dispatch(applyTask({ taskId: task._id, daoUrl: _get(DAO, 'url', ''), payload: { note, resourceList } }));
            const payload = {
                daoUrl: _get(DAO, 'url', ''),
                taskId: task._id,
                note,
                ...(task.submissionLink && task.submissionLink.length == 0 ? { submissionLink: resourceList } : {})
            }
            console.log("payload : ", payload)
            //console.log(payload)
            dispatch(submitTaskAction(payload))
        }
    }, [note, resourceList])

    return (
        <div className="taskApply-overlay">
            <div className="taskApply-container">

                <div className="taskApply-header">
                    {!submissionDone && <span>{task.name}</span>}
                    <button onClick={close}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>

                {
                    submissionDone ?
                        <div className='createTask-success'>
                            <img src={SUBMISSION_DONE} alt="frame-icon" />
                            <h1>Done!</h1>
                            <span>Your submission is sent.<br />You will be redirected in a few seconds.</span>
                        </div> :
                        <div className='taskApply-body'>
                            <img src={createTaskSvg} alt="frame-icon" />
                            <h1>Submit your work</h1>

                            <div className='taskApply-rowInput' style={{ margin: '35px 0' }}>
                                <label>Note</label>
                                <textarea
                                    style={{ width: '100%' }}
                                    className="inputField"
                                    placeholder='I made this changes because...'
                                    value={note}
                                    onChange={handleChangeNote}
                                />
                                <span style={{ fontSize: '13px', color: '#C84A32' }} id="note-error"></span>
                            </div>

                            {
                                task.submissionLink && task.submissionLink.length > 0
                                    ?
                                    <button className='submitLink-btn' onClick={() => window.open(task.submissionLink, '_blank', 'noopener,noreferrer')}>
                                        <img src={folder} />
                                        SUBMISSION LINK
                                    </button>
                                    :
                                    <div className='taskApply-rowInput'>
                                        <label>Add links</label>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                            <div style={{ marginRight: '10px', height: '70px' }}>
                                                <SimpleInputField
                                                    className="inputField"
                                                    height={50}
                                                    width={135}
                                                    placeholder="Ex portfolio"
                                                    value={title}
                                                    onchange={handleChangeTitle}
                                                />
                                                <span style={{ fontSize: '13px', color: '#C84A32' }} id="title-error"></span>
                                            </div>
                                            <div style={{ marginRight: '10px', height: '70px' }}>
                                                <AddressInputField
                                                    className="inputField"
                                                    height={50}
                                                    width={175}
                                                    placeholder="Link"
                                                    value={link}
                                                    onchange={handleChangeLink}
                                                />
                                                <span style={{ fontSize: '13px', color: '#C84A32' }} id="link-error"></span>
                                            </div>
                                            <button
                                                style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                                                onClick={() => handleAddResource()}
                                            >
                                                <AiOutlinePlus color="#FFF" size={25} />
                                            </button>
                                        </div>
                                        <span style={{ fontSize: '13px', color: '#C84A32', marginTop: '-15px' }} id="resource-error"></span>
                                    </div>
                            }

                            {
                                resourceList.length > 0
                                    ?
                                    <div className='transparent-list'>
                                        {
                                            resourceList.map((item, index) => {
                                                return (
                                                    <div className="member-li" key={index}>
                                                        <div className="member-img-name">
                                                            {/* {handleParseUrl(item.link)} */}
                                                            <p style={{ marginLeft: '5px' }}>{item.title}</p>
                                                        </div>
                                                        <div className="member-address">
                                                            <p>{item.link.length > 30 ? item.link.slice(0, 30) + "..." : item.link}</p>
                                                            <button onClick={() => handleRemoveResource(index)}>X</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    null
                            }

                            <button className='taskApply-sendBtn' onClick={handleSubmitWork}>SEND</button>

                        </div>
                }
            </div>
        </div>
    )
}

export default SubmitTask;