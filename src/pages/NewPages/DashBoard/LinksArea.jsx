import './LinksArea.css';
import BootstrapTooltip from "./WalkThrough/HelpToolTip"
import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink, BsTwitter, BsGlobe } from "react-icons/bs";
import useRole from "hooks/useRole";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import settingIcon from '../../../assets/svg/settings.svg';
import { useAppSelector } from "state/hooks";

const LinksArea = ({ links, isHelpIconOpen }) => {
    const navigate = useNavigate();
    const { account } = useWeb3React();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { myRole, can } = useRole(DAO, account);
    const handleParseUrl = (url) => {
        try {
            const link = new URL(url);
            if (link.hostname.indexOf('notion.') > -1) {
                return <SiNotion color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('discord.') > -1) {
                return <BsDiscord color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('github.') > -1) {
                return <BsGithub color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('google.') > -1) {
                return <BsGoogle color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('twitter.') > -1) {
                return <BsTwitter color='#B12F15' size={20} />
            }
            else {
                return <span><BsGlobe size={20} /></span>
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    const renderLinks = (item) => {
        return (
            <div onClick={() => window.open(item.link, '_blank')} className='link-pill'>
                {handleParseUrl(item.link)}
                <span>{item.title}</span>
                {/* <span>{item.title.length > 6 ? item.title.substring(0, 6) + "..." : item.title}</span> */}
            </div>
        )
    }

    if (links.length == 0 && !can(myRole, 'settings')) {
        return null
    }

    return (
        <div className='links-container'>
            <div className='links-container-links'>
                {
                    links && links.length > 0
                    ?
                    links.map((item, index) => {
                        return renderLinks(item)
                    })
                    :
                    <div className='link-add-btn' onClick={() => { navigate(`/${DAO.url}/settings/${'openOrganisation'}`) }}>
                        <span>ADD USEFUL LINKS HERE</span>
                    </div>
                }
            </div>
            {
                can(myRole, 'settings') &&
                <BootstrapTooltip open={isHelpIconOpen} 
                    placement="left-start"
                    title="Global Settings">
                <button
                    className={`settings ${isHelpIconOpen ? 'help-highlight':''}`}
                    id="global-settings" 
                    onClick={() => { navigate(`/${DAO.url}/settings`) }}>
                    <img src={settingIcon} alt="settings-icon" />
                </button>
                </BootstrapTooltip>
            }
        </div>
    )
}

export default LinksArea;