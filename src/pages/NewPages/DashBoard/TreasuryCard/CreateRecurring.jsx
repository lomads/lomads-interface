import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './CreateRecurring.css';
import { CgClose } from 'react-icons/cg'
import createProjectSvg from '../../../../assets/svg/createProject.svg';
import recurrent from '../../../../assets/svg/recurring_payment_XL.svg';

import SimpleInputField from "UIpack/SimpleInputField";
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
import polygonIcon from 'assets/svg/polygon.svg';

import { useAppSelector, useAppDispatch } from "state/hooks";

import { useWeb3React } from "@web3-react/core";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { SupportedChainId } from "constants/chains";
import { beautifyHexToken, getSafeTokens } from '../../../../utils'

import useRole from '../../../../hooks/useRole'

import axios from "axios";
import { isValidUrl } from 'utils';
import useGnosisAllowance from "hooks/useGnosisAllowance";

const CreateRecurring = ({ toggleShowCreateRecurring }) => {

    const dispatch = useAppDispatch();
    const { DAO, user, } = useAppSelector((state) => state.dashboard);
    const { chainId, provider, account } = useWeb3React();
    const { myRole, can } = useRole(DAO, account);

    const { setAllowance } = useGnosisAllowance(_get(DAO, 'safe.address', null));

    const [showSuccess, setShowSuccess] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState('');

    const eligibleContributors = useMemo(() => {
        return _get(DAO, 'members', []).filter(m => m.member._id !== user._id);
    }, [DAO, selectedUser])

    const handleCreateRecurringPayment = () => {

    }

    return (
        <div className="recurringOverlay">
            <div className="recurringContainer">
                <div className='recurring-header'>
                    <button onClick={() => toggleShowCreateRecurring()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                {
                    showSuccess
                        ?
                        <div className='recurring-success'>
                            <img src={recurrent} alt="frame-icon" />
                            <h1>Success!</h1>
                            <span>New recurring payment created.<br />You will be redirected in a few seconds.</span>
                        </div>
                        :
                        <>
                            <div className='recurring-body'>
                                <img src={recurrent} alt="frame-icon" />
                                <h1>Recurring Payment</h1>

                                <div className='recurring-inputRow'>
                                    <span>Receiver</span>
                                    <select
                                        name="member"
                                        id="member"
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                    // onChange={(e) => handleSetApplicant(e.target.value)}
                                    >
                                        <option value={null}>Select member</option>
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

                                <div className='recurring-inputRow'>
                                    <span>Amount</span>
                                    <div className='picker-container' style={{ margin: '0' }}>
                                        <div className='currency'>
                                            <div className='currency-container'>
                                                <img src={polygonIcon} style={{ margin: '0' }} />
                                                <div>MATIC</div>
                                            </div>
                                        </div>
                                        <div className='number-input'>
                                            <NumberInput style={{ width: (64 + 50), height: 50, borderRadius: '0px 10px 10px 0px', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)' }} step={1} min={0}>
                                                <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 64, backgroundColor: '#F5F5F5', borderRadius: '0', borderWidth: 0 }} />
                                                <NumberInputStepper style={{ width: 50, backgroundColor: 'transparent', borderRadius: '0px 10px 10px 0px' }}>
                                                    <NumberIncrementStepper color="#C94B32" />
                                                    <NumberDecrementStepper color="#C94B32" style={{ borderTopWidth: 0 }} />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </div>
                                    </div>
                                </div>

                                <div className='recurring-inputRow'>
                                    <span>Frequency</span>
                                    <select
                                        name="frequency"
                                        id="frequency"
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                    // onChange={(e) => handleSetApplicant(e.target.value)}
                                    >
                                        <option value={'Weekly'}>Weekly</option>
                                        <option value={'Monthly'}>Monthly</option>
                                    </select>
                                    <span className='error-msg' id="error-startDate"></span>
                                </div>

                                <div className='recurring-inputRow'>
                                    <span>Start Date</span>
                                    <SimpleInputField
                                        className="inputField"
                                        id="deadlineInput"
                                        height={50}
                                        width={'100%'}
                                        placeholder="Start Date"
                                        value={startDate}
                                        type="date"
                                        onchange={(e) => { setStartDate(e.target.value); document.getElementById('error-startDate').innerHTML = '' }}
                                    />
                                    <span className='error-msg' id="error-startDate"></span>
                                </div>

                            </div>

                            <div className='recurring-footer'>
                                <button>
                                    CANCEL
                                </button>
                                <button onClick={() => handleCreateRecurringPayment()}>
                                    SAVE
                                </button>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default CreateRecurring;