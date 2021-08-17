import { global } from "./global";
import { className } from "./jsx/dom";
// import type { ClassNames, ClassList } from "../index"

export { identity as useCallback } from "./jsx/utils";

export function useText(initialValue) {
	const text = new Text();
	Object.defineProperty(text, "toString", {
		value() {
			return this.textContent;
		},
	});
	function setText(value) {
		text.textContent = value;
	}
	if (initialValue != null) {
		setText(initialValue);
	}
	return [text, setText];
}

export function useClassList(initialValue) {
	const div = document.createElement("div");
	if (initialValue != null) {
		div.className = className(initialValue);
	}

	let list = div.classList;

	function ClassList(value) {
		value.setAttribute("class", list.value);
		list = value.classList;
	}

	Object.defineProperties(
		ClassList,
		Object.getOwnPropertyDescriptors({
			get size() {
				return list.length;
			},
			get value() {
				return list.value;
			},
			add(...tokens) {
				list.add(...tokens);
			},
			remove(...tokens) {
				list.remove(...tokens);
			},
			toggle(token, force) {
				list.toggle(token, force);
			},
			contains(token) {
				return list.contains(token);
			},
		})
	);

	return ClassList;
}
let _key = undefined;
var sequence = undefined; // Point to the sequence generator
// useEffect

const applyEffect = (sequence, depArray) => {
	const hasNoDeps = !depArray;
	const hook = global.getHook(sequence);
	// console.log(hook, global);

	if (!hook) return;

	const deps = hook.dep;

	const hasChangedDeps = deps
		? !depArray.every((el, i) => el === deps[i])
		: true;

	if (hasNoDeps || hasChangedDeps) {
		hook.callback();
	}
};

export const useEffect = (callback, depArray) => {
	global.addHook({
		dep: depArray,
		callback,
	});

	applyEffect(global.getSequence(), []);
};

// Statemanagement hook
export const useState = function (istate) {
	let _state;
	const sequence = global.getSequence();
	console.log(sequence, "useState");
	// if (sequence == undefined) {
	// 	sequence = sequenceGen(); // Invoke the sequence generator
	// }
	// const _key = sequence(); // Initially it will be 0 -> 1
	// console.log(sequence, "sequence");
	let state = global.getState(sequence); // Get the key from the dictionary/hash

	if (state == undefined) {
		global.addState(istate, sequence);
		_state = istate;
	} else {
		_state = state;
	}

	// Create the updater function
	let _updater = (k, updater) => {
		_state = updater(_state);
		global.setState(k, _state);
		// hooks[k] = _state;
		applyEffect(k, [_state]);

		// subs.forEach((sub) => {
		// 	sub(_state);
		// });
		const update = global.getMethod("update", k);
		if (update) update({}, _state);

		return _state;
	};
	_updater = _updater.bind(null, Object.freeze(sequence));

	return Object.freeze([_state, _updater]);
};

export function subscribe(cb) {
	// subs.push(cb);
}

// export function render(comp) {
//   const instance = comp(); // invoke the function
//   instance.render();

//   // in the next render the key counter can start from 0 again
//   sequence = undefined;
//   return instance;
// }

export function useMemo(callback, dependencies) {
	const id = globalId;
	const parent = globalParent;
	globalId++;

	return (() => {
		const { cache } = componentState.get(parent);
		if (cache[id] == null) {
			cache[id] = { dependencies: undefined };
		}

		const dependenciesChanged =
			dependencies == null ||
			dependencies.some((dependency, i) => {
				return (
					cache[id].dependencies == null ||
					cache[id].dependencies[i] !== dependency
				);
			});

		if (dependenciesChanged) {
			cache[id].value = callback();
			cache[id].dependencies = dependencies;
		}

		return cache[id].value;
	})();
}
