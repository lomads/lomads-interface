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
import moment from 'moment';

const colors = ['#e67c40', '#e99a37', '#ebaf30', '#edcd27', '#becd33', '#8ecc3e', '#63c359', '#4fbf65', '#2ab87c', '#21a284', '#1AC1C1'];

const KRAReview = ({ toggleShowKRA, data, daoURL }) => {
    const dispatch = useAppDispatch();
    const { updateKraLoading } = useAppSelector((state) => state.dashboard);

    const [list, setList] = useState(_get(data, 'kra.results', []));
    const [currentSlot, setCurrentSlot] = useState(null);

    // runs after updating kra
    useEffect(() => {
        if (updateKraLoading === false) {
            dispatch(resetUpdateKraLoader());
            toggleShowKRA();
        }
    }, [updateKraLoading]);

    const getSlots = useMemo(() => {
        let slots = []
        let freq = data.kra.frequency === 'daily' ? 'day' : data.kra.frequency === 'weekly' ? 'week' : data.kra.frequency === 'monthly' ? 'month' : 'month';

        let start = moment(data.createdAt).startOf('day').unix()
        let end = freq === 'day' ? moment.unix(start).endOf('day').unix() : moment.unix(start).endOf('day').add(1, freq).unix()

        do {
            slots.push({ start, end })
            start = moment.unix(end).add(1, 'day').startOf('day').unix()
            end = moment.unix(start).add(1, freq).endOf('day').unix()
        } while (start < moment().unix())

        slots = slots.map(slot => {
            const tracker = _find(data.kra.tracker, t => t.start === slot.start && t.end === slot.end)
            return {
                ...slot,
                results: _get(tracker, 'results', data.kra.results.map(result => {
                    return {
                        ...result, progress: 0, color: "#FFCC18"
                    }
                }))
            }
        });

        return slots

    }, [data.frequency, data.kra])

    useEffect(() => {
        if (getSlots && getSlots.length > 0) {
            const cslot = _find(getSlots, s => s.start < moment().unix() && s.end > moment().unix())
            setCurrentSlot(cslot)
        }
    }, [getSlots])



    const handleSlider = (item, value, color) => {
        // setList(prev => prev.map((r, i) => {
        //     if (r._id === item._id)
        //         return { ...r, progress: value, color };
        //     return r;
        //  })
        // )
        setCurrentSlot(prev => {
            return {
                ...prev,
                results: prev.results.map((r, i) => {
                    if (r._id === item._id)
                        return { ...r, progress: value, color };
                    return r;
                })
            }
        })
    }

    const handleSubmit = () => {
        const kra = { ...data.kra };
        kra.tracker = getSlots.map(slot => {
            if (slot.start === currentSlot.start && slot.end === currentSlot.end)
                return currentSlot
            return slot
        })
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
                        {currentSlot && data.kra.frequency !== 'daily' && <span>Review Period: {`${moment.unix(currentSlot.start).format('DD MMM, YYYY')} - ${moment.unix(currentSlot.end).format('DD MMM, YYYY')}`}</span>}
                        {currentSlot && data.kra.frequency === 'daily' && <span>Review Period: {`${moment.unix(currentSlot.start).format('DD MMM, YYYY hh:mm A')} - ${moment.unix(currentSlot.end).format('DD MMM, YYYY hh:mm A')}`}</span>}
                        <div className='kra-section'>
                            {
                                currentSlot && currentSlot.results.map((item, index) => {
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
                                                    <RangeSlider defaultValue={+item.progress} showThumb={true} disabled={false} onChange={({ value, color }) => {
                                                        handleSlider(item, value, color)
                                                    }} />
                                                </div>
                                                <div style={{ marginLeft: '16px' }}>
                                                    <h1 style={{ color: _get(item, 'color', '#FFCC18') }}>{`${item.progress}% done!`}</h1>
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