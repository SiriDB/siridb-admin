import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';

class Join extends React.Component {

    render() {
        return (
            <div className="row">
                <ul>
                    <li><Link to="databases/new-replica">new replica</Link></li>
                    <li><Link to="databases/new-pool">new pool</Link></li>
                    <li><Link to="databases">back</Link></li>
                </ul>
            </div>
        )
    }
}

export default Join;