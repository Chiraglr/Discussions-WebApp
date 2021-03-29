import { useState } from 'react';
import styles from './Login.module.scss';
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CardPrimary from '../Common/CardPrimary/CardPrimary';
import Form from '../Form/Form';
import Button from '../Common/Button/Button';
import AuthService from '../../utils/ApiUtils/AuthService';
import { withRouter } from 'react-router-dom';

function Login(props){
    const [ userName, setUserName ] = useState('');
    const [ password, setPassword ] = useState('');
    let userName_warning, password_warning;

    function onSubmit() {
        password_warning.textContent = " ";
        if(AuthService.login(userName,password)){
            props.onLogin();
            return;
        }
        password_warning.textContent = "Invalid username or password.";
    }

    function onChange(e) {
        if(e.target.name==='username')
            setUserName(e.target.value);
        else if(e.target.name==='password')
            setPassword(e.target.value);
    }

    function customValidation() {
        let valid = true;
        if(!(userName.length>=3) || !(userName.length<=10) || !/^[A-Za-z0-9]*$/.test(userName)){
            userName_warning.textContent="3-8 characters and no special characters"
            valid = false;
        }else {
            userName_warning.textContent=' ';
        }
        if(!(password.length>=3) || !(password.length<=10) || !(/^[A-Za-z0-9]*[^ ]$/).test(password)){
            password_warning.textContent="3-8 characters and no white space"
            valid = false;
        }else {
            password_warning.textContent=' ';
        }
        return valid;
    }

    return <div className={styles.login}>
        <div className={`row no-gutters justify-content-center`}>
            <div className={`col-12 d-flex align-items-center px-4 py-3 bg-white`}>
                <FontAwesomeIcon
                    icon={faCommentAlt}
                    size="4x"
                />
                <h1 className={`px-3 ${styles.title}`}>
                    Discussion Village
                </h1>
            </div>
            <CardPrimary
                className="col-8 col-lg-6 col-xl-5 p-3 mt-5 bg-grey"
            >
                <Form onSubmit={onSubmit} customValidation={customValidation} autoComplete="off">
                    <div className="row no-gutters" >
                        <div className="col-md-6">
                            <p className="fs-32 m-0">
                                Login
                            </p>
                        </div>
                        <div className="col-12 col-md-6 d-flex flex-column">
                            <div>
                                <div>
                                    <input
                                        name="username"
                                        onChange={onChange}
                                        value={userName}
                                        className="mt-1 w-100"
                                        type="text"
                                        placeholder="username"
                                        required
                                    />
                                </div>
                                <span ref={(ref) => userName_warning = ref} className="invalid-input red-text white-space-nowrap fs-10 fw-600">
                                    &nbsp;
                                </span>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <input
                                        className="w-100"
                                        name="password"
                                        onChange={onChange}
                                        value={password}
                                        type="password"
                                        placeholder="password"
                                        required
                                    />
                                </div>
                                <span ref={(ref) => password_warning = ref} className="invalid-input red-text white-space-nowrap fs-10 fw-600">
                                    &nbsp;
                                </span>
                            </div>
                            <Button
                                type="submit"
                                className="darkBlue white-text fs-20 py-2"
                                text="Login"
                            />
                        </div>
                    </div>
                </Form>
            </CardPrimary>
        </div>
    </div>
}

export default withRouter(Login);