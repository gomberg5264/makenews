/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import RssRouteHelper from "../../../src/routes/helpers/RssRouteHelper";
import RssClient from "../../../src/rss/RssClient";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import LogTestHelper from "../../helpers/LogTestHelper";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import LogTestHelper from "../../helpers/LogTestHelper";
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";

describe("RssRouteHelper", () => {
    function mockResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
                done();
            }
        };
        return response;
    }

    function mockSuccessResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                let items = jsonData.items;
                if(items) {
                    let expectedItems = expectedValues.json.items;
                    expect(items.length).to.eq(expectedItems.length);
                    for(let index = 0; index < items.length; index += 1) {
                        expect(items[index].title).to.eq(expectedItems[index].title);
                        expect(items[index].description).to.eq(expectedItems[index].description);
                    }
                }
                done();
            }
        };
        return response;
    }

    before("TwitterRouteHelper", () => {
        sinon.stub(RssClient, "logger").returns(LogTestHelper.instance());
    });

    after("TwitterRouteHelper", () => {
        RssClient.logger.restore();
    });

    it("should return invalid if the url doesn't return feeds", (done) => {
        let data = `<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
        <TITLE>302 Moved</TITLE></HEAD><BODY>
        <H1>302 Moved</H1>
        The document has moved
        <A HREF="http://www.google.co.in/?gfe_rd=cr&amp;ei=h91eVqj4N-my8wexop6oAg">here</A>.
        </BODY></HTML>`;
        nock("http://www.google.com")
            .get("/users")
            .reply(HttpResponseHandler.codes.OK, data);

        let url = "http://www.google.com/users";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": url + " is not a proper feed" } });
        let rssRouteHelper = new RssRouteHelper(request, response);
        rssRouteHelper.feedsForUrl();
    });

    it("should return feeds for the given url of a user", (done) => {
        let data = `<rss version="2.0"><channel>
        <title>hindu</title>
        <link>http://hindu.com</link>
        <description>from hindu</description>
            <item>
                <title>test</title>
                <description>news cricket</description>
            </item>
        </channel></rss>`;
        nock("http://www.thehindu.com/sport/cricket")
            .get("/?service=rss")
            .reply(HttpResponseHandler.codes.OK, data);
        let request = {
            "query": {
                "url": "http://www.thehindu.com/sport/cricket/?service=rss"
            }
        };
        let feedsJson = {
            "items": [{ "title": "test",
                "description": "news cricket" }]
        };
        let response = mockSuccessResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedsJson });
        let rssRouteHelper = new RssRouteHelper(request, response);
        rssRouteHelper.feedsForUrl();
    });

    it("should return 404 error if url is invalid", (done) => {
        nock("http://www.test1.com/cricket")
            .get("/", {
            })
            .reply(HttpResponseHandler.codes.NOT_IMPLEMENTED, "");

        let url = "http://www.test1.com/cricket/";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": "Request failed for " + url } });
        let rssRouteHelper = new RssRouteHelper(request, response);
        rssRouteHelper.feedsForUrl();
    });

    it("should return error if request to url returns error", (done) => {
        nock("http://www.test1.com/cricket")
            .get("/", {
            })
            .replyWithError("something awful happened");

        let url = "http://www.test1.com/cricket/";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json":
        { "message": "Request failed for " + url } });
        let rssRouteHelper = new RssRouteHelper(request, response);
        rssRouteHelper.feedsForUrl();
    });

    it("should return empty response if url is empty", (done) => {
        let request = {
            "query": {
                "url": ""
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });
        let rssRouteHelper = new RssRouteHelper(request, response);
        rssRouteHelper.feedsForUrl();
    });

    it("should return empty response if url is not present", (done) => {
        let request = {
            "query": {
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });
        let rssRouteHelper = new RssRouteHelper(request, response);
        rssRouteHelper.feedsForUrl();
    });

    describe("feedsForAllUrls", () => {
        it("should return the updated rss feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        {
                            "url": "www.rssurl1.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                            "timestamp": "1232323"
                        },
                        {
                            "url": "www.rssurl2.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D82343249",
                            "timestamp": "3432424234"
                        }
                    ]
                }
            };

            let feedResponse = {
                "6E4B3A-5B3E-15CD-95CB-7E9D89857316": { "items": [{ "title": "test", "description": "news cricket" }] },
                "6E4B3A-5B3E-15CD-95CB-7E9D82343249": { "items": [{ "title": "test1", "description": "news cricket1" }] }
            };
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedResponse });
            let rssRouteHelper = new RssRouteHelper(requestData, response);

            let sandbox = sinon.sandbox.create();
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestMock = sandbox.stub(rssRequestHandlerInstance, "fetchRssFeedRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[0].url).returns(Promise.resolve({ "items": [{ "title": "test", "description": "news cricket" }] }));
            fetchRssFeedRequestMock.withArgs(requestData.body.data[1].url).returns(Promise.resolve({ "items": [{ "title": "test1", "description": "news cricket1" }] }));
            rssRouteHelper.feedsForAllUrls();
            rssRequestHandlerMock.verify();
            sandbox.restore();
        });

        it("should set invalid response only for the particular url, if fetching fails", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        {
                            "url": "www.rssurl1.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                            "timestamp": "1232323"
                        },
                        {
                            "url": "www.rssurl2.com/rss",
                            "id": "6E4B3A-5B3E-15CD-95CB-7E9D82343249",
                            "timestamp": "3432424234"
                        }
                    ]
                }
            };

            let feedResponse = {
                "6E4B3A-5B3E-15CD-95CB-7E9D89857316": { "items": [{ "title": "test", "description": "news cricket" }] },
                "6E4B3A-5B3E-15CD-95CB-7E9D82343249": "failed"
            };
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedResponse });
            let rssRouteHelper = new RssRouteHelper(requestData, response);

            let sandbox = sinon.sandbox.create();
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestMock = sandbox.stub(rssRequestHandlerInstance, "fetchRssFeedRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[0].url).returns(Promise.resolve({ "items": [{ "title": "test", "description": "news cricket" }] }));
            fetchRssFeedRequestMock.withArgs(requestData.body.data[1].url).returns(Promise.reject("some error"));
            rssRouteHelper.feedsForAllUrls();
            rssRequestHandlerMock.verify();
            sandbox.restore();
        });
    });
});
