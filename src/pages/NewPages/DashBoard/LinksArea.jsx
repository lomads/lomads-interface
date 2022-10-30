import './LinksArea.css';

import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";

const LinksArea = ({ links }) => {

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
            else {
                return <span><BsLink size={20} /></span>
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
                <span>{item.title.length > 6 ? item.title.substring(0, 6) + "..." : item.title}</span>
            </div>
        )
    }

    return (
        <div className='links-container'>
            {
                links.map((item, index) => {
                    return renderLinks(item)
                })
            }
        </div>
    )
}

export default LinksArea;