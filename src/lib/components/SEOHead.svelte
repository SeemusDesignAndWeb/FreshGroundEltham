<script lang="ts">
	import { page } from '$app/stores';
	import { getSEOData, generateSEOHead } from '$lib/seo';
	
	interface Props {
		path?: string;
		override?: Partial<import('$lib/seo').SEOData>;
	}
	
	let { path, override }: Props = $props();
	
	const currentPath = path || $page.url.pathname;
	const seoData = getSEOData(currentPath);
	const finalSEO = override ? { ...seoData, ...override } : seoData;
	const head = generateSEOHead(finalSEO, currentPath);
</script>

<svelte:head>
	<title>{head.title}</title>
	<meta name="description" content={head.description} />
	{#if head.keywords}
		<meta name="keywords" content={head.keywords} />
	{/if}
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={head.ogType} />
	<meta property="og:title" content={head.ogTitle} />
	<meta property="og:description" content={head.ogDescription} />
	<meta property="og:image" content={head.ogImage} />
	<meta property="og:url" content={head.ogUrl} />
	
	<!-- Twitter -->
	<meta name="twitter:card" content={head.twitterCard} />
	<meta name="twitter:title" content={head.ogTitle} />
	<meta name="twitter:description" content={head.ogDescription} />
	<meta name="twitter:image" content={head.ogImage} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={head.canonical} />
</svelte:head>

