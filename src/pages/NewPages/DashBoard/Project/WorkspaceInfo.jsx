import { useRef, useState, useEffect } from 'react';
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import './WorkspaceInfo.css';
import { CgClose } from 'react-icons/cg'
import createProjectSvg from '../../../../assets/svg/createProject.svg';

import SimpleLoadButton from "UIpack/SimpleLoadButton";

import { useAppSelector, useAppDispatch } from "state/hooks";

import { Editor } from '@tinymce/tinymce-react';
import useTerminology from 'hooks/useTerminology';

import { updateProject } from "state/dashboard/actions";
import { resetUpdateProjectLoader } from 'state/dashboard/reducer';

const WorkspaceInfo = ({ toggleWorkspaceInfo, projectId, daoURL }) => {
    const dispatch = useAppDispatch();
    const { DAO, Project, updateProjectLoading } = useAppSelector((state) => state.dashboard);
    const { transformWorkspace } = useTerminology(_get(DAO, 'terminologies'))
    const editorRef = useRef(null);
    const [name, setName] = useState(_get(Project, 'name', ''));
    const [description, setDescription] = useState(_get(Project, 'description', ''));

    // runs after updating project name & description
    useEffect(() => {
        if (updateProjectLoading === false) {
            dispatch(resetUpdateProjectLoader());
            setName('');
            setDescription('');
            toggleWorkspaceInfo();
        }
    }, [updateProjectLoading]);

    const handleSaveChanges = () => {
        dispatch(updateProject({ projectId, daoUrl: daoURL, payload: { name, description } }))
    }

    return (
        <div className="WorkspaceEditOverlay">
            <div className="WorkspaceEditContainer">
                <div className='WorkspaceEdit-header'>
                    <button onClick={() => toggleWorkspaceInfo()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>

                    <div className='WorkspaceEdit-body'>
                        <img src={createProjectSvg} alt="frame-icon" />
                        <h1>{transformWorkspace().label} Details</h1>

                        <div className='createProject-form-container'>
                            <div className='input-div'>
                                <label>Name of the {transformWorkspace().label}</label>
                                <input
                                    className="text-input"
                                    placeholder={`Enter ${transformWorkspace().label} name`}
                                    value={name}
                                    name="name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className='input-div'>
                                <label>Short description</label>
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
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    }}
                                    value={description}
                                    onEditorChange={(text) => { setDescription(text) }}
                                />
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                <SimpleLoadButton
                                    condition={updateProjectLoading}
                                    disabled={updateProjectLoading}
                                    title="SAVE"
                                    bgColor={name !== '' && description !== '' ? '#C94B32' : 'rgba(27, 43, 65, 0.2)'}
                                    className="button"
                                    fontsize={16}
                                    fontweight={400}
                                    height={40}
                                    width={350}
                                    onClick={handleSaveChanges}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkspaceInfo;