import React from 'react';
import './css/style.css';
import { store } from 'react-notifications-component';
import requestPromise from 'request-promise';
import Cat from '../images/cat_pain.png';

class RegistrationComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            image: null
        }
    }
    onChangeHandler = event => {
        if(event.target.name === 'image') {
            this.setState({ image: event.target.files[0]});
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
        console.log(this.state);
    }
    handleSubmit = async event => {
        event.preventDefault();
        try {
            const data = new FormData();
            data.append('image', this.state.image);
            data.append('username', this.state.username);
            data.append('password', this.state.password);
            await (fetch('http://127.0.0.1:3002/api/authorization/signup', {
                method: 'POST',
                body: data
            }).then(res => {
                if (res.status !== 200) return Promise.reject(res.json());
                return Promise.resolve(res.json());
            }));
            store.addNotification({
                title: "Registration",
                message: "Вы были успешно зарегистрированы",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 1000,
                    onScreen: false
                }
            });
            setTimeout(() => {
                this.props.history.push({
                    pathname: '/'
               })
            }, 1000);
        } catch (err) {
            err = await err;
            store.addNotification({
                title: "Registration",
                message: err.message,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 1000,
                    onScreen: false
                }
            });
        }

    }
    render() {
        return (
            <form class="page-wrap" action="" onSubmit={this.handleSubmit}>
                <section class="main_sect">
                    <h1 class="welc">REGISTRATION</h1>
                    <label class="user"><input type="text" value={this.state.username} name="username" onChange={this.onChangeHandler} class="tb_1" />USERNAME</label>
                    <label class="pasv"><input type="password" value={this.state.password} name="password" onChange={this.onChangeHandler} class="tb_2" />PASSWORD</label>
                    <label class="photo_input">SELECT PHOTO<input type="file" name="image" required={true} accept="image/jpeg,image/png,image/gif" onChange={this.onChangeHandler} class="log1" /></label>
                    <img src={Cat} alt="car_who_not_hide_the_pain" class="profile_avatar" />
                    <input type="submit" value="REGISTER" class="reg" />
                </section>
            </form>
        );
    }
}
export default RegistrationComponent;