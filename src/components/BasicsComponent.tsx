import { useAppDispatch } from 'state/hooks'
import { updateTitle, updatePurpose } from 'state/proposal/reducer'
import { useAppSelector } from 'state/hooks'


const BasicsComponent = (props: any) => {
    const dispatch = useAppDispatch()
    const title = useAppSelector((state) => state.proposal.title)
    const purpose = useAppSelector((state) => state.proposal.purpose)

    return (
        <div className={"titleBar"} style={{ paddingBottom: 60 }}>
            <div className={"tokentitleTile"} style={{ width: 750 }}>
                <div>
                    <div className={"tileItemHeader"}>
                        <div>
                            Title
                        </div>
                    </div>
                    <input className={"inputField"} type="title" name="title" value={title} style={{ height: 40, width: 340 }}
                        autoFocus placeholder="Enter Title" onChange={(e) => { dispatch(updateTitle(e.target.value)) }} />
                </div>
                {/* second */}
                <div style={{ marginLeft: "20px" }}>
                    <div className={"tileItemHeader"}>
                        <div>
                            Purpose
                        </div>
                    </div>
                    <input className={"inputField"} type="title" name="title" value={purpose} style={{ height: 40, width: 340 }}
                        placeholder="Enter Purpose" onChange={(e) => { dispatch(updatePurpose(e.target.value)) }} />
                </div>
            </div>
        </div>
    );
}

export default BasicsComponent