import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './Discussions.module.scss';
import Locker from 'lockr';
import moment from 'moment';
import CardPrimary from '../Common/CardPrimary/CardPrimary';
import Form from '../Form/Form';
import Button from '../Common/Button/Button';
import Utils from '../../utils/utils';

function Discussions(props) {
    if(isNaN(props.match.params.id) || Number(props.match.params.id)<0 || Number(props.match.params.id)>=Utils.arrayCheck(Locker.get('discussions')).length)
        props.history.replace('/');

    const [ discussion, updateDiscussion ] = useState(Locker.get('discussions')[props.match.params.id]);
    const [ newReply, setNewReply ] = useState('');
    const username = Locker.get('currentUser');

    function addReply() {
        const discussions = Locker.get('discussions');
        console.log(newReply);
        if(newReply!==''){
            discussions[props.match.params.id].replies.push({
                to: null,
                reply: newReply,
                by: username,
                at: moment()
            });
            Locker.set('discussions',discussions);
            updateDiscussion(discussions[props.match.params.id]);
            setNewReply('');
        }
    }

    return <div className="row no-gutters">
        <div className="col-12">
            <h1 className="m-0 px-3 pt-3">
                {discussion?.title}
            </h1>
        </div>
        <div className={`col-11 d-flex flex-column flex-sm-row mx-3 pb-2 ${styles.details} mb-4`}>
            <p className="m-0 grey-text fw-600">
                started by {discussion.createdBy}, {`${moment().from(discussion.createdTime, true)}`} ago
            </p>
            <p className="pl-sm-3 m-0 grey-text fw-600">
                {discussion.replies.length===0 ? "no reply" : discussion.replies.length===1 ? "1 reply" : `${discussion.replies.length} replies`}
            </p>
        </div>
        <div className="col-12 align-items-center px-3">
            {discussion.replies.map((reply) => <CardPrimary className="w-100 mb-3">
                <p className="m-0 grey-text fw-600">
                    by {reply.by}, {moment().from(reply.at, true)} ago
                </p>
                <p className="m-0 fs-18 fw-600">
                    {reply.reply}
                </p>
            </CardPrimary>)}
            <CardPrimary className="w-100 mb-4">
                <Form onSubmit={addReply} autoComplete="off">
                    <label className="mr-3 mb-3 mb-sm-0">
                        Reply:
                    </label>
                    <input className="mr-3" value={newReply} type="textarea" onChange={(e) => setNewReply(e.target.value)}/>
                    <Button
                        type="submit"
                        className="darkBlue text-white ml-5 ml-sm-0 mt-3 mt-sm-0"
                        text="reply"
                    />
                </Form>
            </CardPrimary>
        </div>
    </div>;
}

export default withRouter(Discussions);