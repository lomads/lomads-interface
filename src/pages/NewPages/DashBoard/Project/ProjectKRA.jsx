import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './ProjectKRA.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/kra.svg';

import SimpleInputField from "UIpack/SimpleInputField";

const ProjectKRA = ({ toggleShowKRA, getResults, list, freq }) => {

    const [frequency, setFrequency] = useState(freq ? freq : 'daily');
    const [resultCount, setResultCount] = useState(list.length > 0 ? list.length : 1);
    const [results, setResults] = useState(list.length > 0 ? list : [{ name: '' }]);

    const handleChangeFrequency = (e) => {
        setFrequency(e.target.value);
    }

    const onChangeNumberOfResults = (e) => {
        let n = parseInt(e.target.value);
        setResultCount(n);
        let array = results;

        if (array.length === 0) {
            for (var i = 0; i < n; i++) {
                array.push({ name: '', progress: '' });
            }
        }
        else if (n > array.length) {
            let count = n - array.length;
            for (var i = 0; i < count; i++) {
                array.push({ name: '', progress: '' });
            }
        }
        else if (n < array.length) {
            let count = array.length - n;
            for (var i = 0; i < count; i++) {
                array.pop();
            }
        }
        setResults(array);
    };

    const handleChangeName = (e, index) => {
        let element = document.getElementById(`name${index}`);
        element.innerHTML = "";
        const newArray = results.map((item, i) => {
            if (i === index) {
                return { ...item, name: e };
            } else {
                return item;
            }
        });
        setResults(newArray);
    }

    const handleSubmit = () => {
        let flag = 0;
        for (let i = 0; i < results.length; i++) {
            let ob = results[i];
            if (ob.name === '') {
                flag = -1;
                let e = document.getElementById(`name${i}`);
                e.innerHTML = "Enter name";
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
                return;
            }
        }
        if (flag !== -1) {
            getResults(results, frequency);
            toggleShowKRA();
        }
    }

    return (
        <div className="kraOverlay">
            <div className="kraContainer">
                <div className='kra-header'>
                    <button onClick={() => toggleShowKRA()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                    <div className='kra-body'>
                        <img src={createTaskSvg} alt="frame-icon" />
                        <h1>Key Results</h1>
                        <span>Set objective for your team</span>

                        <div className='kra-inputRow' style={{ width: '320px' }}>
                            <span>Review Frequency</span>
                            <select
                                name="project"
                                id="project"
                                className="tokenDropdown"
                                style={{ width: '100%' }}
                                defaultValue={frequency}
                                onChange={handleChangeFrequency}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div className='kra-inputRow' style={{ marginBottom: '0', width: '320px' }}>
                            <span>N° of key results</span>
                            <select
                                name="project"
                                id="project"
                                className="tokenDropdown"
                                style={{ width: '100%' }}
                                defaultValue={resultCount}
                                onChange={onChangeNumberOfResults}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                        </div>

                        {results.length > 0 && <div className='hr-line'></div>}

                        {
                            results.map((item, index) => {
                                return (
                                    <div className='kra-card'>
                                        <h1 style={{ marginBottom: '25px' }}>Key result {index + 1}</h1>

                                        <div className='kra-inputRow' style={{ margin: '0' }}>
                                            <span>Name</span>
                                            <SimpleInputField
                                                className="inputField"
                                                id="nameInput"
                                                height={50}
                                                width={'100%'}
                                                value={item.name}
                                                onchange={(e) => handleChangeName(e.target.value, index)}
                                            />
                                            <span id={`name${index}`} style={{ fontSize: '13px', color: '#C84A32', fontStyle: 'normal' }}></span>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='kra-footer'>
                        <button onClick={() => toggleShowKRA()}>
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

export default ProjectKRA;