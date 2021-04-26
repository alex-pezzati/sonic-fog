import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from 'react-modal';
import { signup, login } from '../../../store/session';
import { modalSignUpClose, modalLogInOpen } from '../../../store/modal';

import c from './SignupModal.module.css';
import close from '../../../images/close.svg';

Modal.setAppElement('#root');

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const modalSignUpState = useSelector((state) => state.modal.signup);

  //TODO: Add inputs for firstname, lastname
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState([]);

  const closeSignUp = () => {
    dispatch(modalSignUpClose());
  };

  const closeSignUpOpenLogIn = () => {
    dispatch(modalSignUpClose());
    dispatch(modalLogInOpen());
  };

  const handleSubmit = async (e) => {
    console.log('hi')
    e.preventDefault();
    setErrors([]);
    if (password === confirmPassword) {
      const user = await dispatch(signup({ username, email, password }));
      if (!user.errors) {
        history.push(`/`)
      } else {
        setErrors(user.errors);
      }
    } else {
      setErrors(['Passwords must match'])
    }
  };

  let errorRender;
  if (errors.length > 0) {
    errorRender = (
      <div className={c.div}>
        <ul style={{ color: 'red' }}>
          {errors && errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
      </div>
    );
  }

  const demoLogin = () => {
    setEmail('demo@aa.io');
    setPassword('password');
  };
  const handleSubmitDemoLogin = async (e) => {
    e.preventDefault();
    let res = await dispatch(login({ email, password }))
    console.log('submit', res)
    dispatch(modalSignUpClose())
    history.push(`/`)
  };

  return (
    <Modal
      isOpen={modalSignUpState}
      className={c.content}
      overlayClassName={c.overlay}
      shouldCloseOnOverlayClick={false}
      shouldFocusAfterRender={true}
    >
      <div className={c.container}>
        <div className={c.x__container}>
          <button onClick={closeSignUp} className={c.x__button}>
            <div className={c.x__div}>
              <img className={c.x__graphic} src={close} alt='close signup' />
            </div>
          </button>
        </div>
        {/* LOGO */}
        <h3 className={c.title}>Welcome to Sonic Fog</h3>
        <h3 className={c.subtitle}>Noisy and Moist</h3>
        <div className={c.form__container}>
          <form onSubmit={handleSubmit} className={c.form}>
            {errorRender}
            <input
              type='text'
              className={c.input}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='Email'
              required
            />
            <input
              type='text'
              className={c.input}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder='Username'
              name='username'
              required
            />
            <input
              type='password'
              className={c.input}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Password'
              name='password'
              required
            />
            <input
              type='password'
              className={c.input}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder='Confirm Password'
              name='confirm password'
              required
            />
            <button type='submit' className={c.continue__button}>
              Continue
						</button>
          </form>
          <p className={c.or}>OR</p>
        </div>
        <form onSubmit={handleSubmitDemoLogin} className={c.form}>
          <div className={c.div}>
            <button
              type='submit'
              onClick={demoLogin}
              className={c.demo}
            >
              Continue as Demo
            </button>
          </div>
        </form>
        <div className={c.div__line}></div>
        <div className={c.div}>
          <div onClick={(e) => closeSignUpOpenLogIn()} className={c.signup}>
            Already a member? Log in
					</div>
        </div>
      </div>
    </Modal>
  );
}

export default SignupFormModal;
