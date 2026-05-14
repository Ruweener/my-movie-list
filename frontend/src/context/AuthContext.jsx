import { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "../services/supabaseClient";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "access_token";

const setStoredToken = (token) => {
	if (token) {
		localStorage.setItem(TOKEN_STORAGE_KEY, token);
	} else {
		localStorage.removeItem(TOKEN_STORAGE_KEY);
	}
};

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		supabase.auth.getSession().then(({ data, error }) => {
			if (!isMounted) {
				return;
			}
			if (error) {
				console.error("Error fetching Supabase session:", error);
			}
			setSession(data?.session ?? null);
			setStoredToken(data?.session?.access_token ?? null);
			setLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
			setSession(currentSession);
			setStoredToken(currentSession?.access_token ?? null);
		});

		return () => {
			isMounted = false;
			listener?.subscription?.unsubscribe();
		};
	}, []);

	const value = useMemo(() => ({
		session,
		user: session?.user ?? null,
		loading,
	}), [session, loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
