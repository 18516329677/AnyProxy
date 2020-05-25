'use strict';
var util = require('../lib/util');
var urlMatcher = require("url-matcher");
var sleep = require('sleep');
var url = require('url');

module.exports = {

    *beforeSendRequest(requestDetail) {

        const mocklist = util.getMockfileList();
        for (var i = 0; i < mocklist.length; i++) {
            var current_url = new URL(requestDetail.url);
            var current_search_params = "";
            
            if (current_url.search !== undefined && current_url.search !== "") {
                current_search_params = (current_url.search).replace("?", "/");
            } else {
                current_search_params = "/emptysearchparams";
            }

            var mocked_search_params = "";

            if (mocklist[i].request.query !== undefined && mocklist[i].request.query !== "") {
                mocked_search_params = (mocklist[i].request.query).replace("?", "/");
            } else {
                mocked_search_params = "/emptysearchparams";
            }

            if (mocklist[i].mock && urlMatcher.matchPattern(mocklist[i].request.path, requestDetail.requestOptions.path) !== undefined && urlMatcher.matchPattern(mocked_search_params, current_search_params) !== undefined && mocklist[i].request.method === requestDetail.requestOptions.method) {
                var newResponse = [];
                console.log('Url matched, will use mock data');
                if (mocklist[i].response.status !== null && mocklist[i].response.status !== undefined) {
                    newResponse.statusCode = mocklist[i].response.status;
                }

                if (mocklist[i].response.headers !== null && mocklist[i].response.headers !== undefined) {
                    newResponse.header = mocklist[i].response.headers;
                }

                if (mocklist[i].response.body !== null && mocklist[i].response.body !== undefined) {
                    newResponse.body = JSON.stringify(mocklist[i].response.body);
                }

                if (mocklist[i].wait) {
                    sleep.sleep(mocklist[i].wait);
                }

                return {
                    response: newResponse
                }
            }
        }
    },
};