import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { login } from '../../services/auth';
import { modalLogInClose, modalSignUpOpen } from '../../store/modal';

// styling
import c from './LoginForm.module.css';
import close from '../../images/close.svg';

Modal.setAppElement('#root');

function LoginFormModal() {
	const dispatch = useDispatch();
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
		const res = dispatch(login({ email, password }));
    const data = await res.json();
    if (data && data.errors) setErrors(data.errors);
    return data;
	};

	let errorRender;
	if (errors.length > 0) {
		errorRender = (
			<div className={c.div}>
				<ul>
					{errors && errors.map((error, idx) => <li key={idx}>{error}</li>)}
				</ul>
			</div>
		);
	}

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
							<img className={c.x__graphic} src={close} />
						</div>
					</button>
				</div>
				{/* logo */}
				<h3 className={c.title}>Welcome to Sonic Fog</h3>
				<div className={c.form__container}>
					<form onSubmit={handleSubmit} className={c.form}>
						<div className={c.div}>
							<input
								className={c.input}
								type='text'
								placeholder='Email'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required
							/>
						</div>
						{errorRender}
						<div className={c.div}>
							<input
								className={c.input}
								type='password'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								required
							/>
						</div>
						<div>
							<a onClick={(e) => closeLogInOpenSignUp()} className={c.forgot}>
								Forgot your password?
							</a>
						</div>
						<div className={c.div}>
							<button type='submit' className={c.login__button}>
								Log In
							</button>
						</div>
					</form>
					<p className={c.or}>OR</p>
				</div>
				<div className={c.div}>
					<button className={c.demo}>Continue as Demo</button>
				</div>
				<div className={c.div__line}></div>
				<div className={c.div}>
					<a onClick={(e) => closeLogInOpenSignUp()} className={c.signup}>
						Not on Pinterest yet? Sign up
					</a>
				</div>
			</div>
		</Modal>
	);
}

export default LoginFormModal;
