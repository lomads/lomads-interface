import React from "react";
import '../../styles/Footer.css';

import logo from '../../assets/svg/lomadsGray.svg';
import polygonGray from '../../assets/svg/polygonGray.svg';
import safeGray from '../../assets/svg/safeGray.svg';
import ipfsGray from '../../assets/svg/ipfsGray.svg';

import logoWhite from '../../assets/svg/lomadsWhite.svg';
import polygonWhite from '../../assets/svg/polygonWhite.svg';
import safeWhite from '../../assets/svg/safeWhite.svg';
import ipfsWhite from '../../assets/svg/ipfsWhite.svg';

const Footer = ({ theme }) => {
    return (
        <div className='footer'>
            <div className="left-section">
                <p style={theme === 'light' ? { color: '#FFF' } : { color: '#76808D' }}>Powered by</p>
                {
                    theme === 'light'
                        ?
                        <>
                            <img src={polygonWhite} alt="polygon-white" />
                            <img src={safeWhite} alt="polygon-white" />
                            <img src={ipfsWhite} alt="polygon-white" />
                        </>
                        :
                        <>
                            <img src={polygonGray} alt="polygon-gray" />
                            <img src={safeGray} alt="polygon-gray" />
                            <img src={ipfsGray} alt="polygon-gray" />
                        </>
                }
            </div>
            <div className="right-section">
                <p style={theme === 'light' ? { color: '#FFF' } : { color: '#76808D' }}>made with <span style={{ color: 'red' }}>❤️</span> by</p>
                {
                    theme === 'light'
                        ?
                        <img src={logoWhite} alt="lomads-logo-white" />
                        :
                        <img src={logo} alt="lomads-logo-dark" />
                }
            </div>
        </div>
    )
}

export default Footer;