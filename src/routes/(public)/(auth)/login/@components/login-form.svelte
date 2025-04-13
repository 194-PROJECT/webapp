<script lang="ts">
	import { Button } from '$components/elements/button/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import { setContext } from 'svelte';

	import type { PageProps } from '../$types';
	import { superForm } from 'sveltekit-superforms';
	import { goto } from '$app/navigation';

	let { data, form: loginResponse }: PageProps = $props();
	const { form, errors, constraints, enhance } = superForm(data.loginForm);
  let success = $state(loginResponse?.success);

  $effect(() => {
    if (success && loginResponse) {
      setContext('user', loginResponse.user);
      setContext('session', loginResponse.session);
      goto(loginResponse.redirect ?? '/');
    }
  });
</script>

<form method="POST" action="?/login" use:enhance>
	<div class="grid gap-4">
		<div class="grid gap-2">
			<Label for="email">Email</Label>
			<Input
				id="email"
				type="email"
				name="email"
				autocomplete="email"
				bind:value={$form.email}
				placeholder="email@example.com"
				{...$constraints.email}
			/>
      {#if $errors.email}
        <p class="text-muted-foreground text-sm">{ $errors.email }</p>
			{/if}
		</div>
		<div class="grid gap-2">
			<div class="flex items-center">
				<Label for="password">Password</Label>
				<a href="/password/reset" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
			</div>
			<Input
				id="password"
				type="password"
				name="password"
				autocomplete="current-password"
				bind:value={$form.password}
        {...$constraints.password}
			/>
			{#if $errors.password}
        <p class="text-muted-foreground text-sm">{ $errors.password }</p>
			{/if}
		</div>
		<Button type="submit" class="w-full">Login</Button>
	</div>
	<div class="mt-4 text-center text-sm">
		Don't have an account?
		<a href="/signup" class="underline"> Sign up </a>
	</div>
</form>
