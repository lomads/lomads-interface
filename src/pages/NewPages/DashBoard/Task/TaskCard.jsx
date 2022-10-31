import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { MdKeyboardArrowRight } from 'react-icons/md';

import calendarIcon from '../../../../assets/svg/calendar.svg'

const TaskCard = () => {
    const navigate = useNavigate();

    return (
        <div className='tasks-card'>
            <div>
                <p className="p-name">Project Name</p>
                <span>
                    <img src={calendarIcon} alt="calendarIcon" />
                    15/04/2022
                </span>
            </div>
            <div>
                <p className="t-name">Task Name</p>
                <MdKeyboardArrowRight color='#B12F15' size={24} />
            </div>

        </div>
    )
}

export default TaskCard;