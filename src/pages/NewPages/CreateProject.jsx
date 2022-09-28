import { useState } from 'react';

import '../../styles/pages/CreateProject.css';

import DogIcon from '../../assets/svg/dogIcon.svg';
import createProject from '../../assets/svg/createProject.svg';
import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import notionIcon from '../../assets/svg/Notion-logo.svg';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { AiOutlinePlus } from "react-icons/ai";
import Header from 'components/Header';
const CreateProject = () => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [next, setNext] = useState(false);
    const [memberList, setMemberList] = useState([
        {
            name: 'Zohaib',
            address: '0X984hdjkqkjqkdjhjk…jMHg'
        },
        {
            name: 'Naman',
            address: '0X984hdjkqkjqkdjhjk…jMHg'
        },
        {
            name: 'Harish',
            address: '0X984hdjkqkjqkdjhjk…jMHg'
        },
    ]);

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [resourceList, setResourceList] = useState([]);

    const [showMore, setShowMore] = useState(false);
    const [link, setLink] = useState('');
    const [title, setTitle] = useState('');

    const handleNext = () => {
        if (name !== '' && desc !== '') {
            setNext(true);
        }
    }

    const handleAddMember = (member) => {
        let found = false;
        for (let i = 0; i < selectedMembers.length; i++) {
            if (selectedMembers[i].name === member.name) {
                found = true;
                break;
            }
        }
        if (found) {
            setSelectedMembers(selectedMembers.filter((item) => item.name !== member.name));
        }
        else {
            setSelectedMembers([...selectedMembers, member]);
        }
    }

    const handleRemoveMember = (position) => {
        setSelectedMembers(selectedMembers.filter((_, index) => index !== position));
    }

    const handleAddResource = () => {
        let resource = {};
        resource.title = title;
        resource.link = link;

        setResourceList([...resourceList, resource]);
        setTitle('');
        setLink('');
    }

    const handleRemoveResource = (position) => {
        setResourceList(resourceList.filter((_, index) => index !== position));
    }

    return (
        <div className="createProject-container">
            {/* <div className="createProject-dropdown-container">
                <div className="createProject-dropdown-div1">
                    <img src={DogIcon} alt="dog-icon" />
                    <p>0X984…MHg</p>
                </div>
                <div className="createProject-dropdown-div2">
                    <span>
                        <MdKeyboardArrowDown
                            size={20}
                            color="#76808D"
                        />
                    </span>
                </div>
            </div> */}
            <Header />

            <div className='createProject-body'>
                <img src={createProject} alt="frame-icon" />
                <p className="heading-text">Create New Pass Token</p>

                {
                    !next
                        ?
                        <div className='createProject-form-container'>
                            <div className='input-div'>
                                <label>Name of the project</label>
                                <input
                                    className="text-input"
                                    placeholder="Enter project name"
                                    value={name}
                                    name="name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='input-div'>
                                <label>Short description</label>
                                <textarea
                                    className='text-area'
                                    rows="4"
                                    cols="50"
                                    placeholder='Enter short description'
                                    name='desc'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                style={name !== '' && desc !== '' ? { background: '#C94B32' } : { background: 'rgba(27, 43, 65, 0.2)' }}
                                onClick={handleNext}
                            >NEXT</button>
                        </div>
                        :
                        <>
                            {/* show invite members */}
                            <div className="projectName-container">
                                <div className="projectName-box">
                                    <p>{name}</p>
                                    <span>{desc.length > 25 ? desc.substring(0, 25) + "..." : desc}</span>
                                </div>
                                <div className="projectName-btn">
                                    <button onClick={() => setNext(false)}>
                                        <img src={editToken} alt="hk-logo" />
                                    </button>
                                </div>
                            </div>
                            <div className="divider"></div>
                            {/* If add more details button is not clicked then show add members else show list of already added members*/}
                            {
                                !showMore
                                    ?
                                    <div className='project-members'>
                                        <div className='project-members-header'>
                                            <p>Invite members</p>
                                            <button>ADD NEW MEMBER</button>
                                        </div>
                                        <div className="member-list">
                                            {
                                                memberList.map((item, index) => {
                                                    return (
                                                        <div className="member-li" key={index}>
                                                            <div className="member-img-name">
                                                                <img src={memberIcon} alt="member-icon" />
                                                                <p>{item.name}</p>
                                                            </div>
                                                            <div className="member-address">
                                                                <p>{item.address}</p>
                                                                {
                                                                    selectedMembers.indexOf(item) === -1
                                                                        ?
                                                                        <input type="checkbox" onChange={() => handleAddMember(item)} />
                                                                        :
                                                                        <input type="checkbox" onChange={() => handleAddMember(item)} checked />
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div className='project-members2'>
                                            <p>Project members</p>
                                            <button onClick={() => setShowMore(false)}>
                                                <img src={editToken} alt="hk-logo" />
                                            </button>
                                        </div>
                                        {
                                            selectedMembers.length > 0
                                                ?
                                                <div className='transparent-list' style={{ width: '420px' }}>
                                                    {
                                                        selectedMembers.map((item, index) => {
                                                            return (
                                                                <div className="member-li" key={index}>
                                                                    <div className="member-img-name">
                                                                        <img src={memberIcon} alt="member-icon" />
                                                                        <p>{item.name}</p>
                                                                    </div>
                                                                    <div className="member-address">
                                                                        <p>{item.address}</p>
                                                                        <button onClick={() => handleRemoveMember(index)}>X</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                null
                                        }
                                    </>
                            }
                            {/* If add more detail is clicked then show add resources section else show buttons */}
                            {
                                !showMore
                                    ?
                                    <div className='project-buttons'>
                                        <button
                                            style={{ marginRight: '35px', background: '#FFF', color: '#C94B32' }}
                                            onClick={() => setShowMore(true)}
                                        >
                                            ADD MORE DETAIL
                                        </button>
                                        <button style={{ background: '#C94B32', color: '#FFF' }}>CREATE PROJECT</button>
                                    </div>
                                    :
                                    null
                            }


                            {/* If add more detail is clicked then show section for adding project resources */}
                            {
                                showMore
                                    ?
                                    <>
                                        <div className="divider"></div>
                                        <div className="resource-container">
                                            <div className="resource-header">
                                                <h1>Add project resources</h1>
                                                <div>
                                                    <p>Optional</p>
                                                </div>
                                            </div>
                                            <div className="resource-body">
                                                <input
                                                    type="text"
                                                    placeholder="Title"
                                                    className="input1"
                                                    name="title"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link"
                                                    className="input2"
                                                    name="link"
                                                    value={link}
                                                    onChange={(e) => setLink(e.target.value)}
                                                />
                                                <button
                                                    style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                                                    onClick={handleAddResource}
                                                >
                                                    <AiOutlinePlus color="#FFF" size={25} />
                                                </button>
                                            </div>
                                            <div className='resource-footer'>
                                                <input type="checkbox" />
                                                <div>
                                                    <p>ACCESS CONTROL</p>
                                                    <span>Currently available for Notion and Discord only</span>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            resourceList.length > 0
                                                ?
                                                <div className='transparent-list' style={{ width: '500px' }}>
                                                    {
                                                        resourceList.map((item, index) => {
                                                            return (
                                                                <div className="member-li" key={index}>
                                                                    <div className="member-img-name">
                                                                        <img src={notionIcon} alt="member-icon" />
                                                                        <p>{item.title}</p>
                                                                    </div>
                                                                    <div className="member-address">
                                                                        <p>{item.link}</p>
                                                                        <button onClick={() => handleRemoveResource(index)}>X</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                null
                                        }
                                        <button className='create-project-button'>CREATE PROJECT</button>
                                    </>
                                    :
                                    null
                            }

                        </>
                }
            </div>
        </div>
    )
}

export default CreateProject;