import React from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import '../../styles/pages/ArchiveProjects.css';

import { useAppSelector } from "state/hooks";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import useTerminology from 'hooks/useTerminology';

import RangeSlider from 'components/RangeSlider';
import moment from "moment";

const ArchiveKRA = () => {
    const navigate = useNavigate();
    const { DAO, Project } = useAppSelector((state) => state.dashboard);
    console.log("Project : ", Project);
    const { transformTask, transformWorkspace } = useTerminology(_get(DAO, 'terminologies', null))
    const daoName = _get(DAO, 'name', '').split(" ");

    const handleAccordion = (index) => {
        const panel = document.getElementById(`panel${index}`);
        const arrow = document.getElementById(`arrow${index}`);
        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        }
        else {
            panel.style.display = "flex";
            panel.style.flexWrap = "wrap";
            arrow.style.transform = 'rotate(90deg)';
        }
    }

    const renderAverage = (arr) => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i].progress;
        }

        return (sum / arr.length).toFixed(2);
    }

    return (
        <div className="archive-container">
            <div className="home-btn" onClick={() => navigate(-1)}>
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

            <div className="archive-header">
                <div className="archive-heading-box">
                    <div className="left" onClick={() => navigate(-1)}>
                        <IoIosArrowBack size={20} color="#C94B32" />
                    </div>
                    <div className="right">
                        <p>Archived <span>Key Results</span></p>
                    </div>
                </div>
            </div>

            <div className="archive-body" style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    _get(Project, 'kra.tracker', []).map((item, index) => {
                        return (
                            <div className="accordion-wrapper" key={index}>
                                <button class="accordion" onClick={() => handleAccordion(index)}>
                                    <h1>{moment.unix(item.start).format("MM/DD/YYYY")}</h1>
                                    <div>
                                        <h1>{renderAverage(item.results)}%</h1>
                                        <IoIosArrowForward size={20} color="#76808D" id={`arrow${index}`} />
                                    </div>
                                </button>
                                <div class="panel" id={`panel${index}`} style={{ display: 'none' }}>
                                    <>
                                        {
                                            item.results.map((_item, _index) => {
                                                return (
                                                    <div className="panel-div" key={_index}>
                                                        <h1>{_item.name}</h1>
                                                        <div className="progress-wrapper">
                                                            <div style={{ flex: 1, maxWidth: 250 }}>
                                                                <RangeSlider
                                                                    defaultValue={_item.progress}
                                                                    showThumb={false}
                                                                    disabled={true}
                                                                    onChange={({ value, color }) => {
                                                                        console.log("hello")
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="progress-text">{_item.progress}% done</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ArchiveKRA;