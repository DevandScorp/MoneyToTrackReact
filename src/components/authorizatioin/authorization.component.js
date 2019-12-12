import React from 'react';
import './css/style.css';
import { Redirect } from 'react-router-dom';
import { store } from 'react-notifications-component';
import requestPromise from 'request-promise';


class AuthorizationComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            registrationRedirect: false,
            mainPageRedirect: false
        }
    }
    changeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    logIn = async event => {
        try {
            console.log(this.state);
            const result = await requestPromise({
                method: 'POST',
                uri: 'http://127.0.0.1:3002/api/authorization/login',
                body: {
                    username: this.state.username,
                    password: this.state.password
                },
                json: true
            });
            console.log(result);
            store.addNotification({
                title: "Authorization",
                message: "Вы успешно авторизировались",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 500,
                    onScreen: false
                }
            });
            setTimeout(() => {
                this.props.history.push({
                    pathname: '/page',
                    state: result
                });
            }, 500);
        } catch (err) {
            console.log(err);
            store.addNotification({
                title: "Authorization",
                message: err.message,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 500,
                    onScreen: false
                }
            });
        }

    }
    render() {
        if (this.state.registrationRedirect) {
            this.props.history.push({
                pathname: '/register'
            })
        }
        return (
            <div class="page-wrap">
                <section class="main_sect">
                    <h1 class="welc">Welcome to MoneyOnTrack</h1>
                    <label class="user">
                        <input type="text" name="username" class="tb_1" value={this.state.username} onChange={this.changeHandler} />USERNAME
                        </label>
                    <label class="pasv">
                        <input type="password" name="password" class="tb_2" value={this.state.password} onChange={this.changeHandler} />PASSWORD
                    </label>
                    <input type="submit" value="LOG IN" class="log" onClick={this.logIn} />
                    <p class="or">or, if you don’t have an account</p>
                    <input type="submit" value="REGISTER" class="reg" onClick={() => this.setState({ registrationRedirect: true })} />
                </section>
            </div>
        );
    }
}
export default AuthorizationComponent;