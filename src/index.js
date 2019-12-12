import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthorizationComponent from './components/authorizatioin/authorization.component';
import RegistrationComponent from './components/registration/registration.component';
import PageComponent from './components/page/page.component';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';
import { BrowserRouter as Router, Route } from 'react-router-dom';
ReactDOM.render(
    <Router basename={process.env.PUBLIC_URL}>
        <ReactNotification />
        <Route exact path="/" component={AuthorizationComponent} />
        <Route exact path="/page" component={PageComponent} />
        <Route exact path="/register" component={RegistrationComponent} />
    </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
