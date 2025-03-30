<script lang="ts">
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
	import { Button } from "$components/elements/button";
	import { Input } from "$components/elements/input";
	import { Label } from "$components/elements/label";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import type { PageProps } from "../$types";
	import { superForm } from "sveltekit-superforms";
	import { setContext } from "svelte";
	import { enhance } from "$app/forms";

  let { data, form: loginResponse }: PageProps = $props();
	const { form } = superForm(data.signupForm);
  let success = $state(loginResponse?.success);

  $effect(() => {
    if (success && loginResponse) {
      setContext('user', loginResponse.user);
      setContext('session', loginResponse.session);
      goto(loginResponse.redirect ?? '/');
    }
  });

	let formLoading = $state(false);
  const submitSignup: SubmitFunction = () => {
    formLoading = true;

    return async ({ result, update }) => {
      await update();

      console.log(result);

      if (result.type === "success") {
        toast.success("Signup successful");
        goto('/');
      }

      if (result.type === "failure") {
        const error = result.data?.error;
        if (typeof error === "string") {
          toast.error(error);
        } else if (Array.isArray(error) && error.length) {
          toast.error(error[0]);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }

      formLoading = false;
    };
  }
</script>

<div class="grid gap-6">
	<form method="POST" action="?/signup" use:enhance={submitSignup}>
		<div class="grid gap-4">
			<div class="flex flex-col items-center gap-2">
        <Label class="self-start" for="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="name@example.com"
          type="email"
          autocapitalize="none"
          autocomplete="email"
          autocorrect="off"
          bind:value={$form.email}
          disabled={formLoading}
        />
      </div>
			<div class="flex flex-col items-center gap-2">
        <Label class="self-start" for="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="johndoe"
          autocapitalize="none"
          autocomplete="email"
          autocorrect="off"
          bind:value={$form.username}
          disabled={formLoading}
        />
      </div>
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-center gap-2 flex-grow">
          <Label class="self-start" for="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            autocapitalize="none"
            autocomplete="email"
            autocorrect="off"
            bind:value={$form.firstName}
            disabled={formLoading}
          />
        </div>
        <div class="flex flex-col items-center gap-2 flex-grow">
          <Label class="self-start" for="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            autocapitalize="none"
            autocomplete="email"
            autocorrect="off"
            bind:value={$form.lastName}
            disabled={formLoading}
          />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-center gap-2 flex-grow">
          <Label class="self-start" for="studentId">Student ID</Label>
          <Input
            id="studentId"
            name="studentId"
            placeholder="2019-06357"
            autocapitalize="none"
            autocomplete="email"
            autocorrect="off"
            bind:value={$form.studentId}
            disabled={formLoading}
          />
        </div>
        <div class="flex flex-col items-center gap-2 flex-grow">
          <Label class="self-start" for="programId">Program</Label>
          <Input
            id="programId"
            name="programId"
            placeholder="Computer Science"
            autocapitalize="none"
            autocomplete="email"
            autocorrect="off"
            bind:value={$form.programId}
            disabled={formLoading}
          />
        </div>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Label class="self-start" for="programId">Password</Label>
        <Input
          id="password"
          name="password"
          placeholder="Computer Science"
          autocapitalize="none"
          autocomplete="email"
          autocorrect="off"
          bind:value={$form.password}
          disabled={formLoading}
        />
      </div>
      <a href="/password/reset" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
			<Button type="submit" disabled={formLoading}>
				{#if formLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Sign In with Email
			</Button>
		</div>
	</form>
</div>
