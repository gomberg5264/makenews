import React, { Component, PropTypes } from "react";

export default class Source extends Component {
    render() {
        return (
            <div className="source">
                <div className="source-icon">
                    <img src={this.props.source.picture.data.url} />
                </div>
                <div className="source-title">
                    { this.props.source.name }
                </div>
            </div>
        );
    }
}

Source.propTypes = {
    "source": PropTypes.object.isRequired
};
