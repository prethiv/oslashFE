import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import Customer from './components/Customer';
// import Contact from './component/contact';

class App extends Component {
render() {
	return (
	<Router>
		<div className="App">
			<ul className="App-header">
			<li>
				<Link to="/admin">Admin</Link>
			</li>
			<li>
				<Link to="/customer">Customer</Link>
			</li>
			{/* <li>
				<Link to="/contact">Contact Us</Link>
			</li> */}
			</ul>
		<Routes>
				<Route exact path='/admin' element={< Admin />}></Route>
				<Route exact path='/customer' element={< Customer />}></Route>
				{/* <Route exact path='/contact' element={< Contact />}></Route> */}
		</Routes>
		</div>
	</Router>
);
}
}

export default App;
