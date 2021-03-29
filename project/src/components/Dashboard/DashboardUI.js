import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import Discussions from '../Discussions/Discussions';
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Common/Button/Button";
import Locker from 'lockr';
import AuthService from '../../utils/ApiUtils/AuthService';
import styles from './Dashboard.module.scss';

function DashboardUI(props) {
    const userName = Locker.get('currentUser');
    function logout() {
        AuthService.logout();
    }
    return <>
        <div className={`w-100 d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center px-4 py-3 bg-white ${styles.header}`}>
            <div className="d-flex align-items-center mb-3 mb-sm-0">
                <FontAwesomeIcon
                    icon={faCommentAlt}
                    onClick={() => props.history.push('/')}
                    size="4x"
                    className="pointer"
                />
                <h1 className={`px-3 ${styles.title}`}>
                    Discussion Village
                </h1>
            </div>
            <div className="d-flex align-items-center">
                <h4 className="m-0 mr-3">
                    Hi, {userName}
                </h4>
                <Button
                    className="darkBlue text-white"
                    onClick={logout}
                >
                    <h4 className="align-self-end pointer m-0">
                        Logout
                    </h4>
                </Button>
            </div>
        </div>
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/discussions/:id" component={Discussions} />
            <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
    </>;
}

export default withRouter(DashboardUI);