/* jslint node: true, esnext: true */
"use strict";

import LineHeaderInterceptor from './LineHeaderInterceptor';

import { 
  LineHeaderFactory
}
from './line-header';

function registerWithManager(manager) {
  return manager.registerInterceptor(LineHeaderInterceptor);
}

export {
  LineHeaderInterceptor,
  LineHeaderFactory,
  registerWithManager
};
