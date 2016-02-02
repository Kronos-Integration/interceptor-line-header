/* jslint node: true, esnext: true */
"use strict";

const Interceptor = require('kronos-interceptor').Interceptor;
const parserFactory = require('./line-header');

/**
 * This interceptor cares about the handling of the messages.
 * It will add the hops and copies the messages
 */
class LineHeaderInterceptor extends Interceptor {

	constructor(config, endpoint) {
		super(config, endpoint);

		// just validate the config once
		parserFactory(config, true);
	}

	static get type() {
		return "line-header";
	}

	get type() {
		return "line-header";
	}

	receive(request, oldRequest) {
		if (request.payload) {
			const streamFilter = parserFactory(this.config);
			const stream = request.payload;
			request.payload = stream.pipe(streamFilter);
		}
		return this.connected.receive(request, oldRequest);
	}
}

exports.Interceptor = LineHeaderInterceptor;
