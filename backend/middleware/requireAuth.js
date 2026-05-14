import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_PUBLISHABLE_KEY || ""
);

const requireAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

	if (!token) {
		return res.status(401).json({ error: "Missing or invalid Authorization header" });
	}

	try {
		console.log("[DEBUG] Token:", token.slice(0, 20) + "...");
		
		// Verify the token using Supabase's getUser method
		const { data: { user }, error } = await supabase.auth.getUser(token);
		
		if (error || !user) {
			console.error("[DEBUG] Token verification failed:", error?.message || "No user found");
			return res.status(401).json({ error: "Invalid or expired token" });
		}

		console.log("[DEBUG] Token verified. User:", user.id);
		req.user = {
			id: user.id,
			email: user.email || null,
		};

		return next();
	} catch (error) {
		console.error("[DEBUG] Token processing failed:", error.message);
		return res.status(401).json({ error: "Invalid or expired token" });
	}
};

export default requireAuth;
