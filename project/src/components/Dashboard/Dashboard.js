import { useState } from 'react';
import { withRouter } from "react-router";
import Button from "../Common/Button/Button";
import styles from './Dashboard.module.scss';
import Locker from 'lockr';
import CardPrimary from '../Common/CardPrimary/CardPrimary';
import Form from '../Form/Form';
import moment from 'moment';
import Utils from '../../utils/utils';

function Dashboard(props) {
    const [ discussions, setDiscussions ] = useState(Utils.arrayCheck(Locker.get('discussions')));
    const [ newDiscussion, setNewDiscussion ] = useState('');
    const userName = Locker.get('currentUser');

    function createDiscussion() {
        Locker.set('discussions',[...discussions, {
            title: newDiscussion,
            createdBy: userName,
            createdTime: moment(),
            replies: []
        }]);
        setDiscussions(Locker.get('discussions'));
        setNewDiscussion('');
    }

    function cardClick(index) {
        props.history.push(`/discussions/${index}`);
    }

    return <>
        <div className={styles.dashboard}>
            <div className={`row no-gutters justify-content-center`}>
                <div className="col-12 p-4">
                    <h4>
                        Discussions
                    </h4>
                    <div className="row no-gutters">
                        {discussions.map((discussion, index) => <CardPrimary className="col-12 mb-4 pointer" onClick={() => cardClick(index)}>
                            <h4 className="m-0">
                                {discussion.title}
                            </h4>
                            <div className="d-flex flex-column flex-sm-row">
                                <p className="m-0 grey-text">
                                    created by {discussion.createdBy}, {`${moment().from(discussion.createdTime, true)}`} ago
                                </p>
                                <p className="pl-sm-3 m-0 grey-text">
                                    {discussion.replies.length===0 ? "no reply" : discussion.replies.length===1 ? "1 reply" : `${discussion.replies.length} replies`}
                                </p>
                            </div>
                        </CardPrimary>)}
                        <CardPrimary className="col-12">
                            <Form onSubmit={createDiscussion} autoComplete="off">
                                <label className="mr-3">
                                    Enter title of Discussion:
                                </label>
                                <input className="mr-3" minLength={10} value={newDiscussion} type="textarea" onChange={(e) => setNewDiscussion(e.target.value)}/>
                                <Button
                                    type="submit"
                                    className="darkBlue text-white mt-3 mt-sm-0"
                                    text="Create Discussion"
                                />
                            </Form>
                        </CardPrimary>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default withRouter(Dashboard);