const Notification = ({ text, type }) => <p className={`notification notification--${type}`}>{text}</p>

export default Notification