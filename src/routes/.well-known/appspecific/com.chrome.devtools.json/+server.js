

// Handle Chrome DevTools requests - return 404 response silently
// This is a Chrome DevTools feature that requests this file, it's safe to ignore
export const GET= async () => {
	return new Response(null, { status: 404 });
};

