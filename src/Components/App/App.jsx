import React from 'react';
import Vlow from 'vlow';
import { render } from 'react-dom';
import AuthStore from '../../Stores/AuthStore.jsx';
import AlertStore from '../../Stores/AlertStore.jsx';
import AlertActions from '../../Actions/AlertActions.jsx';
import Auth from '../Auth/Auth.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class App extends Vlow.Component {

    constructor(props) {
        super(props);
        this.mapStores([AuthStore, AlertStore]);
    }

    render() {
        let error = (this.state.alert !== null) ? (
            <div className={`alert alert-${this.state.alert.severity}`}><a onClick={AlertActions.clearAlert} className="close">&times;</a>{this.state.alert.msg}</div>
        ) : null;
        return (
            <div className="container container-start">
                <div className="row logo">
                    <img src="/img/siridb-large.png" alt="SiriDB Logo" />
                </div>
                { (this.state.user) ? this.props.children : <Auth /> }
                <ReactCSSTransitionGroup
                    component="div"
                    className="alert-wrapper"
                    transitionName="alert-animation"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={500}>
                    {error}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default App;