/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

"use strict";
import { allFeeds } from "../../../src/js/surf/reducers/SurfReducer.js";
import { DISPLAY_ALL_FEEDS } from "../../../src/js/surf/actions/AllFeedsActions.js";
import { expect } from "chai";

let messages = { "fetchingFeeds": "Fetching feeds...", "noFeeds": "No feeds available" };
describe("Surf Reducer", () => {
    describe("allFeeds", () => {
        it("default state should return empty list", () => {
            expect({ "feeds": [], "messages": messages }).to.deep.equal(allFeeds());
        });

        it("should return given feeds", () => {
            let feeds = [
                {
                    "content": "www.facebookpolitics1.com",
                    "feedType": "rss",
                    "name": "Sports",
                    "tags": [
                        "Dec 10 2015    14:27:37"
                    ],
                    "title": "tn",
                    "type": "description"
                },
                {
                    "content": "www.facebookpolitics2.com",
                    "feedType": "rss",
                    "name": "Sports, Politics",
                    "tags": [""],
                    "title": "tn",
                    "type": "description"
                }
            ];
            let action = { "type": DISPLAY_ALL_FEEDS, "feeds": feeds, "refreshState": false, "progressPercentage": 0 };

            expect({ "feeds": feeds, "messages": messages, "refreshState": false, "progressPercentage": 0 }).to.deep.equal(allFeeds(undefined, action));
        });
    });
});
