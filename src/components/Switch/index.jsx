import './switch.css';
export default (props) => {
    return (
        <label class="switch">
            <input defaultChecked={props.defaultChecked} onChange={props.onChange} type="checkbox" />
            <span class="slider check round"></span>
        </label>
    )
}