import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Theme from "./pages/Theme";
import ThemeQ from "./pages/Theme-Q";
import Signup from "./pages/Signup";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/login" element={<Login />} />
			<Route path="/home" element={<Home />} />
			<Route path="/theme" element={<Theme />} />
			<Route path="/theme-q" element={<ThemeQ />} />
			<Route path="/signup" element={<Signup />} />
		</Routes>
	);
};

export default App;
