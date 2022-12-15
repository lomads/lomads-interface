import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './ProjectMilestone.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/milestone.svg';

import SimpleInputField from "UIpack/SimpleInputField";

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

import polygonIcon from 'assets/svg/polygon.svg';
import starIcon from 'assets/svg/star.svg';
import moment from 'moment';

import { beautifyHexToken, getSafeTokens } from '../../../../utils'
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { SupportedChainId } from "constants/chains";

const ProjectMilestone = ({ toggleShowMilestone, getMilestones, getCompensation, list }) => {

    const { DAO } = useAppSelector((state) => state.dashboard);
    const { chainId, account } = useWeb3React();
    const editorRef = useRef(null);

    const [milestoneCount, setMilestoneCount] = useState(list.length > 0 ? list.length : 1);

    const [milestones, setMilestones] = useState(list.length > 0 ? list : [{ name: '', amount: '', deadline: '', deliverables: '', complete: false }]);

    const [safeTokens, setSafeTokens] = useState([]);

    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        getTokens(_get(DAO, 'safe.address'));
        return () => { };
    }, [DAO]);

    const getTokens = async (safeAddress) => {
        const tokens = await getSafeTokens(chainId, safeAddress)
        console.log("Tokens : ", tokens);
        setSafeTokens(tokens)
    };

    useEffect(() => {
        var date = new Date();
        var tdate = date.getDate();
        var month = date.getMonth() + 1;
        if (tdate < 10) {
            tdate = "0" + tdate;
        }
        if (month < 10) {
            month = "0" + month
        }
        var year = date.getUTCFullYear();
        var minDate = year + "-" + month + "-" + tdate;
        document.getElementById("datepicker").setAttribute("min", minDate);
    }, [])

    const onChangeNumberOMilestones = (e) => {
        let n = parseInt(e.target.value);
        setMilestoneCount(n);
        let array = milestones;

        if (array.length === 0) {
            for (var i = 0; i < n; i++) {
                array.push({ name: '', amount: '', deadline: '', deliverables: '', complete: false });
            }
        }
        else if (n > array.length) {
            let count = n - array.length;
            for (var i = 0; i < count; i++) {
                array.push({ name: '', amount: '', deadline: '', deliverables: '', complete: false });
            }
        }
        else if (n < array.length) {
            let count = array.length - n;
            for (var i = 0; i < count; i++) {
                array.pop();
            }
        }
        setMilestones(array);
    };

    const handleChangeName = (e, index) => {
        let element = document.getElementById(`name${index}`);
        element.innerHTML = "";
        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, name: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleChangeAmount = (e, index) => {
        let element = document.getElementById(`amount${index}`);
        element.innerHTML = "";
        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, amount: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleChangeDeadline = (e, index) => {
        let element = document.getElementById(`deadline${index}`);
        element.innerHTML = "";

        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, deadline: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleChangeDeliverables = (e, index) => {
        let element = document.getElementById(`deliverables${index}`);
        element.innerHTML = "";
        const newArray = milestones.map((item, i) => {
            if (i === index) {
                return { ...item, deliverables: e };
            } else {
                return item;
            }
        });
        setMilestones(newArray);
    }

    const handleSubmit = () => {
        let flag = 0;
        for (let i = 0; i < milestones.length; i++) {
            let ob = milestones[i];
            if (ob.name === '') {
                flag = -1;
                let e = document.getElementById(`name${i}`);
                e.innerHTML = "Enter name";
                return;
            }
            else if (ob.amount === '') {
                flag = -1;
                let e = document.getElementById(`amount${i}`);
                e.innerHTML = "Enter amount in %";
                return;
            }
            else if (ob.deadline === '') {
                flag = -1;
                let e = document.getElementById(`deadline${i}`);
                e.innerHTML = "Enter deadline";
                return;
            }
            else if (ob.deliverables === '') {
                flag = -1;
                let e = document.getElementById(`deliverables${i}`);
                e.innerHTML = "Enter deliverables";
                return;
            }
        }
        if (flag !== -1) {
            let symbol = _find(safeTokens, tkn => tkn.tokenAddress === currency)
            symbol = _get(symbol, 'token.symbol', null)
            if (!symbol)
                symbol = currency === process.env.REACT_APP_MATIC_TOKEN_ADDRESS ? 'MATIC' : currency === process.env.REACT_APP_GOERLI_TOKEN_ADDRESS ? 'GOR' : 'SWEAT'

            getCompensation({ currency: currency, amount, symbol })
            getMilestones(milestones);
            toggleShowMilestone();
        }
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

                        <div className='milestone-inputRow' style={{ marginBottom: '20px', width: '320px' }}>
                            <span>Total Project Value</span>
                            <div className='picker-container'>
                                <Select defaultValue={currency} onChange={e => { setCurrency(e.target.value); console.log(e.target.value) }} bg='#FFFF' color='#76808D' variant='unstyled' style={{ borderRadius: '10px 0px 0px 10px', borderWidth: 1, borderRightWidth: 0, borderColor: 'rgba(27, 43, 65, 0.1)', height: 50, padding: '0px 50px 0px 20px' }} iconSize={15} icon={<ArrowDown />}>
                                    <option value="" selected disabled>Select currency</option>
                                    {
                                        safeTokens.map((result, index) => {
                                            return (
                                                (
                                                    <option value={result.tokenAddress ? result.tokenAddress : chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS} key={index}>
                                                        {chainId === SupportedChainId.POLYGON ? <PolygonIcon /> : ''}
                                                        {_get(result, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}
                                                    </option>
                                                )
                                            );
                                        })}
                                </Select>
                                <div className='number-input'>
                                    <NumberInput onChange={(e) => setAmount(parseFloat(e))} defaultValue={0} style={{ width: (64 + 50), height: 50, borderWidth: 1, borderColor: 'rgba(27, 43, 65, 0.1)', borderRightWidth: 0, borderRadius: '0px 10px 10px 0px' }} step={1} min={0}>
                                        <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 64, borderWidth: 0, background: '#F5F5F5' }} />
                                        <NumberInputStepper style={{ width: 50, backgroundColor: 'transparent' }}>
                                            <NumberIncrementStepper color="#C94B32" children={<DropupRed />} />
                                            <NumberDecrementStepper color="#C94B32" children={<DropdownRed />} style={{ borderTopWidth: 0 }} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </div>

                            </div>
                        </div>

                        <div className='milestone-inputRow' style={{ marginBottom: '0', width: '320px' }}>
                            <span>Milestones</span>
                            <select
                                name="project"
                                id="project"
                                className="tokenDropdown"
                                style={{ width: '100%' }}
                                onChange={onChangeNumberOMilestones}
                                defaultValue={milestoneCount}
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

                                        <div className='milestone-inputRow'>
                                            <span>Name</span>
                                            <div style={{ width: '170px' }}>
                                                <SimpleInputField
                                                    className="inputField"
                                                    height={50}
                                                    width={'100%'}
                                                    value={item.name}
                                                    onchange={(e) => handleChangeName(e.target.value, index)}
                                                />
                                            </div>
                                            <span id={`name${index}`} style={{ fontSize: '13px', color: '#C84A32', fontStyle: 'normal' }}></span>
                                        </div>

                                        <div className='milestone-inputRow' style={{ height: '75px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '70px' }}>
                                                    <SimpleInputField
                                                        className="inputField"
                                                        id="nameInput"
                                                        height={50}
                                                        width={'100%'}
                                                        value={item.amount}
                                                        onchange={(e) => handleChangeAmount(e.target.value, index)}
                                                        placeholder={`${100 / milestoneCount}`}
                                                    />
                                                </div>
                                                <span style={{ margin: '0', marginLeft: '14px' }}>% of Project value</span>
                                            </div>
                                            <span id={`amount${index}`} style={{ fontSize: '13px', color: '#C84A32', fontStyle: 'normal' }}></span>
                                        </div>

                                        <div className='milestone-inputRow'>
                                            <span>Deadline</span>
                                            <div style={{ width: '170px' }}>
                                                <SimpleInputField
                                                    id="datepicker"
                                                    className="inputField"
                                                    height={50}
                                                    width={'100%'}
                                                    placeholder="Deadline"
                                                    type="date"
                                                    value={item.deadline}
                                                    onchange={(e) => handleChangeDeadline(e.target.value, index)}
                                                />
                                            </div>
                                            <span id={`deadline${index}`} style={{ fontSize: '13px', color: '#C84A32', fontStyle: 'normal' }}></span>
                                        </div>


                                        <div className='milestone-inputRow' style={{ height: '200px' }}>
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
                                                value={item.deliverables}
                                                onEditorChange={(text) => handleChangeDeliverables(text, index)}
                                            />
                                            <span id={`deliverables${index}`} style={{ fontSize: '13px', color: '#C84A32', fontStyle: 'normal' }}></span>
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