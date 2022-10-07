import './Settings.css';
import settingIcon from '../../assets/svg/settingsXL.svg';
import editIcon from '../../assets/svg/editButton.svg';
import copy from '../../assets/svg/copyIcon.svg';
import logo from '../../assets/svg/lomadsLogoExpand.svg';
import { CgClose } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "state/hooks";

const Settings = () => {

    const navigate = useNavigate();
    const { DAO } = useAppSelector((state) => state.dashboard);

    return (
        <div className='settings-page'>
            <div className='settings-left-bar'>
                <div className='logo-container'>
                    <p>HG</p>
                </div>
                <img src={settingIcon} />
            </div>
            <div className='settings-center'>
                <div className='settings-header'>
                    <h1>Settings</h1>
                    <p>You're an&nbsp;<span>Admin</span></p>
                </div>

                <div className='settings-organisation'>
                    <div className='organisation-name'>
                        <h1>Organisation's Name</h1>
                        <button>
                            <img src={editIcon} alt="edit-icon" />
                        </button>
                    </div>

                    <div className='organisation-desc'>
                        <p>DAO’s description</p>
                    </div>

                    <div className='organisation-link'>
                        <button>
                            <img src={copy} alt="copy" />
                        </button>
                        <p>https://...daoname</p>
                    </div>

                    <div className='organisation-policy'>
                        <p>Membership policy :</p>
                        <div>
                            <input type='checkbox' />
                            <span>WHITELISTED</span>
                        </div>
                    </div>
                </div>

                <div className='settings-links'>
                    <div className='links-header'>
                        <h1>Links</h1>
                        <button>
                            <img src={editIcon} alt="edit-icon" />
                        </button>
                    </div>
                    <span>Will display on the top of the dashboard</span>
                    <div className='link-body'>
                        <div>
                            <button>
                                LINK NAME
                            </button>
                            <p>https://linkname</p>
                        </div>
                        <div>
                            <button>
                                LINK NAME
                            </button>
                            <p>https://linkname</p>
                        </div>
                    </div>
                </div>

                <div className='settings-token'>
                    <h1>Pass Tokens</h1>
                    {
                        DAO?.sbt
                            ?
                            <p>SBT : {DAO?.sbt}</p>
                            :
                            <>
                                <p>The organisation doesn’t have token yet</p>
                                <button onClick={() => navigate('/sbt/create')}>configure pass token</button>
                            </>
                    }
                </div>

                <div className='settings-footer'>
                    <p>Powered by <span>Gnosis Safe</span></p>
                    <img src={logo} alt="logo" />
                </div>
            </div>
            <div className='settings-right-bar'>
                <button onClick={() => navigate(-1)}>
                    <CgClose color='#FFF' size={24} />
                </button>
            </div>
        </div>
    )
}

export default Settings;