import { global } from "../global";
import { diff } from "../jsx/virtual-dom";

class Component {
	constructor(props) {
		this.props = props;
		this.state = {};
		this.prevState = {};

		this.updateComponent = this.updateComponent.bind(this);
	}

	setState(nextState) {
		if (!this.prevState) this.prevState = this.state;
		this.state = Object.assign({}, this.state, nextState);
		global.setState(this.getSequence(), nextState);
		this.updateComponent({}, nextState);
	}

	updateComponent(props, state) {
		let dom = this.getDomElement();
		let container = this;
		console.log(this);

		let newvdom = Object.getPrototypeOf(this).isFunctionalComponent
			? this.render(this.props)
			: this.render();

		// Recursively diff
		if (this.shouldComponentUpdate(props, state)) diff(newvdom, container, dom);
	}

	// Helper methods
	setDomElement(dom) {
		this._dom = dom;
	}

	getDomElement() {
		return this._dom;
	}

	setSequence(sequence) {
		this._sequence = sequence;
		return this._sequence;
	}

	getSequence() {
		return this._sequence;
	}

	updateProps(props) {
		this.props = props;
	}

	// Lifecycle methods
	componentWillMount() {}
	componentDidMount() {}
	componentWillReceiveProps(nextProps) {}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps != this.props || nextState != this.state;
	}

	componentWillUpdate(nextProps, nextState) {}

	componentDidUpdate(prevProps, prevState) {}

	componentWillUnmount() {}
}

//add isReactComponent prototipe to Component class
Component.prototype.isReactComponent = true;

export default Component;
