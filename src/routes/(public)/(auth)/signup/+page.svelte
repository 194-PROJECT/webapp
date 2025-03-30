<script lang="ts">
	import type { PageProps } from './$types';
  import SignupPage from './@components/signup-page.svelte';
  
  let props: PageProps = $props();
</script>

<SignupPage {...props} />