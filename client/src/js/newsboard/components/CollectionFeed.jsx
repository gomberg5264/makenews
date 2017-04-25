/* eslint brace-style:0  no-unused-expressions:0*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import { deleteCollectionFeed } from "../actions/DisplayCollectionActions";
const MAX_DESCRIPTION_LENGTH = 300;

export default class CollectionFeed extends Component {

    getMedia() {
        if(this.props.feed.videos && this.props.feed.videos.length) {
            return <img src={this.props.feed.videos[0].thumbnail}/>; //eslint-disable-line no-magic-numbers
        } else if (this.props.feed.images && this.props.feed.images.length) {
            return <img src={this.props.feed.images[0].thumbnail}/>; //eslint-disable-line no-magic-numbers
        }
        return null;
    }

    _displayArticle() {
        this.props.dispatch(displayArticle(this.props.feed));
    }

    render() {
        const feed = this.props.feed;
        const [video] = feed.videos || [];
        const [image] = feed.images || [];
        const description = feed.description || "";
        let feedClass = this.props.tab === WRITE_A_STORY ? "story-collection-feed collection-feed" : "collection-feed";
        return (<div className={feedClass}>
                    { this.props.tab !== WRITE_A_STORY &&
                        <button className="delete-feed" onClick={(event) => {
                            let docId = feed._id;
                            let feedId = null;
                            if(!feed.selectText) {
                                if(feed.sourceDeleted) {
                                    feedId = feed._id;
                                }
                                docId += this.props.collectionId;
                            }
                            this.props.dispatch(deleteCollectionFeed(event, docId, feedId));
                        }}
                        >&times;
                        </button>
                    }
                    <div className={`${feedClass}__body`}>
                        <div className={`${feedClass}__title`}>{feed.title}</div>
                        <div className={`${feedClass}__media`}>{this.getMedia()}</div>
                        <div className={`${feedClass}__description`}>{getHtmlContent(feed.description)}</div>
                        <div className={`${feedClass}__source`}>
                            <div className="source-type">
                                <i className={`fa fa-${feed.sourceType}`}/>
                            </div>
                            <div className="source">{`${[feed.tags]} |`}</div>
                            <div className="date">{DateTimeUtil.getLocalTime(feed.pubDate)}</div>
                        </div>
                    </div>
                    <div className={`${feedClass}__readmore`}>
                        {feed.sourceType === "web" || video || image || description.length > MAX_DESCRIPTION_LENGTH
                        ? <button className={`${feedClass}__readmore-button`} onClick={() => { this._displayArticle(); }}>Read more ></button> : ""}
                    </div>
              </div>);
    }
}

CollectionFeed.propTypes = {
    "feed": PropTypes.object.isRequired,
    "dispatch": PropTypes.func,
    "tab": PropTypes.string,
    "collectionId": PropTypes.string.isRequired
};
