/*global describe, it*/
/* jslint node: true, esnext: true */
"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

var _ = require('underscore');
const mockReadStream = require('./mockReadStream');

const checkHeaderFactory = require('../lib/line-header.js');

// The meta info for the check
const expected_1 = ["col_1", "col_2", "col_3", "col_4", "col_5", "col_6"];
const expected_2 = ["col_1", "col_2", "col_3", "col 4", "col_5", "col_6"];
const expected_3 = ["col_1", "col_2", "col_3", "c4", "col_5", "col_6"];
const actual_otherOrder = ["col_1", "col_3", "col_4", "col_2", "col_5", "col_6"];
const actual_otherOrder_plus = ["col_1", "col_3", "col_4", "gum", "col_2", "col_5", "col_6"];
const actual_missingOne = ["col_1", "col_2", "col_4", "col_5", "col_6"];
const actual_missingTwo = ["col_1", "col_2", "col_4", "col_5"];
const actual_otherOrder_plus_mixed = ["COL_1", "col_3", "COL_4", "gum", "col_2", "COL_5", "cOl_6"];


const checkProperties = {
	"expectedHeader": ["col_1", "col_2", "col_3", ["col_4", "col 4", "c4"], "col_5", "col_6"],
	"fieldNames": ["c1", "c2", "c3", "c4", "c5", "c6"],
	"caseSensitive": true,
	"strict": {
		"val": true,
		"severity": "skip_record"
	},
	"additionalColumns": false,
	"missingColumns": false,
	"mandatoryColumns": ["gum"],
	"severity": "abort_file"
};



let cp = _.clone(checkProperties);

cp.missingColumns = true;
cp.additionalColumns = true;
cp.strict.val = false;
cp.mandatoryColumns = ["c1", "c3", "c6"];

let obj = {
	"lineNumber": 0,
	"data": ["col_6", "col_3", "col_7", "col 4", "col_9", "col_1"]
};

let header = collect(obj, verify, cp);

function verify(err, objects, header) {
	assert.notOk(err);

	assert.equal(objects.length, 1);

	assert.deepEqual(objects[0], {
		"lineNumber": 0,
		"data": ["col_6", "col_3", "col_7", "col 4", "col_9", "col_1"]
	});

}


function collect(objects, verifyFunction, opts) {
	let dummyStream = mockReadStream();
	dummyStream.add(objects);

	let lines = [];
	let headerVal;

	let headerChecker = checkHeaderFactory(opts);
	dummyStream.pipe(headerChecker).on('data', function (line) {
			lines.push(line);
		})
		.on('error', function (err) {
			verifyFunction(err, lines);
		})
		.on('header', function (header) {
			headerVal = header;
		})
		.on('end', function () {
			verifyFunction(false, lines);
		});

	return headerVal;
}
