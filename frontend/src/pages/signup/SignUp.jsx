import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='w-full max-w-md mx-auto'>
			<div className='p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-purple-900/60 to-indigo-900/70 backdrop-blur-2xl border border-purple-400/20 shadow-2xl'>
				{/* Glowing accent line */}
				<div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 opacity-60 rounded-t-2xl'></div>
				
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2'>
						Join ChatSphere
					</h1>
					<p className='text-lg text-gray-300'>
						Create your <span className='text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text font-semibold'>ChatSphere</span> account
					</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Full Name
						</label>
						<input
							type='text'
							placeholder='Enter your full name'
							className='w-full px-4 py-3 bg-black/40 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Username
						</label>
						<input
							type='text'
							placeholder='Choose a username'
							className='w-full px-4 py-3 bg-black/40 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Password
						</label>
						<input
							type='password'
							placeholder='Create a password'
							className='w-full px-4 py-3 bg-black/40 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Confirm Password
						</label>
						<input
							type='password'
							placeholder='Confirm your password'
							className='w-full px-4 py-3 bg-black/40 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

					<button 
						type='submit'
						className='w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						disabled={loading}
					>
						{loading ? (
							<div className='flex items-center justify-center gap-2'>
								<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
								<span>Creating account...</span>
							</div>
						) : (
							"Create Account"
						)}
					</button>
				</form>
				
				<div className='mt-6 text-center'>
					<p className='text-gray-400'>
						Already have an account?{' '}
						<Link 
							to='/login' 
							className='text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text font-semibold hover:from-purple-300 hover:to-pink-400 transition-all duration-300'
						>
							Sign in here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
export default SignUp;

