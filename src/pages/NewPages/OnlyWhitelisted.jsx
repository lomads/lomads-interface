
import "../../styles/pages/MintPassToken.css";
import { get as _get } from 'lodash'
import frame2 from '../../assets/svg/Frame-2.svg'
import Footer from "components/Footer";

const OnlyWhitelisted = () => {
    return (
        <>
            <div className="mintPassToken-container">
                <div className="mintPassToken-body" style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
                    <img src={frame2} alt="frame2" />
                    <p className="notAllowedText">This organisation allows membership only for <br />whitelisted individuals. </p>
                    <span className="notAllowedText2">Please contact the admin through email or other social channels.</span>
                </div>
                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default OnlyWhitelisted;