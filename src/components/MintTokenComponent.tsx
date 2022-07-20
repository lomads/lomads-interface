import React, { useState } from 'react'
const MintTokenComponent = () => {
    const [template, setTemplate] = useState("");
    return (
        <div className={"TitleBar"} style={{ paddingBottom: 60 }}>
            <div className={"tokentitleTile"} style={{ width: 750 }}>
                <div>
                    <div className={"tileItemHeader"}>
                        <div>
                            Mint token
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <input className={"inputField"} type="title" name="title" value={template} style={{ height: 40, width: 340 }}
                            autoFocus placeholder="Enter Amount" onChange={(e) => { setTemplate(e.target.value) }} />
                        <button id="buttonDeploy" className={"nextButton"}  style={{ background: '#C94B32', position: 'relative', left: '10px' }}>
                            Mint
                        </button>
                    </div>
                </div>
                {/* second */}
            </div>
        </div>
    )
}

export default MintTokenComponent