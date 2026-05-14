import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState("login");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setMessage("");
		setIsLoading(true);

		try {
			if (mode === "login") {
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email,
					password,
				});

				if (signInError) {
					throw signInError;
				}

				navigate("/");
				return;
			}

			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (signUpError) {
				throw signUpError;
			}

			if (data?.user?.identities?.length === 0) {
				setMessage("Check your email to confirm your account.");
			} else {
				setMessage("Account created. You can log in now.");
			}
		} catch (err) {
			setError(err?.message || "Authentication failed.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
			<NavBar />
			<div className="flex-1 flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-md bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-700">
					<h1 className="text-2xl font-bold mb-2 text-white">
						{mode === "login" ? "Sign in" : "Create account"}
					</h1>
					<p className="text-sm text-gray-400 mb-4">Access your reviews and manage your watchlist.</p>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
								className="w-full rounded-md px-3 py-2 text-white bg-gray-900/40 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
								className="w-full rounded-md px-3 py-2 text-white bg-gray-900/40 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
							/>
						</div>
						{error && <p className="text-red-400 text-sm">{error}</p>}
						{message && <p className="text-blue-300 text-sm">{message}</p>}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition rounded-md py-2 font-semibold shadow-md transform hover:scale-102 disabled:opacity-60"
						>
							{isLoading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
						</button>
					</form>

					<div className="mt-6 flex items-center justify-between text-sm">
						<div>
							{mode === "login" ? (
								<button
									type="button"
									onClick={() => setMode("signup")}
									className="text-blue-300 hover:text-blue-200"
								>
									Need an account? Sign up
								</button>
							) : (
								<button
									type="button"
									onClick={() => setMode("login")}
									className="text-blue-300 hover:text-blue-200"
								>
									Already have an account? Sign in
								</button>
							)}
						</div>

						<div>
							<button
								type="button"
								onClick={() => { setEmail('demo@demo.com'); setPassword('password'); }}
								className="text-gray-300 hover:text-white"
							>
								Demo
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Login;
