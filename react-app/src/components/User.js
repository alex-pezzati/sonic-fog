import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function User() {
	const sessionUser = useSelector((state) => state.session.user);
	// Notice we use useParams here instead of getting the params
	// From props.
	const { displayName } = useParams();
	const { email } = sessionUser;

	return (
		<ul>
			<li>
				<strong>Display Name:</strong> {displayName}
			</li>
			<li>
				<strong>Email: </strong> {email}
			</li>
		</ul>
	);
}
export default User;
