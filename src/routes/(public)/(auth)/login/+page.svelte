<script lang='ts'>
	import * as Card from '$components/elements/card/index.js';
  import LoginForm from './login-form.svelte';

import type { PageProps } from './$types';

let props: PageProps = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
      <LoginForm {...props} />
		</Card.Content>
	</Card.Root>
</div>
