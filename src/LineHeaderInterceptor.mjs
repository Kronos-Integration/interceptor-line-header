/* jslint node: true, esnext: true */
'use strict';

import {
	Interceptor
}
from 'kronos-interceptor';

import { 
	LineHeaderFactory
}
from './line-header';

/**
 * This interceptor cares about the handling of the messages.
 * It will add the hops and copies the messages
 */
export default class LineHeaderInterceptor extends Interceptor {

	constructor(config, endpoint) {
		super(config, endpoint);

		// just validate the config once
		LineHeaderFactory(config.config, true);
	}

	static get name() {
		return 'line-header';
	}

	receive(request, oldRequest) {
		if (request.payload) {
			const streamFilter = LineHeaderFactory(this.config.config);
			const stream = request.payload;
			request.payload = stream.pipe(streamFilter);
		}
		return this.connected.receive(request, oldRequest);
	}
}
