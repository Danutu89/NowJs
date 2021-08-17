import Greeting from "./app/index.jsx";
import { render } from "./react/index.js";
console.log(Greeting());
const root = document.getElementById("root");
render(Greeting(), root);

// render(
// 	new Greeting({
// 		message: "Hello",
// 	}),
// 	root
// );
