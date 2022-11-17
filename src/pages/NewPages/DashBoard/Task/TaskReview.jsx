import { useState, useEffect, useMemo } from 'react';
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import './TaskReview.css';
import { CgClose } from 'react-icons/cg';
import { IoIosArrowBack } from 'react-icons/io'

import bigMember from '../../../../assets/svg/bigMember.svg';

import { useAppSelector, useAppDispatch } from "state/hooks";

import { assignTask, rejectTaskMember } from 'state/dashboard/actions'
import { resetAssignTaskLoader, resetRejectTaskMemberLoader } from 'state/dashboard/reducer';

const TaskReview = ({ task, close }) => {

    const dispatch = useAppDispatch();
    const { DAO } = useAppSelector((state) => state.dashboard);

    const taskSubmissions = useMemo(() => {
        if(task)
            return _get(task, 'members', []).filter(member => member.submission)
        return []
    }, [task])

    const renderSingleSubmission = () => {

    }

    return (
        <div className="task-review-overlay">
            <div className="task-review-container">
                <div className="task-review-header">
                    <span>{task.name}</span>
                    <button onClick={close}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div className='task-review-slider'>
                    <div className='slider-controls'>
                        {/* <button className='control-btn' onClick={handleBack}>
                            <IoIosArrowBack size={20} color="#C94B32" />
                        </button> */}
                    </div>
                    <div className='slider-content'>
                        {
                            taskSubmissions.length == 0 ?
                            renderSingleSubmission(taskSubmissions[0]) : null
                        }
                    </div>
                    <div className='slider-controls'>
                        {/* <button className='control-btn' style={{ transform: 'rotate(180deg)' }} onClick={handleNext}>
                            <IoIosArrowBack size={20} color="#C94B32" />
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskReview;