import { Component, createElement, Fragment, h } from "./jsx/index.js";

export * from "./hooks.js";
export { render } from "./jsx/virtual-dom";
// export { default as Component } from "./component/index.js";
export default {
	createElement: createElement,
	h,
	Fragment: Fragment,
	Component: Component,
};
