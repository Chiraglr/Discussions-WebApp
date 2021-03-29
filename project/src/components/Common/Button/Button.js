import styles from './Button.module.scss';

function Button(props) {
    const {loading, text, disabled, children, className, type, onClick} = props;
    return <button
        className={`${styles.btn} btn ${className}`}
        disabled={disabled}
        type={type}
        onClick={onClick}
    >
        {loading ? <div className={styles.parent}>
            <div className={styles.loading} />
        </div>: text ? text : children}
    </button>
}

export default Button;