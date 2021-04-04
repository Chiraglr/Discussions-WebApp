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
        <nav className={`w-100 fixed-top d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center px-4 py-3 ${styles.header} bg-dark`}>
            <div className="d-flex align-items-center mb-3 mb-sm-0 text-white">
                <FontAwesomeIcon
                    icon={faCommentAlt}
                    onClick={() => props.history.push('/')}
                    size="2x"
                    className="pointer"
                />
                <p className={`px-3 fs-20 fw-600 m-0 ${styles.title}`}>
                    Discussion Village
                </p>
            </div>
            <div className="d-flex align-items-end">
                <p className="m-0 fs-18 fw-600 mr-3 text-white">
                    Hi, {userName}
                </p>
                <Button
                    className="darkBlue text-white"
                    onClick={logout}
                >
                    <p className="align-self-end pointer m-0 fs-18 fw-600">
                        Logout
                    </p>
                </Button>
            </div>
        </nav>
        <Switch>
            <PrivateRoute exact path="/dashboard/:id*" component={Dashboard} />
            <PrivateRoute exact path="/discussions/:id" component={Discussions} />
            <PrivateRoute path="*" render={() => <Redirect to="/dashboard" />} />
        </Switch>
    </>;
}


function PrivateRoute(props){
    return <div className="pt-5 mt-sm-4 mt-5">
        <Route {...props} />
    </div>
}

export default withRouter(DashboardUI);