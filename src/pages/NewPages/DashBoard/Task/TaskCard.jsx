import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { MdKeyboardArrowRight } from 'react-icons/md';

import calendarIcon from '../../../../assets/svg/calendar.svg'
import moment from "moment";

import assign from '../../../../assets/svg/assign.svg'
import open from '../../../../assets/svg/open.svg'

const TaskCard = ({ task, daoUrl }) => {
    const navigate = useNavigate();

    return (
        <div className='tasks-card' onClick={() => navigate(`/${daoUrl}/task/${task._id}`, { state: { task } })}>
            <div>
                <p className="p-name">Project Name</p>
            </div>
            <div>
                <p className="t-name">{task.name}</p>
            </div>
            <div>
                <div>
                    {
                        task.taskStatus === 'assigned'
                            ?
                            <img src={assign} style={{ marginRight: '5px' }} />
                            :
                            <img src={open} style={{ marginRight: '5px' }} />
                    }
                    <p
                        className="task-status"
                        style={task.taskStatus === 'assigned' ? { color: '#0EC1B0' } : { color: '#4BA1DB' }}
                    >
                        {task.taskStatus}
                    </p>
                </div>
                <span>
                    <img src={calendarIcon} alt="calendarIcon" />
                    {moment(task.deadline).fromNow()}
                </span>
            </div>

        </div>
    )
}

export default TaskCard;