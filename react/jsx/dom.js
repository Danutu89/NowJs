import { isRef } from "./ref";
import {
	isString,
	isArrayLike,
	isBoolean,
	isObject,
	isFunction,
	isElement,
	isNumber,
	keys,
	forEach,
	isComponentClass,
} from "./utils";
import { isUnitlessNumber } from "./css-props";
// import type { HTML, JSX } from "../index"
const __FULL_BUILD__ = false;

export const SVGNamespace = "http://www.w3.org/2000/svg";
const XLinkNamespace = "http://www.w3.org/1999/xlink";
const XMLNamespace = "http://www.w3.org/XML/1998/namespace";

// https://facebook.github.io/react/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored
// Emulate JSX Expression logic to ignore certain type of children or className.
function isVisibleChild(value) {
	return !isBoolean(value) && value != null;
}

/**
 * Convert a `value` to a className string.
 * `value` can be a string, an array or a `Dictionary<boolean>`.
 */
export function className(value) {
	if (Array.isArray(value)) {
		return value.map(className).filter(Boolean).join(" ");
	} else if (isObject(value)) {
		return keys(value)
			.filter((k) => value[k])
			.join(" ");
	} else if (isVisibleChild(value)) {
		return "" + value;
	} else {
		return "";
	}
}

const svg = {
	animate: 0,
	circle: 0,
	clipPath: 0,
	defs: 0,
	desc: 0,
	ellipse: 0,
	feBlend: 0,
	feColorMatrix: 0,
	feComponentTransfer: 0,
	feComposite: 0,
	feConvolveMatrix: 0,
	feDiffuseLighting: 0,
	feDisplacementMap: 0,
	feDistantLight: 0,
	feFlood: 0,
	feFuncA: 0,
	feFuncB: 0,
	feFuncG: 0,
	feFuncR: 0,
	feGaussianBlur: 0,
	feImage: 0,
	feMerge: 0,
	feMergeNode: 0,
	feMorphology: 0,
	feOffset: 0,
	fePointLight: 0,
	feSpecularLighting: 0,
	feSpotLight: 0,
	feTile: 0,
	feTurbulence: 0,
	filter: 0,
	foreignObject: 0,
	g: 0,
	image: 0,
	line: 0,
	linearGradient: 0,
	marker: 0,
	mask: 0,
	metadata: 0,
	path: 0,
	pattern: 0,
	polygon: 0,
	polyline: 0,
	radialGradient: 0,
	rect: 0,
	stop: 0,
	svg: 0,
	switch: 0,
	symbol: 0,
	text: 0,
	textPath: 0,
	tspan: 0,
	use: 0,
	view: 0,
};

const nonPresentationSVGAttributes =
	/^(a(ll|t|u)|base[FP]|c(al|lipPathU|on)|di|ed|ex|filter[RU]|g(lyphR|r)|ke|l(en|im)|ma(rker[HUW]|s)|n|pat|pr|point[^e]|re[^n]|s[puy]|st[^or]|ta|textL|vi|xC|y|z)/;

export function createFactory(tag) {
	return createElement.bind(null, tag);
}

export function Fragment(attr) {
	const fragment = document.createDocumentFragment();
	appendChild(attr.children, fragment);
	return fragment;
}

export function Component(props) {
	this.props = props;
}
Object.defineProperties(Component.prototype, {
	isReactComponent: {
		value: true,
	},
	render: {
		value() {
			return null;
		},
	},
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function jsx(tag, { children, ...attr }, key) {
	if (__FULL_BUILD__ && !attr.namespaceURI && svg[tag] === 0) {
		attr = { ...attr, namespaceURI: SVGNamespace };
	}

	let node;
	if (isString(tag)) {
		node = attr.namespaceURI
			? document.createElementNS(attr.namespaceURI, tag)
			: document.createElement(tag);
		attributes(attr, node);
		appendChild(children, node);
	} else if (isFunction(tag)) {
		// Custom elements.
		if (isObject(tag.defaultProps)) {
			attr = { ...tag.defaultProps, ...attr };
		}

		let component;

		if (isComponentClass(tag)) {
			component = new tag({ ...attr, children });
			node = component.render();
			component.setDomElement(node);
		} else {
			node = tag({ ...attr, children });
		}

		// node = isComponentClass(tag)
		// 	? new tag({ ...attr, children }).render()
		// 	: tag({ ...attr, children });

		// console.log(tag, node);
		// tag.dom = node;
	}

	if (isRef(attr.ref)) {
		attr.ref.current = node;
	} else if (isFunction(attr.ref)) {
		attr.ref(node);
	}
	return node;
}

export function createElement(tag, attr, ...children) {
	if (isString(attr) || Array.isArray(attr)) {
		children.unshift(attr);
		attr = {};
	}

	attr = attr || {};

	if (attr.children != null && !children.length) {
		({ children, ...attr } = attr);
	}

	return jsx(tag, { ...attr, children }, attr.key);
}

function appendChild(child, node) {
	if (isArrayLike(child)) {
		appendChildren(child, node);
	} else if (isString(child) || isNumber(child)) {
		appendChildToNode(document.createTextNode(child), node);
	} else if (child === null) {
		appendChildToNode(document.createComment(""), node);
	} else if (isElement(child)) {
		appendChildToNode(child, node);
	}
}

function appendChildren(children, node) {
	for (const child of [...children]) {
		appendChild(child, node);
	}
	return node;
}

function appendChildToNode(child, node) {
	if (node instanceof window.HTMLTemplateElement) {
		node.content.appendChild(child);
	} else {
		node.appendChild(child);
	}
}

function normalizeAttribute(s, separator) {
	return s.replace(/[A-Z\d]/g, (match) => separator + match.toLowerCase());
}

function attribute(key, value, node) {
	if (__FULL_BUILD__) {
		switch (key) {
			case "xlinkActuate":
			case "xlinkArcrole":
			case "xlinkHref":
			case "xlinkRole":
			case "xlinkShow":
			case "xlinkTitle":
			case "xlinkType":
				attrNS(node, XLinkNamespace, normalizeAttribute(key, ":"), value);
				return;
			case "xmlnsXlink":
				attr(node, normalizeAttribute(key, ":"), value);
				return;
			case "xmlBase":
			case "xmlLang":
			case "xmlSpace":
				attrNS(node, XMLNamespace, normalizeAttribute(key, ":"), value);
				return;
		}
	}

	switch (key) {
		case "htmlFor":
			attr(node, "for", value);
			return;
		case "dataset":
			forEach(value, (dataValue, dataKey) => {
				if (dataValue != null) {
					node.dataset[dataKey] = dataValue;
				}
			});
			return;
		case "innerHTML":
		case "innerText":
		case "textContent":
			node[key] = value;
			return;
		case "dangerouslySetInnerHTML":
			if (isObject(value)) {
				node.innerHTML = value["__html"];
			}
			return;
		case "spellCheck":
			node.spellcheck = value;
			return;
		case "class":
		case "className":
			if (isFunction(value)) {
				value(node);
			} else {
				attr(node, "class", className(value));
			}
			return;
		case "ref":
		case "namespaceURI":
			return;
		case "style":
			if (isObject(value)) {
				forEach(value, (val, key) => {
					if (__FULL_BUILD__ && isNumber(val) && isUnitlessNumber[key] !== 0) {
						node.style[key] = val + "px";
					} else {
						node.style[key] = val;
					}
				});
				return;
			}
		// fallthrough
	}

	if (isFunction(value)) {
		if (key[0] === "o" && key[1] === "n") {
			const attribute = key.toLowerCase();
			// Issue #33
			if (node[attribute] == null) {
				node[attribute] = value;
			} else {
				node.addEventListener(key, value);
			}
		}
	} else if (isObject(value)) {
		node[key] = value;
	} else if (isBoolean(value)) {
		if (value === true) {
			attr(node, key, "");
		}
		node[key] = value;
	} else if (value != null) {
		if (
			__FULL_BUILD__ &&
			node instanceof SVGElement &&
			!nonPresentationSVGAttributes.test(key)
		) {
			attr(node, normalizeAttribute(key, "-"), value);
		} else {
			attr(node, key, value);
		}
	}
}

function attr(node, key, value) {
	node.setAttribute(key, value);
}

function attrNS(node, namespace, key, value) {
	node.setAttributeNS(namespace, key, value);
}

function attributes(attr, node) {
	for (const key of keys(attr)) {
		attribute(key, attr[key], node);
	}
	return node;
}
