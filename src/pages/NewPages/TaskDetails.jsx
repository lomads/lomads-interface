import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import '../../styles/pages/TaskDetails.css';

import Footer from "components/Footer";

import { useAppSelector, useAppDispatch } from "state/hooks";

import { IoIosArrowBack } from 'react-icons/io'
import { GoKebabVertical } from 'react-icons/go'
import { BsFillRecordCircleFill } from 'react-icons/bs'
import { SiNotion } from "react-icons/si";

import editToken from '../../assets/svg/editToken.svg';
import compensationStar from '../../assets/svg/compensationStar.svg';
import calendarIcon from '../../assets/svg/calendar.svg'
import applicants from '../../assets/svg/applicants.svg'
import folder from '../../assets/svg/folder.svg'

const TaskDetails = () => {

    const { DAO } = useAppSelector((state) => state.dashboard);
    const daoName = _get(DAO, 'name', '').split(" ");

    return (
        <>
            <div
                className='taskDetails-container'
            >
                <div className="info">

                    <div className="home-btn">
                        <div className="invertedBox">
                            <div className="navbarText">
                                {
                                    daoName.length === 1
                                        ? daoName[0].charAt(0)
                                        : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)
                                }
                            </div>
                        </div>
                    </div>


                    <div className="taskDetails-top">
                        <h1>Project Name</h1>

                        <div className="taskDetails-header">
                            <div className="header-name">
                                <div className="left">
                                    <IoIosArrowBack size={20} color="#C94B32" />
                                </div>
                                <div className="right">
                                    <h1>Task Name</h1>
                                    <div className="menu">

                                        <div>
                                            <BsFillRecordCircleFill color="#4BA1DB" size={20} />
                                            <span>Open</span>
                                        </div>

                                        <button>
                                            <img src={editToken} alt="hk-logo" />
                                        </button>

                                        <button className="applicants-btn">
                                            SELECT APPLICANTS
                                        </button>

                                        <button className="kebab-btn">
                                            <GoKebabVertical size={24} color="#76808D" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="header-others">
                                <button className="other-btn">
                                    <SiNotion color="#B12F15" size={20} style={{ marginRight: '5px' }} />
                                    CHAT
                                </button>
                                <button className="other-btn">
                                    <img src={folder} />
                                    SUBMISSION
                                </button>

                                <div>
                                    <span>Compensation</span>
                                    <img src={compensationStar} />
                                    <span>24 points</span>
                                </div>

                                <div className="v-line"></div>

                                <div>
                                    <span>Deadline</span>
                                    <img src={calendarIcon} alt="calendarIcon" />
                                    <span>15/04/2022</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="taskDetails-body">
                        <div className="body-left">
                            <h1>Description</h1>
                            <span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla </span>
                        </div>
                        <div className="body-right">
                            <div>
                                <img src={applicants} />
                                <span>5</span>
                            </div>
                            <h1>Applicants</h1>
                            <button>CHECK</button>
                        </div>
                    </div>

                </div>
                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default TaskDetails;