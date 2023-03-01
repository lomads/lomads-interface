import { LeapFrog } from "@uiball/loaders";
import lomadsfulllogo from "assets/svg/lomadsfulllogo.svg";

export default () => {
    return (
        <div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="logo">
                <img src={lomadsfulllogo} alt="" />
            </div>
            <div style={{ marginTop: 32 }}>
                <LeapFrog size={50} color="#C94B32" />
            </div>
        </div>
    )
}