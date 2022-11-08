import { CgClose } from 'react-icons/cg';
import { IoIosArrowBack } from 'react-icons/io'

import bigMember from '../../../../assets/svg/bigMember.svg';

const ApplicantList = ({ task, close }) => {

    const RenderApplicantCard = ({ applicant }) => {
        return (
            <>
                <img src={bigMember} alt="icon" />
                <h1>{applicant.member.name}</h1>
                <p>{applicant.member.wallet}</p>

                <div className='note-container'>
                    <span>Note</span>
                    <p>{applicant.note}</p>
                </div>
            </>
        )
    }

    return (
        <div className="applicant-overlay">
            <div className="applicant-container">

                <div className="applicant-header">
                    <span>{task.name}</span>
                    <button onClick={close}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>

                <div className='applicant-slider'>
                    <div className='slider-controls'>
                        <button className='control-btn'>
                            <IoIosArrowBack size={20} color="#C94B32" />
                        </button>
                    </div>
                    <div className='slider-content'>
                        {
                            task?.members.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <RenderApplicantCard applicant={item} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='slider-controls'>
                        <button className='control-btn' style={{ transform: 'rotate(180deg)' }}>
                            <IoIosArrowBack size={20} color="#C94B32" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ApplicantList;