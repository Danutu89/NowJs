export class Global {
	constructor() {
		this.sequence = 0;
		this.hooks = new Map();
		this.state = {};
		this.methods = new Map();
	}

	addHook(hook) {
		this.hooks.set(this.sequence, hook);
	}

	getHook(sequence) {
		return this.hooks.get(sequence || this.getSequence());
	}

	addState(state, sequence) {
		this.state[sequence || this.getSequence()] = state;
	}

	getState(sequence) {
		return this.state[sequence || this.getSequence()];
	}

	setState(sequence, state) {
		this.state[sequence || this.getSequence()] = state;
	}

	getMethods(sequence) {
		return this.methods.get(sequence || this.getSequence()) || {};
	}

	addMethod(name, method, sequence) {
		const methods = this.getMethods(sequence || this.getSequence());

		this.methods.set(sequence || this.getSequence(), {
			...methods,
			[name]: method,
		});
	}

	getMethod(name, sequence) {
		const methods = this.getMethods(sequence);
		return methods[name] || null;
	}

	getSequence() {
		return this.sequence;
	}

	genSequence() {
		this.sequence++;
		return this.sequence;
	}
}

export const global = new Global();
