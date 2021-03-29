import styles from './CardPrimary.module.scss';

function CardPrimary(props){
    return <div className={`${props.className} ${styles.card} border-radius-8 p-3`}
        onClick={props.onClick}
    >
        {props.children}
    </div>
}

export default CardPrimary;