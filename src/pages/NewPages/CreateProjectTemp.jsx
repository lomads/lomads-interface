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
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    className="input1"
                    name="title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setTitleError(null) }}
                />
                <span style={{ fontSize: '13px', color: '#C84A32' }}>{titleError}</span>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Link"
                    className="input2"
                    name="link"
                    value={link}
                    onChange={(e) => { setLink(e.target.value); setLinkError(null) }}
                />
                <span style={{ fontSize: '13px', color: '#C84A32' }}>{linkError}</span>
            </div>
            {
                link && (link.indexOf('discord.') > -1 || link.indexOf('notion.') > -1) ?
                    <LinkBtn spaceDomain={spaceDomain} onNotionCheckStatus={handleAddResource} onGuildCreateSuccess={handleAddResource} title={title} link={link} roleName={roleName} accessControl={accessControl} />
                    :
                    <button
                        style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                        onClick={() => handleAddResource()}
                    >
                        <AiOutlinePlus color="#FFF" size={25} />
                    </button>
            }
        </div>
        {accessControl && link && link.indexOf('discord.') > -1 ? <div className='resource-body'>
            <div>
                <input
                    type="text"
                    placeholder="Role name"
                    className="input2"
                    style={{ marginTop: 16 }}
                    name="rolename"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
            </div>
        </div> : null}
        {accessControl && link && link.indexOf('notion.') > -1 && !linkHasDomain ? <div className='resource-body'>
            <div>
                <input
                    type="text"
                    placeholder="Notion Domain"
                    className="input2"
                    style={{ marginTop: 16 }}
                    name="spaceDomain"
                    value={spaceDomain}
                    onChange={(e) => setSpaceDomain(e.target.value)}
                />
            </div>
        </div> : null}
        {
            accessControl && link && link.indexOf('notion.') > -1 &&
            <div style={{ fontSize: 14, fontStyle: 'italic', color: "rgba(118, 128, 141, 0.5)" }}>Invite <span style={{ color: "#76808D" }}>{process.env.REACT_APP_NOTION_ADMIN_EMAIL}</span> to be an Admin of your workspace</div>
        }
        {DAO?.sbt &&
            <div className='resource-footer'>
                {
                    (link && link.indexOf('notion.') > -1 && _get(DAO, 'sbt.contactDetail', '').indexOf('email') > -1) ||
                        (link && link.indexOf('discord.') > -1 && _get(DAO, 'sbt.contactDetail', '').indexOf('discord') > -1)
                        ?
                        <input id="accessControl" type="checkbox" checked={accessControl} value={accessControl} disabled={accessControlError || accesscontrolDisabled} onChange={e => setAccessControl(prev => !prev)} /> : null}
                <div>
                    <p>ACCESS CONTROL</p>
                    <span>Currently available for discord & notion only</span>
                    {accessControlError && <div><span style={{ color: 'red' }}>{accessControlError}</span></div>}
                </div>
            </div>

        }
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
                                    {handleParseUrl(item.link)}
                                    <p style={{ marginLeft: '5px' }}>{item.title}</p>
                                </div>
                                <div className="member-address">
                                    <p>{item.link.length > 30 ? item.link.slice(0, 30) + "..." : item.link}</p>
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
    <button
        className='create-project-button'
        onClick={handleCreateProject}
    >
        CREATE PROJECT
    </button>
</>