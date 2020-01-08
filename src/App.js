import React from "react";

import { BrowserRouter, Route } from "react-router-dom";
import "./styles.css";
import JoinParty from "./components/JoinParty";
import Party from "./components/Party";

const App = () => {
	return (
		<BrowserRouter>
			<Route exact path="/" component={JoinParty} />
			<Route exact path="/party" component={Party} />
		</BrowserRouter>
	);
};

export default App;
