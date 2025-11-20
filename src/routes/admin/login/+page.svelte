<script lang="js">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(event) {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password })
			});

			const data = await response.json();

			if (response.ok) {
				// Redirect to admin page
				goto('/admin');
			} else {
				error = data.message || 'Invalid password';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}

	// If already logged in, redirect
	if ($page.data?.authenticated) {
		goto('/admin');
	}
</script>

<svelte:head>
	<title>Admin Login - Fresh Ground Eltham</title>
	<meta name="description" content="Admin login page" />
</svelte:head>

<!-- Full Screen Login Page -->
<div class="login-container fixed inset-0 w-full h-full flex items-center justify-center">
	<!-- Background Image -->
	<div 
		class="absolute inset-0 bg-cover bg-center"
		style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80');"
	></div>
	
	<!-- Overlay -->
	<div class="absolute inset-0 bg-[#2f435a]/60 z-10"></div>
	
	<!-- Login Box -->
	<div class="relative z-20 w-full max-w-md px-6">
		<div class="bg-white rounded-lg p-8 shadow-2xl">
			<h1 class="text-3xl font-bold text-[#39918c] mb-8 text-center">Admin Login</h1>
			
			{#if error}
				<div class="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
					<p class="text-red-700 text-sm text-center">{error}</p>
				</div>
			{/if}

			<form onsubmit={handleLogin} class="space-y-6">
				<div>
					<label for="password" class="block text-gray-700 font-medium mb-2 text-sm">
						Password
					</label>
					<input 
						type="password" 
						id="password"
						bind:value={password}
						required
						autofocus
						class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39918c] focus:border-[#39918c] transition-colors"
						placeholder="Enter password"
					/>
				</div>

				<button 
					type="submit"
					disabled={loading}
					class="w-full bg-[#39918c] text-white px-8 py-3 rounded-lg hover:bg-[#2f435a] transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if loading}
						Logging in...
					{:else}
						Login
					{/if}
				</button>
			</form>

			<div class="text-center mt-6">
				<a href="/" class="text-sm text-gray-600 hover:text-[#39918c] transition-colors">← Back to Home</a>
			</div>
		</div>
	</div>
</div>
