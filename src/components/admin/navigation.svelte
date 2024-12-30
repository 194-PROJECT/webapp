<script>
	let { elements } = $props();
</script>

<nav class="border-gray-200 bg-white dark:bg-gray-900">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img
				src="https://freepnglogo.com/images/all_img/facebook-circle-logo-png.png"
				class="h-8"
				alt="Flowbite Logo"
			/>
			<span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Admin</span
			>
		</a>
		<div class="hidden w-full md:block md:w-auto" id="navbar-default">
			<ul
				class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900"
			>
				{#each elements as element}
					<li>
						<a
							href={element.href}
							class="block rounded px-3 py-2 text-gray-700 hover:bg-gray-100 md:border-0 md:p-0 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
						>
							{element.text}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>

<style>
</style>
