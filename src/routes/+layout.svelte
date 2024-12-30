<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Navigation from '$components/admin/navigation.svelte';
	import '../app.css';
	
	let { children } = $props();
	let navigationElements = [
		{ href: '/', text: 'Home' },
		{ href: '/about', text: 'About' },
	]
</script>

<Navigation elements={navigationElements}/>
<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
