<script lang="ts">
	import { Button } from "$components/elements/button";
	import SignupForm from "./signup-form.svelte";
	import type { PageProps } from "../$types";

  let props: PageProps = $props();
</script>

<div class="md:hidden">
	<enhanced:img src="https://i.redd.it/c9mt1vzy2ca61.jpg" alt="Authentication" class="block dark:hidden" />
	<enhanced:img src="https://i.redd.it/c9mt1vzy2ca61.jpg" alt="Authentication" class="hidden dark:block" />
</div>
<div
	class="container relative h-[100vh] items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button
		href="/login"
		variant="ghost"
		class="absolute right-4 top-4 md:right-8 md:top-8"
	>
		Login
	</Button>
	<div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		></div>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<!-- <Command class="mr-2 h-6 w-6" /> -->
      DGE
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
            Simplify equipment management with our scheduling app. Plan, track, and optimize your schedule effortlessly.
				</p>
        <footer class="text-sm">© 2025 Item Scheduling App. All rights reserved.</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-muted-foreground text-sm">
					Enter your email below to create your account
				</p>
			</div>
			<SignupForm {...props} />
			<p class="text-muted-foreground px-8 text-center text-sm">
				By clicking continue, you agree to our
				<a href="/terms" class="hover:text-primary underline underline-offset-4">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="hover:text-primary underline underline-offset-4">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
