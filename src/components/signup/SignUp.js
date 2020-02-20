import React, { useState, useEffect } from 'react';
import './signup.css';
import { Link } from 'react-router-dom';

// todo: Remove error message when correcting or at backspace

const SignUp = () => {
    /**************************STATE SECTION************************/
    //**Display Name States */
    const [username, setUsername] = useState(null);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState(null);

    //**Password States */
    const [password, setPassword] = useState(null);
    const [rePassword, setRePassword] = useState(null);
    const [passErrorMessage, setPassErrorMessage] = useState(null);

    //**Email States */
    const [email, setEmail] = useState('');

    const [success, setSuccessMessage] = useState(null);

    // todo:
    /**
     * 
     *   const [walletRecord, setWalletRecord] = useState({
    mnemonic: '',
    encryption: '',
    signed64: ''
  });
     */

    // useEffect(() => {
    //     validateForm();
    // }, [usernameErrorMessage, passErrorMessage]);

    const onFormSubmit = e => {
        e.preventDefault();
        validateForm(e);
    };

    /****** Function to compare password, usename, fields */

    const validateForm = e => {
        if (!username) {
            setUsernameErrorMessage('Enter username');
        } else if (!password) {
            setUsernameErrorMessage('');
            setPassErrorMessage('Enter password');
        } else if (password !== rePassword) {
            setUsernameErrorMessage('');
            setPassErrorMessage('Passwords do not match!');
        } else {
            setPassErrorMessage('');
            handleSignUp();
        }
    };

    const handleSignUp = async () => {
        if (username && password)
            try {
                const response = await fetch(
                    'http://localhost:5000/users/signup',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userName: username,
                            email: email,
                            password: password,
                        }),
                    }
                );
                const data = await response.json();

                if (data.error) {
                    setUsernameErrorMessage(data.error);
                } else if (data.token) {
                    setSuccessMessage(data.token);
                }

                console.log('data', data);
            } catch (error) {
                console.error(error);
            }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <Link to="/setup">setup</Link>
            <div className="">
                <div className="card">
                    <div className="card-header">
                        <h3>Create Account</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={onFormSubmit} value="submit">
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fas fa-users"></i>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="username"
                                    onChange={e => {
                                        setUsername(e.target.value);
                                        setUsernameErrorMessage(null);
                                    }}
                                />
                            </div>
                            {/***** USERNAME ERROR  *****/}
                            {usernameErrorMessage && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {usernameErrorMessage}
                                </div>
                            )}

                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fas fa-key"></i>
                                    </span>
                                </div>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="password"
                                    onChange={e => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fas fa-key"></i>
                                    </span>
                                </div>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="re-password"
                                    onChange={e => {
                                        setRePassword(e.target.value);
                                    }}
                                />
                            </div>
                            {/***** PASS ERROR  *****/}
                            {passErrorMessage && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {passErrorMessage}
                                </div>
                            )}
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="email (optional)"
                                    onChange={e => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            {/***** SUCCESS!  *****/}
                            {success && (
                                <div class="alert alert-success" role="alert">
                                    {'Success! '}
                                    <span role="img" aria-label="thumbs-uo">
                                        👍
                                    </span>
                                </div>
                            )}
                            <div className="form-group">
                                <input
                                    type="submit"
                                    value="Sign Up"
                                    className="btn float-right login_btn"
                                />
                            </div>
                        </form>
                        <div className="card-footer">
                            <div className="d-flex justify-content-left links">
                                <a href="#">Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
