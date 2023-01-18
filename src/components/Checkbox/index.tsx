import './index.css'
import { FiCheck } from "react-icons/fi";

export default ({ checked = false, onChange }: any) => {
    return (
        <div className="scale-div">
            <div className="form-checkbox-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="form-checkbox" onClick={() => onChange(!checked)} style={{ marginRight: 0 }}>
                    {
                        checked ? <div className="checked"><FiCheck color="#FFF" /></div> : <div className="unchecked"></div>
                    }
                </div>
            </div>
        </div>
    )
}