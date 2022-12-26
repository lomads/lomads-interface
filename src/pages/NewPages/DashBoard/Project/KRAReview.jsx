import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './ProjectKRA.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/kra.svg';

import SimpleLoadButton from "UIpack/SimpleLoadButton";

import { useAppSelector, useAppDispatch } from "state/hooks";

import { updateKRA } from "state/dashboard/actions";
import { resetUpdateKraLoader } from 'state/dashboard/reducer';

import RangeSlider from 'components/RangeSlider';

const colors = ['#e67c40', '#e99a37', '#ebaf30', '#edcd27', '#becd33', '#8ecc3e', '#63c359', '#4fbf65', '#2ab87c', '#21a284', '#1AC1C1'];

const KRAReview = ({ toggleShowKRA, data, daoURL }) => {
    const dispatch = useAppDispatch();
    const { updateKraLoading } = useAppSelector((state) => state.dashboard);

    const [list, setList] = useState(_get(data, 'kra.results', []));

    // runs after updating kra
    useEffect(() => {
        if (updateKraLoading === false) {
            dispatch(resetUpdateKraLoader());
            toggleShowKRA();
        }
    }, [updateKraLoading]);
    

    useEffect(() => {
        if (_get(data, 'kra.results', []).length > 0) {
            setList(_get(data, 'kra.results', []))
        }
    }, [data]);

    const handleSlider = (item, value, color) => {
        setList(prev => prev.map((r, i) => {
            if (r._id === item._id)
                return { ...r, progress: value, color };
            return r;
         })
        )
    }

    const handleSubmit = () => {
        const kra = {};
        kra.frequency = _get(data, 'kra.frequency', '');
        kra.results = list;
        dispatch(updateKRA({ projectId: data._id, daoUrl: daoURL, payload: { kra } }));
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
                        <span>It’s time to evaluate your scores</span>

                        <div className='kra-section'>
                            {
                                list && list.map((item, index) => {
                                    return (
                                        <div className='review-card'>
                                            <h1>{item.name}</h1>
                                            <div className='review-slider-section'>
                                                {/* custom slider */}
                                                {/* <div className='range-slider'>
                                                    <input type="range" min={0} max={100} step={10} value={item.progress} className="slider-rc" id={`slider-rc${index}`} onChange={(e) => handleSlider(e, index)} />
                                                    <div className='slider-thumb' id={`slider-thumb${index}`}>
                                                        <div className='thumb-bar'></div>
                                                    </div>
                                                    <div className='progress' id={`progress${index}`}></div>
                                                </div> */}
                                                <div style={{ flex: 1, maxWidth: 200 }}>
                                                    <RangeSlider defaultValue={+item.progress} onChange={({ value, color }) => {
                                                        handleSlider(item, value, color)
                                                    }}/>
                                                </div>
                                                <div style={{ marginLeft: '16px' }}>
                                                    <h1 style={{ color: _get(item, 'color' , '#FFCC18') }}>{ `${item.progress}% done!` }</h1>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                    <div className='kra-footer'>
                        <button onClick={() => toggleShowKRA()}>
                            LATER
                        </button>
                        <SimpleLoadButton
                            title="SUBMIT"
                            height={40}
                            width={180}
                            fontsize={16}
                            fontweight={400}
                            onClick={handleSubmit}
                            bgColor={"#C94B32"}
                            condition={updateKraLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KRAReview;