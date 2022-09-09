export const prefix = 'Bing Bong! | ';

/**
 * Logs a message to the console
 * @param {string} msg Message to log
 * @param  {...any} args Additional messages/objects to output
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/log|console.log()}
 */
export function log(msg, ...args) {
	console.log(prefix + msg, ...args);
}

/**
 * Logs a message to the console with the debug log level
 * @param {string} msg Message to log
 * @param  {...any} args Additional messages/objects to output
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/debug|console.debug()}
 */
export function debug(msg, ...args) {
	console.debug(prefix + msg, ...args);
}

/**
 * Logs a message to the console with the info log level
 * @param {string} msg Message to log
 * @param  {...any} args Additional messages/objects to output
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/info|console.info()}
 */
export function info(msg, ...args) {
	console.info(prefix + msg, ...args);
}

/**
 * Logs a message to the console with the warn log level
 * @param {string} msg Message to log
 * @param  {...any} args Additional messages/objects to output
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/warn|console.warn()}
 */
export function warn(msg, ...args) {
	console.warn(prefix + msg, ...args);
}

/**
 * Logs a message to the console with the error log level
 * @param {string} msg Message to log
 * @param  {...any} args Additional messages/objects to output
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/error|console.error()}
 */
export function error(msg, ...args) {
	console.error(prefix + msg, ...args);
}
