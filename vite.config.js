export default {
	plugins: ["@vue/babel-plugin-jsx"],
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "Fragment",
	},
};
