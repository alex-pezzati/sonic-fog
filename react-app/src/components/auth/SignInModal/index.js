import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Modal from 'react-modal';
import { login } from '../../../store/session';
import { modalLogInClose, modalSignUpOpen } from '../../../store/modal';

// styling
import c from './SignInModal.module.css';
import close from '../../../images/close.svg';

Modal.setAppElement('#root');

function SignInModal() {
    const dispatch = useDispatch();
    const history = useHistory();

    const modalLogInState = useSelector((state) => state.modal.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const closeLogIn = () => {
        dispatch(modalLogInClose());
    };

    const closeLogInOpenSignUp = () => {
        dispatch(modalLogInClose());
        dispatch(modalSignUpOpen());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const user = await dispatch(login({ email, password }));
        if (user?.errors) {
            setErrors(user.errors);
        }
        if (user?.email) {
            dispatch(modalLogInClose());
            history.push(`/`);
        }
    };

    // TODO: for security, change to only display 'Invalid credentials'
    let errorRender;
    if (errors.length > 0) {
        errorRender = (
            <div className={c.div}>
                <ul style={{ color: 'red' }}>
                    {errors &&
                        errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
            </div>
        );
    }

    const demoLogin = () => {
        setEmail('demo@aa.io');
        setPassword('password');
    };

    return (
        <Modal
            isOpen={modalLogInState}
            className={c.content}
            overlayClassName={c.overlay}
            shouldCloseOnOverlayClick={false}
            shouldFocusAfterRender={true}
        >
            <div className={c.container}>
                <div className={c.x__container}>
                    <button onClick={closeLogIn} className={c.x__button}>
                        <div className={c.x__div}>
                            <img
                                className={c.x__graphic}
                                src={close}
                                alt="close login"
                            />
                        </div>
                    </button>
                </div>
                {/* logo */}
                <h3 className={c.title}>Welcome to Sonic Fog</h3>
                <div className={c.form__container}>
                    <form onSubmit={handleSubmit} className={c.form}>
                        {errorRender}
                        <div className={c.div}>
                            <input
                                className={c.input}
                                type="text"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className={c.div}>
                            <input
                                className={c.input}
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        {/* <div onClick={(e) => closeLogInOpenSignUp()} className={c.forgot}>
                Forgot your password?
            </div> */}
                        <div className={c.div}>
                            <button type="submit" className={c.login__button}>
                                Log In
                            </button>
                        </div>
                        <p className={c.or}>OR</p>
                        <div className={c.div}>
                            <button
                                // id='demo-login'
                                type="submit"
                                onClick={demoLogin}
                                className={c.demo}
                            >
                                Continue as Demo
                            </button>
                        </div>
                    </form>
                </div>
                <div className={c.div__line}></div>
                <div className={c.div}>
                    <div
                        onClick={(e) => closeLogInOpenSignUp()}
                        className={c.signup}
                    >
                        Not on Sonic Fog yet? Sign up
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default SignInModal;
