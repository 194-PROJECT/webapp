<script lang="ts">
	import { Button } from "$components/elements/button/index.js";
	import * as Card from "$components/elements/card/index.js";
	import { Input } from "$components/elements/input/index.js";
	import { Label } from "$components/elements/label/index.js";
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Signup</Card.Title>
		<Card.Description>Please register a new account using your email.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="##" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" type="password" required />
				</div>
				<Button type="submit" class="w-full">Signup</Button>
				<Button variant="outline" class="w-full">Signup with Google</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
