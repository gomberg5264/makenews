import React, { Component, PropTypes } from "react";
import Sources from "./Sources";
import FacebookTabs from "./FacebookTabs";

export default class SourcePane extends Component {

    render() {
        return (
            <div className="sources-suggestions">
                <FacebookTabs dispatch={this.props.dispatch} />
                <button className="add-all">
                    <img src="./images/add-btn-dark.png"/>
                    {"Add All"}
                </button>
                <Sources />
            </div>
        );
    }
}

SourcePane.propTypes = {
    "dispatch": PropTypes.func.isRequired
};
