export { identity as memo } from "./utils";
export * from "./ref";
// export * from "./hooks";

// import { createElement, Fragment, Component } from "./dom";

export {
	createFactory,
	Fragment,
	Component,
	className,
	jsx,
	jsx as jsxs,
	SVGNamespace,
} from "./dom";

export { createElement as h, createElement } from "./virtual-dom";

export function preventDefault(event) {
	event.preventDefault();
	return event;
}

export function stopPropagation(event) {
	event.stopPropagation();
	return event;
}
