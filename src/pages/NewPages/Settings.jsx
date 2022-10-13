import { useState, useEffect, useMemo } from 'react';
import './Settings.css';
import { get as _get, find as _find } from 'lodash';
import settingIcon from '../../assets/svg/settingsXL.svg';
import editIcon from '../../assets/svg/editButton.svg';
import copy from '../../assets/svg/copyIcon.svg';
import logo from '../../assets/svg/lomadsLogoExpand.svg';
import { CgClose } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import { useSBTStats } from "hooks/SBT/sbt";
import coin from '../../assets/svg/coin.svg';

const Settings = () => {

    const navigate = useNavigate();
    const [update, setUpdate] = useState(0);
    const { provider, account } = useWeb3React();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { balanceOf, contractName } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '');
    console.log("DAO data : ", DAO);
    const daoName = _get(DAO, 'name', '').split(" ");

    useEffect(() => {
        if (contractName !== '') {
            if (DAO?.sbt && parseInt(balanceOf._hex, 16) === 0) {
                navigate(`/sbt/mint/${DAO.sbt.address}`);
            }
        }
    }, [DAO, balanceOf, contractName]);

    const amIAdmin = useMemo(() => {
        if (DAO) {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, DAO])

    return (
        <div className='settings-page'>
            <div className='settings-left-bar'>
                <div className='logo-container'>
                    <p>
                        {
                            daoName.length === 1
                                ? daoName[0].charAt(0)
                                : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)
                        }
                    </p>
                </div>
                <img src={settingIcon} />
            </div>
            <div className='settings-center'>
                <div className='settings-header'>
                    <h1>Settings</h1>
                    {
                        amIAdmin
                            ?
                            <p>You're an&nbsp;<span>Admin</span></p>
                            :
                            <p>You're a&nbsp;<span>Member</span></p>
                    }
                </div>

                <div className='settings-organisation'>
                    <div className='organisation-name'>
                        <h1>{_get(DAO, 'name', '')}</h1>
                        {/* <button>
                            <img src={editIcon} alt="edit-icon" />
                        </button> */}
                    </div>

                    <div className='organisation-desc'>
                        <p>{
                            DAO.description ? DAO.description : 'DAO’s description'
                        }</p>
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
                        {/* <button>
                            <img src={editIcon} alt="edit-icon" />
                        </button> */}
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
                        DAO?.sbt?.name
                            ?
                            <div className='token-details'>
                                <button>
                                    <img src={copy} alt="copy" />
                                </button>
                                <img src={coin} alt="asset" />
                                <p>{DAO?.sbt?.name}</p>
                            </div>

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