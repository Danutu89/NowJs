// import type { ComponentClass } from "../index"

export const keys /*: <T>(obj: T) => Array<keyof T>*/ = Object.keys;

export function identity() /*<T>(value: T)*/ {
	return value;
}

export function isBoolean(val) {
	return typeof val === "boolean";
}

export function isElement(val) {
	return val && typeof val.nodeType === "number";
}

export function isString(val) {
	return typeof val === "string";
}

export function isNumber(val) {
	return typeof val === "number";
}

export function isObject(val) {
	return typeof val === "object" ? val !== null : isFunction(val);
}

// tslint:disable-next-line:ban-types
export function isFunction(val) {
	return typeof val === "function";
}

export function isComponentClass(Component) {
	const prototype = Component.prototype;
	return !!(prototype && prototype.isReactComponent);
}

export function isArrayLike(obj) {
	return (
		isObject(obj) &&
		typeof obj.length === "number" &&
		typeof obj.nodeType !== "number"
	);
}

export function forEach(value, fn) {
	if (!value) return;
	for (const key of keys(value)) {
		fn(value[key], key);
	}
}
