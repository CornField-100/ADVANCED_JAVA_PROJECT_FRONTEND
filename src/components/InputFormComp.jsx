const InputForm = ({ type, id, ariaDescribe, value, onchange }) => {
    return (
        <input
            type={type}
            className="form-control"
            id={id}
            aria-describedby={ariaDescribe}
            value={value}
            onChange={(e) => onchange(e.target.value)}
            required
        />
    )
}

export default InputForm