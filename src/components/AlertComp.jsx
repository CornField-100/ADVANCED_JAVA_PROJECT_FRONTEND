const AlertComp = ({ alertType, text }) => {
    return (
        <div class={`alert ${alertType}`} role="alert">
            {text}
        </div>
    )
}

export default AlertComp