/* jslint node: true, esnext: true */
"use strict";

const Interceptor = require('kronos-interceptor').Interceptor;
const lineHeaderFactory = require('./line-header');

/**
 * This interceptor cares about the handling of the messages.
 * It will add the hops and copies the messages
 */
class LineHeaderInterceptor extends Interceptor {

	constructor(endpoint, config) {
		super(endpoint, config);

		this.streamFilter = lineHeaderFactory(config, true);
	}

	static get type() {
		return "line-header";
	}

	get type() {
		return "line-header";
	}

	receive(request, oldRequest) {
		if (request.payload) {
			const stream = request.payload;
			request.payload = stream.pipe(this.streamFilter);
		}
		return this.connected.receive(request, oldRequest);
	}
}

exports.Interceptor = LineHeaderInterceptor;
