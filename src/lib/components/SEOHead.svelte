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
	<!-- Primary Meta Tags -->
	<title>{head.title}</title>
	<meta name="title" content={head.title} />
	<meta name="description" content={head.description} />
	{#if head.keywords}
		<meta name="keywords" content={head.keywords} />
	{/if}
	{#if head.author}
		<meta name="author" content={head.author} />
	{/if}
	<meta name="robots" content={head.robots} />
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={head.ogType} />
	<meta property="og:url" content={head.ogUrl} />
	<meta property="og:title" content={head.ogTitle} />
	<meta property="og:description" content={head.ogDescription} />
	<meta property="og:image" content={head.ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={head.ogTitle} />
	{#if head.ogSiteName}
		<meta property="og:site_name" content={head.ogSiteName} />
	{/if}
	{#if head.ogLocale}
		<meta property="og:locale" content={head.ogLocale} />
	{/if}
	
	<!-- Twitter -->
	<meta name="twitter:card" content={head.twitterCard} />
	<meta name="twitter:title" content={head.ogTitle} />
	<meta name="twitter:description" content={head.ogDescription} />
	<meta name="twitter:image" content={head.ogImage} />
	{#if head.twitterSite}
		<meta name="twitter:site" content={head.twitterSite} />
	{/if}
	{#if head.twitterCreator}
		<meta name="twitter:creator" content={head.twitterCreator} />
	{/if}
	
	<!-- Canonical URL -->
	<link rel="canonical" href={head.canonical} />
	
	<!-- Additional SEO -->
	<meta name="geo.region" content="GB-LND" />
	<meta name="geo.placename" content="Eltham, London" />
	<meta name="geo.position" content="51.4498;-0.0522" />
	<meta name="ICBM" content="51.4498, -0.0522" />
</svelte:head>

