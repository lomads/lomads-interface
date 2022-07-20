import React, { useState } from 'react'
const SendTokenComponent = () => {
    const [template, setTemplate] = useState("");
    return (
        <div className={"TitleBar"} style={{ paddingBottom: 60 }}>
            <div className={"tokentitleTile"} style={{ width: 750 }}>
                <div>
                    <div className={"tileItemHeader"}>
                        <div>
                            Send token
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input className={"inputField"} type="title" name="title" value={template} style={{ height: 40, width: 340 }}
                            autoFocus placeholder="Enter Amount" onChange={(e) => { setTemplate(e.target.value) }} />
                        <input className={"inputField"} type="title" name="title" value={template} style={{ height: 40, width: 340, marginTop: 5 }}
                            autoFocus placeholder="Enter Amount" onChange={(e) => { setTemplate(e.target.value) }} />
                        <button id="buttonDeploy" className={"nextButton"} style={{ background: '#C94B32', position: 'relative', left: 0, marginTop: 5 }}>
                            Send
                        </button>
                    </div>
                </div>
                {/* second */}
            </div>
        </div>
    )
}

export default SendTokenComponent