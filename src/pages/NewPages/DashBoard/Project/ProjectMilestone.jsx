import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './ProjectMilestone.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/milestone.svg';

import SimpleInputField from "UIpack/SimpleInputField";

import { Editor } from '@tinymce/tinymce-react';

const ProjectMilestone = ({ toggleShowMilestone, getMilestones }) => {

    const editorRef = useRef(null);

    const [milestones, setMilestones] = useState([0]);

    const onChangeNumberOMilestones = (e) => {
        let n = parseInt(e.target.value);
        let array = [];
        for (var i = 0; i < n; i++) {
            array.push({ name: `Milestone ${i + 1}`, amount: '', deadline: '', deliverables: '', complete: false });
        }
        console.log("array : ", array)
        setMilestones(array);
    };

    const handleChangeAmount = (e, index) => {
        milestones[index].amount = e;
    }

    const handleChangeDeadline = (e, index) => {
        milestones[index].deadline = e;
    }

    const handleChangeDeliverables = (e, index) => {
        milestones[index].deliverables = e;
    }

    const handleSubmit = () => {
        getMilestones(milestones);
        toggleShowMilestone();
    }

    return (
        <div className="milestoneOverlay">
            <div className="milestoneContainer">
                <div className='milestone-header'>
                    <button onClick={() => toggleShowMilestone()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                    <div className='milestone-body'>
                        <img src={createTaskSvg} alt="frame-icon" />
                        <h1>Project Milestones</h1>
                        <span>Organise and link payments to milestones</span>

                        <div className='milestone-inputRow' style={{ marginBottom: '0', width: '320px' }}>
                            <span>Milestones</span>
                            <select
                                name="project"
                                id="project"
                                className="tokenDropdown"
                                style={{ width: '100%' }}
                                onChange={onChangeNumberOMilestones}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                        </div>

                        {milestones.length > 0 && <div className='hr-line'></div>}

                        {
                            milestones.map((item, index) => {
                                return (
                                    <div className='milestone-card'>
                                        <h1 style={{ marginBottom: '25px' }}>Milestone {index + 1}</h1>

                                        <div className='milestone-inputRow row-align' style={{ margin: '0' }}>
                                            <div style={{ width: '70px' }}>
                                                <SimpleInputField
                                                    className="inputField"
                                                    id="nameInput"
                                                    height={50}
                                                    width={'100%'}
                                                    onchange={(e) => handleChangeAmount(e.target.value, index)}
                                                />
                                            </div>
                                            <span style={{ margin: '0', marginLeft: '14px' }}>% of Project value</span>
                                        </div>

                                        <div className='milestone-inputRow' style={{ margin: '20px 0' }}>
                                            <span>Deadline</span>
                                            <div style={{ width: '170px' }}>
                                                <SimpleInputField
                                                    className="inputField"
                                                    id="deadlineInput"
                                                    height={50}
                                                    width={'100%'}
                                                    placeholder="Deadline"
                                                    type="date"
                                                    onchange={(e) => handleChangeDeadline(e.target.value, index)}
                                                />
                                            </div>
                                        </div>

                                        <div className='milestone-inputRow' style={{ margin: '0' }}>
                                            <span>Deliverables</span>
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
                                                onEditorChange={(text) => handleChangeDeliverables(text, index)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='milestone-footer'>
                        <button onClick={() => toggleShowMilestone()}>
                            CANCEL
                        </button>
                        <button onClick={handleSubmit}>
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectMilestone;