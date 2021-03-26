import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from 'react-modal';
import { signup } from '../../store/session';
import { modalSignUpClose, modalLogInOpen } from '../../store/modal';

import c from './SignupForm.module.css';
import close from '../../images/close.svg';

Modal.setAppElement('#root');

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const modalSignUpState = useSelector((state) => state.modal.signup);

  //TODO: Add inputs for firstname, lastname
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState([]);
  // I added this just to suppress the warning about errors never being used
  if (false) {
    console.log(errors)
  }

  const closeSignUp = () => {
    dispatch(modalSignUpClose());
  };

  const closeSignUpOpenLogIn = () => {
    dispatch(modalSignUpClose());
    dispatch(modalLogInOpen());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (password === confirmPassword) {


    setErrors([]);

    const data = await dispatch(signup({ displayName, email, password })).then(data => data);
    if (data && data.errors) {
      setErrors(data.errors);
    }
    if (data && data.email) {
      history.push(`/users/${data.display_name}`)
    }
    // }
    // return setErrors(['Confirm Password field must be the same as the Password field']);
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
        <h3 className={c.subtitle}>Join now to Ride the Wave</h3>
        <div className={c.form__container}>
          <form onSubmit={handleSubmit} className={c.form}>
            {/* <ul>
                            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                        </ul> */}
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
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
              placeholder='Display Name'
              required
            />
            <input
              type='password'
              className={c.input}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Password'
              required
            />
            {/* <input
                            type="password"
                            className={c.input}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder='ConfirmPassword'
                            required
                        /> */}
            <button type='submit' className={c.continue__button}>
              Continue
						</button>
          </form>
          <p className={c.or}>OR</p>
        </div>
        <div className={c.div}>
          <button className={c.demo}>Continue as Demo</button>
        </div>
        <div className={c.div__line}></div>
        <div className={c.div}>
          {/* this is a temp fix, we need to add an href to this anchor tag */}
          {/*eslint-disable-next-line */}
          <a onClick={(e) => closeSignUpOpenLogIn()} className={c.signup}>
            Already a member? Log in
					</a>
        </div>
      </div>
    </Modal>
  );
}

export default SignupFormModal;
