import { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import styles from './Discussions.module.scss';
import Locker from 'lockr';
import moment from 'moment';
import CardPrimary from '../Common/CardPrimary/CardPrimary';
import Form from '../Form/Form';
import Button from '../Common/Button/Button';
import Utils from '../../utils/utils';
import { faArrowLeft, faThumbsUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '../Common/Modal/Modal';

function Discussions(props) {

    const [ discussion, updateDiscussion ] = useState(Utils.arrayCheck(Locker.get('discussions'))[props.match.params.id]);
    const [ newReply, setNewReply ] = useState('');
    const [ edit, setEdit ] = useState(-1);
    const [ editTo, setEditTo ] = useState(-1);
    const [ editReply, setEditReply ] = useState('');
    const [ isDelete, askDelete ] = useState(-1);
    const [ isDeleteTo, askDeleteTo ] = useState(-1);
    const [ replies, setReplies ] = useState([]);
    const [ repliesTo, editRepliesTo ] = useState(discussion?.replies.map(() => ''));
    const [ repliesToCount, setRepliesToCount ] = useState(discussion?.replies.map(() => 5));
    const history = useHistory();
    if(isNaN(props.match.params.id) || Number(props.match.params.id)<0 || Number(props.match.params.id)>=Utils.arrayCheck(Locker.get('discussions')).length){
        history.replace('/');
        return null;
    }

    const username = Locker.get('currentUser');

    function addReply() {
        const discussions = Locker.get('discussions');
        if(newReply!==''){
            discussions[props.match.params.id].replies.push({
                to: null,
                reply: newReply,
                by: username,
                at: moment(),
                thumbsUp: 0,
                like: [],
                replies: []
            });
            Locker.set('discussions',discussions);
            updateDiscussion(discussions[props.match.params.id]);
            editRepliesTo([...repliesTo,'']);
            setNewReply('');
        }
    }

    function EditReply(newReply) {
        if(newReply==='')
            return;
        const discussions = Locker.get('discussions');
        if(editTo===-1){
            discussions[props.match.params.id].replies[edit].reply = newReply;
            UpdateDiscussions(discussions);
            setEditReply('');
            setEdit(-1);
        }else {
            discussions[props.match.params.id].replies[edit].replies[editTo].reply = newReply;
            UpdateDiscussions(discussions);
            setEditReply('');
            setEdit(-1);
            setEditTo(-1);
        }
    }

    function editReplyTo(i) {
        const newReply = repliesTo[i];
        if(newReply==='')
            return;
        const discussions = Locker.get('discussions');
        discussions[props.match.params.id].replies[i].replies.push({
            reply: newReply,
            by: username,
            at: moment(),
            thumbsUp: 0,
            like: []
        });
        Locker.set('discussions',discussions);
        updateDiscussion(discussions[props.match.params.id]);
        repliesTo[i] = '';
        editRepliesTo(repliesTo);
    }

    function UpdateDiscussions(discussions) {
        Locker.set('discussions', discussions);
        updateDiscussion(discussions[props.match.params.id]);
    }

    function DeleteReply() {
        const discussions = Locker.get('discussions');
        if(isDeleteTo===-1){
            discussions[props.match.params.id].replies.splice(isDelete,1);
            UpdateDiscussions(discussions);
            askDelete(-1);
        }else{
            discussions[props.match.params.id].replies[isDelete].replies.splice(isDeleteTo,1);
            UpdateDiscussions(discussions);
            askDelete(-1);
            askDeleteTo(-1);
        }
    }

    function ToggleLike(i,j) {
        const discussions = Locker.get('discussions');
        if(j===-1){
            if(!discussions[props.match.params.id].replies[i].like.includes(username)){
                discussions[props.match.params.id].replies[i].thumbsUp++;
                discussions[props.match.params.id].replies[i].like.push(username);
            }else{
                discussions[props.match.params.id].replies[i].thumbsUp--;
                discussions[props.match.params.id].replies[i].like.splice(discussions[props.match.params.id].replies[i].like.indexOf(username),1);
            }
            UpdateDiscussions(discussions);
        }else {
            if(!discussions[props.match.params.id].replies[i].replies[j].like.includes(username)){
                discussions[props.match.params.id].replies[i].replies[j].thumbsUp++;
                discussions[props.match.params.id].replies[i].replies[j].like.push(username);
            }else{
                discussions[props.match.params.id].replies[i].replies[j].thumbsUp--;
                discussions[props.match.params.id].replies[i].replies[j].like.splice(discussions[props.match.params.id].replies[i].replies[j].like.indexOf(username));
            }
            UpdateDiscussions(discussions);
        }
    }

    function getDeleteModal() {
        return <Modal small onClose={() => askDelete(-1)}>
            <p className="m-0 fs-20 fw-600 mb-3">
                Delete permanently?
            </p>
            <div className="row no-gutters justify-content-center">
                <Button className="darkBlue text-white m-0" onClick={() => DeleteReply()}>Yes</Button>
                <Button className="darkBlue text-white m-0 ml-5" onClick={() => { askDelete(-1); askDeleteTo(-1); }}>No</Button>
            </div>
        </Modal>;
    }

    function updateReplies(index) {
        const i = replies.indexOf(index);
        if(i > -1){
            replies.splice(i,1);
            setReplies([...replies]);
        }else
            setReplies([...replies, index]);
    }

    function updateRepliesToCount(i) {
        const temp = [...repliesToCount];
        temp[i]+=5;
        setRepliesToCount(temp);
    }

    return <>
        {isDelete!==-1 && getDeleteModal()}
        <div className="row no-gutters">
            <div className="col-12">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={() => props.history.goBack()}
                    size="3x"
                    className="pl-3 pt-3 pointer"
                />
                <h1 className="m-0 px-5">
                    {discussion?.title}
                </h1>
            </div>
            <div className={`col-10 col-sm-11 d-flex flex-column flex-sm-row mx-5 pb-2 ${styles.details} mb-4`}>
                <p className="m-0 grey-text fw-600">
                    started by {discussion.createdBy}, {`${moment().from(discussion.createdTime, true)}`} ago
                </p>
                <p className="pl-sm-3 m-0 grey-text fw-600">
                    {discussion.replies.length===0 ? "no reply" : discussion.replies.length===1 ? "1 reply" : `${discussion.replies.length} replies`}
                </p>
            </div>
            <div className="col-12 col-sm-10 col-md-9 col-lg-6 align-items-center pl-5 pr-3">
                {discussion.replies.map((reply, index) => <CardPrimary key={reply.reply} className="w-100" noShadow>
                    {index===edit && editTo===-1 ? <>
                        <input className="border-radius-4 p-1 mr-3 w-100" value={editReply} type="textarea" onChange={(e) => setEditReply(e.target.value)} />
                        <Button
                            onClick={() => EditReply(editReply)}
                            className="darkBlue text-white mt-2 mb-1"
                            text="update"
                        />
                        <Button
                            onClick={() => { setEdit(-1); setEditReply(''); }}
                            className="darkBlue text-white ml-3 mt-2 mb-1"
                            text="cancel"
                        />
                    </> : <>
                        <p className="m-0 fs-10 grey-text fw-600">
                            by {reply.by}, {moment().from(reply.at, true)} ago
                        </p>
                        <p className="m-0 fs-18 fw-600">
                        {reply.reply}
                    </p></>}
                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={`fs-20 rounded-circle p-1 pointer ${!reply.like.includes(username) ? '' : 'text-white bg-dark'}`}
                            onClick={() => ToggleLike(index,-1)}
                        />
                        <p className="m-0 pl-1 fs-12">
                            {reply.thumbsUp}
                        </p>
                        {reply.by===username && <><p className="fs-10 grey-text fw-600 hover-underline m-0 ml-3 pointer" onClick={() => {setEdit(index); setEditTo(-1); setEditReply(reply.reply)}} >
                            edit
                        </p>
                        <p className="fs-10 grey-text fw-600 hover-underline m-0 ml-3 pointer" onClick={() => { askDelete(index); askDeleteTo(-1); }}>
                            delete
                        </p></>}
                        {reply.replies.length ? <p className="fs-10 grey-text fw-600 hover-underline m-0 ml-3 pointer" onClick={() => updateReplies(index)}>
                            replies&nbsp;&nbsp;&nbsp;<span className={`${replies.includes(index) ? styles.arrowUp : styles.arrowDown}`} /> {reply.replies.length}
                        </p> : <p className="fs-10 grey-text fw-600 hover-underline m-0 ml-3 pointer" onClick={() => updateReplies(index)}>
                            reply&nbsp;&nbsp;&nbsp;<span className={`${replies.includes(index) ? styles.arrowUp : styles.arrowDown}`} />
                        </p>}
                    </div>
                    {replies.includes(index) && <>
                    <div className="ml-3 ml-sm-5 pl-sm-5 mb-3 mt-2">
                        <Form onSubmit={() => editReplyTo(index)} autoComplete="off">
                            <label className="fs-10 grey-text fw-600 hover-underline m-0 pointer">
                                Reply:
                            </label>
                            <input className="border-radius-4 p-1 ml-2 mr-3 mb-3 mb-sm-0" value={repliesTo[index]} type="textarea" onChange={(e) => { editRepliesTo((prev) => {const temp = [...prev]; temp[index] = e.target.value; return temp;}); }} required/>
                            <Button
                                type="submit"
                                className="darkBlue text-white fs-14 px-2"
                                text="reply"
                            />
                        </Form>
                    </div>
                    {reply.replies.slice(0,repliesToCount[index]).map((reply, indexTo) => {
                        return <>
                            {indexTo===editTo && index===edit ? <>
                                <div className="pl-sm-5">
                                    <input className="border-radius-4 p-1 ml-3 ml-sm-5 mr-3 w-100" value={editReply} type="textarea" onChange={(e) => setEditReply(e.target.value)} />
                                    <Button
                                        onClick={() => EditReply(editReply)}
                                        className="ml-3 ml-sm-5 darkBlue text-white mt-2 mb-1"
                                        text="update"
                                    />
                                    <Button
                                        onClick={() => { setEdit(-1); setEditReply(''); }}
                                        className="darkBlue text-white ml-3 mt-2 mb-1"
                                        text="cancel"
                                    />
                                </div>
                            </> : <>
                                <p className="ml-3 ml-sm-5 pl-sm-5 m-0 fs-10 grey-text fw-600">
                                    by {reply.by}, {moment().from(reply.at, true)} ago
                                </p>
                                <p className="ml-3 ml-sm-5 pl-sm-5 m-0 fs-18 fw-600">
                                {reply.reply}
                            </p></>}
                            <div className="ml-3 ml-sm-5 pl-sm-5 mb-2 d-flex align-items-center">
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    className={`fs-20 rounded-circle p-1 pointer ${!reply.like.includes(username) ? '' : 'text-white bg-dark'}`}
                                    onClick={() => ToggleLike(index,indexTo)}
                                />
                                <p className="m-0 pl-1 fs-12">
                                    {reply.thumbsUp}
                                </p>
                                {reply.by===username && <><p className="fs-10 grey-text fw-600 hover-underline m-0 ml-3 pointer" onClick={() => {setEdit(index); setEditTo(indexTo); setEditReply(reply.reply)}} >
                                    edit
                                </p>
                                <p className="fs-10 grey-text fw-600 hover-underline m-0 ml-3 pointer" onClick={() => { askDelete(index); askDeleteTo(indexTo); }}>
                                    delete
                                </p></>}
                            </div>
                        </>
                    })}
                    {repliesToCount[index]<reply.replies.length && <div className={`ml-3 ml-sm-5 pl-sm-5 ${styles.blurred}`} tabIndex={0} onClick={() => updateRepliesToCount(index)}>
                        <div className={`${styles.loadComments} grey-bg pointer border border-radius-8 py-2 d-flex justify-content-center align-items-center`}>
                            <p className="m-0" >
                                View more replies
                            </p>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                size="1x"
                                className="pointer ml-2"
                            />
                        </div>
                    </div>}
                    </>}
                </CardPrimary>)}
                <CardPrimary className="w-100 mb-4">
                    <Form onSubmit={addReply} autoComplete="off">
                        <label className="mr-3 mb-3 mb-sm-0">
                            Reply:
                        </label>
                        <input className="border-radius-4 p-1 mr-3 mb-3 mb-sm-0" value={newReply} type="textarea" onChange={(e) => setNewReply(e.target.value)}/>
                        <Button
                            type="submit"
                            className="darkBlue text-white ml-5 ml-sm-0 mt-3 mt-sm-0"
                            text="reply"
                        />
                    </Form>
                </CardPrimary>
            </div>
        </div>
    </>;
}

export default withRouter(Discussions);