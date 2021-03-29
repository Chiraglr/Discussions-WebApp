import Utils from '../../../utils/utils';
import CardPrimary from '../CardPrimary/CardPrimary';
import styles from './DiscussionBox.module.scss';

function DiscussionBox(props) {
    const { title, createdBy, createdTime, replies } = props;
    return <CardPrimary>
        <div className="row no-gutters">
            <h3>
                {title}
            </h3>
            <p>
                {createdBy}
            </p>
            <p>
                {createdTime}
            </p>
            <p>
                {Utils.arrayCheck(replies).length===0 ? "No replies" : Utils.arrayCheck(replies).length===1 ? "1 reply" : `${Utils.arrayCheck(replies).length} replies`} 
            </p>
        </div>
    </CardPrimary>
}

export default DiscussionBox;