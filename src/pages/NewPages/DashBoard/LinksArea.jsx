import './LinksArea.css';

import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";

const LinksArea = ({ links }) => {

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

    const renderLinks = (item) => {
        return (
            <div className='link-pill'>
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