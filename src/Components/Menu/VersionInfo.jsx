import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { IndexLink } from 'react-router';
import VersionStore from '../../Stores/VersionStore.jsx';

class VersionInfo extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = VersionStore;
    }

    render() {
        return (
            <div className="row">
                <dl className="dl-horizontal">
                    <dt>Version:</dt>
                    <dd>{this.state.version}</dd>
                    <dt>Build:</dt>
                    <dd>{this.state.build} {this.state.date}</dd>
                </dl>
                <ul>
                    <li><IndexLink to="/"><i className="fa fa-fw fa-arrow-left"></i>back</IndexLink></li>
                </ul>
            </div>
        )
    }
}

export default VersionInfo;