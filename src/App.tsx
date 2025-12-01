import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ObjectsProvider } from "./contexts/ObjectsContext";
import { End } from "./pages/End";
import Home from "./pages/Home";
import ItemGen from "./pages/Item-Gen";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Theme from "./pages/Theme";
import ThemeQ from "./pages/Theme-Q";

const App = () => {
	return (
		<AuthProvider>
			<ObjectsProvider>
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/login" element={<Login />} />
					<Route path="/home" element={<Home />} />
					<Route path="/theme" element={<Theme />} />
					<Route path="/theme-q" element={<ThemeQ />} />
					<Route path="/item-gen" element={<ItemGen />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/end" element={<End />} />
				</Routes>
			</ObjectsProvider>
		</AuthProvider>
	);
};

export default App;
