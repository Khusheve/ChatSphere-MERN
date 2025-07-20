import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

function App() {
	const { authUser } = useAuthContext();
	const { getThemeConfig } = useTheme();
	const location = useLocation();
	const themeConfig = getThemeConfig();
	
	// Force night theme for login and signup pages
	const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
	const backgroundClass = isAuthPage 
		? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
		: themeConfig.background;
	
	return (
		<div className={`p-4 h-screen flex items-center justify-center ${backgroundClass} transition-all duration-500 relative overflow-hidden`}>
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
					isAuthPage 
						? 'bg-gradient-to-br from-purple-400/30 to-pink-400/30' 
						: 'bg-gradient-to-br from-purple-400/20 to-pink-400/20'
				}`}></div>
				<div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
					isAuthPage 
						? 'bg-gradient-to-tr from-indigo-400/30 to-purple-400/30' 
						: 'bg-gradient-to-tr from-blue-400/20 to-indigo-400/20'
				}`}></div>
			</div>
			
			<div className="relative z-10 w-full">
				<Routes>
					<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
					<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
					<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				</Routes>
			</div>
			
			<Toaster 
				position="top-center"
				toastOptions={{
					style: {
						background: 'rgba(255, 255, 255, 0.1)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255, 255, 255, 0.2)',
						color: '#fff',
						borderRadius: '12px',
					},
				}}
			/>
		</div>
	);
}

export default App;
