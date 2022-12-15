import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce, uniqBy as _uniqBy } from 'lodash';
import './ProjectMilestone.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/milestone.svg';
import memberIcon from '../../../../assets/svg/memberIcon.svg';

import { ReactComponent as ArrowDown } from "../../../../assets/images/dropdown.svg";
import { ReactComponent as PolygonIcon } from '../../../../assets/svg/polygon.svg';
import { ReactComponent as StarIcon } from '../../../../assets/svg/star.svg';
import { ReactComponent as DropdownRed } from '../../../../assets/images/dropdown-red.svg';
import { ReactComponent as DropupRed } from '../../../../assets/images/dropup-red.svg';

import { Editor } from '@tinymce/tinymce-react';

import {
    Input,
    FormControl,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    Select
} from "@chakra-ui/react";

import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { SupportedChainId } from "constants/chains";

import SafeButton from "UIpack/SafeButton";
import SimpleInputField from "UIpack/SimpleInputField";

const AssignContributions = ({ toggleShowAssign, data }) => {

    const { DAO, Project } = useAppSelector((state) => state.dashboard);
    const { chainId, account } = useWeb3React();

    const [compensation, setCompensation] = useState(_get(data, 'compensation', null));

    const handleFocusInput = (index) => {
        const e = document.getElementById(`input${index}`);
        e.focus();
    }

    const handleChange = (e, index) => {
        let num = parseFloat(e.target.value);
        const amountElement = document.getElementById(`amount${index}`);

        amountElement.innerHTML = ((num / 100) * compensation?.amount).toFixed(2);
    }

    const handleSplitEqually = () => {
        _uniqBy(Project?.members, '_id').map((_, index) => {
            const amountElement = document.getElementById(`amount${index}`);
            const percentElement = document.getElementById(`input${index}`);
            let amount = (compensation?.amount / Project?.members?.length).toFixed(2);
            let percent = ((amount / compensation?.amount) * 100).toFixed(2);
            percentElement.value = percent;
            amountElement.innerHTML = amount;
        })
    }

    return (
        <div className="milestoneOverlay">
            <div className="milestoneContainer">
                <div className='milestone-header'>
                    <button onClick={() => toggleShowAssign()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                    <div className='milestone-body'>
                        <img src={createTaskSvg} alt="frame-icon" />
                        <h1>Assign Contributions</h1>
                        <span>Mark the milestone as completed and reward the contributors</span>

                        <SafeButton
                            height={40}
                            width={260}
                            titleColor="#C94B32"
                            title="SPLIT EQUALLY"
                            bgColor="#FFFFFF"
                            opacity="1"
                            disabled={false}
                            fontweight={400}
                            fontsize={16}
                            onClick={handleSplitEqually}
                        />

                        <div className='members-section'>
                            {
                                _uniqBy(Project?.members, '_id').map((item, index) => (
                                    <div className='member-row'>
                                        <div>
                                            <img src={memberIcon} alt="memberIcon" />
                                            <span>{item.name}</span>
                                        </div>
                                        <div>
                                            <div className='input-wrapper' onClick={() => handleFocusInput(index)}>
                                                <input type={"number"} min={0} max={100} id={`input${index}`} onClick={(e) => e.stopPropagation()} onChange={(e) => handleChange(e, index)} /> %
                                            </div>
                                        </div>
                                        <div>
                                            <h1> = <span style={{ fontWeight: 'bold' }} id={`amount${index}`}>0</span> {compensation?.symbol}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                    <div className='milestone-footer'>
                        <button onClick={() => toggleShowAssign()}>
                            CANCEL
                        </button>
                        <button>
                            COMPLETE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignContributions;