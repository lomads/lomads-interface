import { useState, useEffect, useMemo } from 'react';
import './Settings.css';
import { get as _get, find as _find } from 'lodash';
import settingIcon from '../../assets/svg/settingsXL.svg';
import editIcon from '../../assets/svg/editButton.svg';
import copy from '../../assets/svg/copyIcon.svg';
import logo from '../../assets/svg/lomadsLogoExpand.svg';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import { useSBTStats } from "hooks/SBT/sbt";
import { Tooltip } from "@chakra-ui/react";
import copyIcon from "../../assets/svg/copyIcon.svg";
import { isChainAllowed } from "utils/switchChain";
import coin from '../../assets/svg/coin.svg';
import Footer from 'components/Footer';
import { AiOutlineClose } from "react-icons/ai";
import { SiNotion } from "react-icons/si";
import { HiOutlinePlus } from "react-icons/hi";
import { CgClose } from 'react-icons/cg'
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";
import AddDaoLink from './DashBoard/Settings/AddDaoLink';
import SimpleInputField from "UIpack/SimpleInputField";
import { updateDao, updateDaoLinks } from 'state/dashboard/actions';
import { resetUpdateDAOLoader, resetUpdateDaoLinksLoader } from 'state/dashboard/reducer';
import { isValidUrl } from 'utils';

const Settings = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [update, setUpdate] = useState(0);
    const { provider, chainId, account, connector } = useWeb3React();
    const { DAO, updateDaoLoading, updateDaoLinksLoading } = useAppSelector((state) => state.dashboard);
    const { balanceOf, contractName } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '');
    console.log("DAO data : ", DAO);
    const daoName = _get(DAO, 'name', '').split(" ");
    const [copy, setCopy] = useState(false);
    const [showAddLink, setShowAddLink] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editLink, setEditLink] = useState(false);
    const [name, setName] = useState(_get(DAO, 'name', ''));
    const [description, setDescription] = useState(_get(DAO, 'description', ''));
    const [daoLinks, setDaoLinks] = useState(_get(DAO, 'links', []));
    const chainAllowed = chainId && isChainAllowed(connector, chainId);

    useEffect(() => {
        if (chainId && !chainAllowed && !account) {
            navigate('/')
        }
    }, [chainId, account, chainAllowed, navigate]);

    useEffect(() => {
        if (contractName !== '' && balanceOf) {
            if (DAO?.sbt && parseInt(balanceOf._hex, 16) === 0) {
                navigate(`/${DAO.url}/sbt/mint/${DAO.sbt.address}`);
            }
        }
    }, [DAO, balanceOf, contractName]);

    useEffect(() => {
        setDaoLinks(_get(DAO, 'links', []));
    }, [DAO])

    useEffect(() => {
        if (updateDaoLoading === false) {
            dispatch(resetUpdateDAOLoader());
            setEditMode(false);
        }
    }, [updateDaoLoading]);

    useEffect(() => {
        if (updateDaoLinksLoading === false) {
            dispatch(resetUpdateDaoLinksLoader());
            setEditLink(false);
        }
    }, [updateDaoLinksLoading]);

    const amIAdmin = useMemo(() => {
        if (DAO) {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, DAO])

    const toggleShowLink = () => {
        setShowAddLink(!showAddLink);
    };

    const handleParseUrl = (url) => {
        try {
            const link = new URL(url);
            if (link.hostname === 'notion.com' || link.hostname === 'www.notion.com') {
                return <SiNotion color='#B12F15' size={20} />
            }
            else if (link.hostname === 'discord.com' || link.hostname === 'www.discord.com') {
                return <BsDiscord color='#B12F15' size={20} />
            }
            else if (link.hostname === 'github.com' || link.hostname === 'www.github.com') {
                return <BsGithub color='#B12F15' size={20} />
            }
            else if (link.hostname === 'google.com' || link.hostname === 'www.google.com') {
                return <BsGoogle color='#B12F15' size={20} />
            }
            else {
                return <BsLink color='#B12F15' size={20} />
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            dispatch(updateDao({ url: DAO?.url, payload: { name, description } }))
        }
    }

    const handleChangeState = (e, index) => {
        const newArray = daoLinks.map((item, i) => {
            if (index === i) {
                if (e.target.name === 'title') {
                    document.getElementById(`title${index}`).innerHTML = '';
                }
                else if (e.target.name === 'link') {
                    document.getElementById(`link${index}`).innerHTML = '';
                }
                return { ...item, [e.target.name]: e.target.value };
            }
            else {
                return item;
            }
        });
        setDaoLinks(newArray);
    }

    const deleteLink = (item) => {

    }

    const handleKeyDown2 = (e) => {
        if (e.key === 'Enter') {
            let errorCount = 0;
            for (var i = 0; i < daoLinks.length; i++) {
                const title = daoLinks[i].title;
                const link = daoLinks[i].link;
                if (title === '') {
                    errorCount += 1;
                    document.getElementById(`title${i}`).innerHTML = 'Please enter title'
                }
                else if (link === '') {
                    errorCount += 1;
                    document.getElementById(`link${i}`).innerHTML = 'Please enter link'
                }
                else if (!isValidUrl(link)) {
                    errorCount += 1;
                    document.getElementById(`link${i}`).innerHTML = 'Please enter a valid link'
                }
            }
            if (errorCount === 0) {
                console.log("DAo links : ", daoLinks);
                dispatch(updateDaoLinks({ url: DAO?.url, payload: { links: daoLinks } }))
            }
        }
    }

    return (
        <div className='settings-page'>
            {
                showAddLink &&
                <AddDaoLink
                    toggleShowLink={toggleShowLink}
                    daoUrl={_get(DAO, 'url', '')}
                />
            }
            <div className='settings-left-bar'>
                <div onClick={() => navigate(-1)} className='logo-container'>
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
                        {
                            editMode
                                ?
                                <SimpleInputField
                                    className="inputField"
                                    height={50}
                                    width={144}
                                    placeholder="DAO name"
                                    value={name}
                                    onchange={(e) => { setName(e.target.value) }}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                                :
                                <h1>{name ? name : 'DAO Name'}</h1>
                        }
                        <button onClick={() => setEditMode(true)}>
                            <img src={editIcon} alt="edit-icon" />
                        </button>
                    </div>

                    <div className='organisation-desc'>
                        {
                            editMode
                                ?
                                <SimpleInputField
                                    className="inputField"
                                    height={50}
                                    width={'100%'}
                                    placeholder="DAO description"
                                    value={description}
                                    onchange={(e) => { setDescription(e.target.value) }}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                                :
                                <>
                                    {
                                        description
                                            ?
                                            <p>{description}</p>
                                            :
                                            <p>Description</p>
                                    }
                                </>
                        }

                    </div>

                    <div className='organisation-link'>
                        <div
                            className="copyArea"
                            onClick={() => {
                                setCopy(true);
                            }}
                            onMouseOut={() => {
                                setCopy(false);
                            }}
                        >
                            <Tooltip label={copy ? "copied" : "copy"}>
                                <div
                                    className="copyLinkButton"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}`);
                                    }}
                                >
                                    <img src={copyIcon} alt="copy" className="safeCopyImage" />
                                </div>
                            </Tooltip>
                            <p>{process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}</p>
                        </div>
                    </div>

                    {/* <div className='organisation-link'>
                        <button>
                            <img src={copy} alt="copy" />
                        </button>
                        <p>{process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}</p>
                    </div> */}

                    {/* <div className='organisation-policy'>
                        <p>Membership policy :</p>
                        <div>
                            <input type='checkbox' />
                            <span>WHITELISTED</span>
                        </div>
                    </div> */}
                </div>

                <div className='settings-links'>
                    <div className='links-header'>
                        <h1>Links</h1>
                        <div>
                            <button onClick={() => setEditLink(true)}>
                                <img src={editIcon} alt="edit-icon" />
                            </button>
                            <button onClick={toggleShowLink} className="addLink-btn">
                                <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                LINK
                            </button>
                        </div>
                    </div>
                    <span>Will display on the top of the dashboard</span>
                    <div className='link-body'>
                        {
                            editLink
                                ?
                                daoLinks.map((item, index) => {
                                    return (
                                        <div className='editLinkSection' key={index} id={`row${index}`}>
                                            <div className='editLinkCol'>
                                                <SimpleInputField
                                                    className="inputField"
                                                    height={50}
                                                    width={150}
                                                    placeholder="Title"
                                                    value={item.title}
                                                    name="title"
                                                    onchange={(e) => handleChangeState(e, index)}
                                                    onKeyDown={(e) => handleKeyDown2(e)}
                                                />
                                                <span id={`title${index}`}></span>
                                            </div>
                                            <div className='editLinkCol'>
                                                <SimpleInputField
                                                    className="inputField"
                                                    height={50}
                                                    width={250}
                                                    placeholder="Link"
                                                    value={item.link}
                                                    name="link"
                                                    onchange={(e) => handleChangeState(e, index)}
                                                    onKeyDown={(e) => handleKeyDown2(e)}
                                                />
                                                <span id={`link${index}`}></span>
                                            </div>
                                            {/* <button
                                                className="linkDeleteBtn"
                                                onClick={() => {
                                                    deleteLink(item);
                                                }}
                                            >
                                                <AiOutlineClose style={{ height: 15, width: 15 }} />
                                            </button> */}
                                        </div>
                                    )
                                })
                                :
                                _get(DAO, 'links', []).map((item, index) => {
                                    return (
                                        <div>
                                            <button onClick={() => window.open(item.link, '_blank')}>
                                                {handleParseUrl(item.link)}
                                                <span>{item.title.length > 6 ? item.title.substring(0, 6) + "..." : item.title}</span>
                                            </button>
                                            <p>{item.link}</p>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>

                <div className='settings-token'>
                    <h1>Pass Tokens</h1>
                    {
                        DAO?.sbt?.name
                            ?
                            // <div className='token-details'>
                            //     <button>
                            //         <img src={copy} alt="copy" />
                            //     </button>
                            //     <img src={coin} alt="asset" />
                            //     <p>{DAO?.sbt?.name}</p>
                            // </div>
                            <div className='token-details'>
                                <div
                                    className="copyArea"
                                    onClick={() => {
                                        setCopy(true);
                                    }}
                                    onMouseOut={() => {
                                        setCopy(false);
                                    }}
                                >
                                    <Tooltip label={copy ? "copied" : "copy"}>
                                        <div
                                            className="copyLinkButton"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${DAO?.sbt?.address}`);
                                            }}
                                        >
                                            <img src={copyIcon} alt="copy" className="safeCopyImage" />
                                        </div>
                                    </Tooltip>
                                    {DAO?.sbt?.image ? <img style={{ width: 24, height: 24 }} src={DAO?.sbt?.image} alt="asset" /> : <img src={coin} alt="asset" />}
                                    <p>{DAO?.sbt?.name}</p>
                                </div>
                            </div>
                            :
                            <>
                                <p>The organisation doesn’t have token yet</p>
                                <button onClick={() => navigate('/sbt/create')}>configure pass token</button>
                            </>
                    }
                </div>
                <Footer theme="light" />
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