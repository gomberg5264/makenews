/* eslint max-len:0 no-unused-vars:0, react/no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addFacebookUrlAsync } from "../actions/CategoryActions.js";
import AddURLComponent from "../../utils/components/AddURLComponent.js";
import FacebookLogin from "../../facebook/FacebookLogin";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler";
import FacebookDb from "./../../facebook/FacebookDb";

export const fbRegex = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
export default class FacebookComponent extends Component {

    constructor(props) {
        super(props);
        this.fbLogin = FacebookLogin.instance();
        this.facebookLoginHandler = this.facebookLoginHandler.bind(this);
        this.state = { "errorMessage": "", "hintMessage": "Please enter Facebook URL here", "exampleMessage": "Example: https://www.facebook.com/barackobama" };
    }

    _validateUrl(url, callback, props) {
        if(url.match(fbRegex)) {
            props.dispatch(addFacebookUrlAsync(props.categoryId, url, (response)=> {
                let errorMsg = response === "invalid" ? this.props.categoryDetailsPageStrings.errorMessages.noFbAccess : this.props.categoryDetailsPageStrings.errorMessages.urlSuccess;
                return callback({ "error": errorMsg, "urlAdded": response === "valid" });
            }));
        } else {
            return callback({ "error": this.props.categoryDetailsPageStrings.errorMessages.invalidFacebookUrl });
        }
    }

    facebookLoginHandler() {
        return this.fbLogin.login();
    }

    render() {
        return (
            <AddURLComponent exampleMessage = {this.state.exampleMessage} hintMessage = {this.state.hintMessage} dispatch = {this.props.dispatch} categoryId = {this.props.categoryId} content={this.props.content} categoryDetailsPageStrings={this.props.categoryDetailsPageStrings} addUrlLinkLabel={this.props.categoryDetailsPageStrings.addUrlLinkLabel} errorMessage={this.state.errorMessage} addURLHandler= {this.facebookLoginHandler} sourceDomainValidation={(url, callback) => this._validateUrl(url, callback, this.props)} noValidation/>
        );
    }
}

FacebookComponent.displayName = "FacebookComponent";
FacebookComponent.propTypes = {
    "content": PropTypes.array.isRequired,
    "content.details": PropTypes.array,
    "categoryDetailsPageStrings": PropTypes.object.isRequired,
    "categoryId": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

