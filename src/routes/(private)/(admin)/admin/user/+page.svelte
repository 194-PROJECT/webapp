<script lang="ts">
	import type { User } from '$datastores/user/user.model';
	import { createRawSnippet } from 'svelte';
	import DataTable from './@components/user-data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import { renderSnippet } from '$components/elements/data-table';

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: 'id',
			header: 'ID'
		},
		{
			accessorKey: 'profilePictureUrl',
			header: 'avatar',
			cell: ({ row }) => {
				const profilePictureUrlCellSnippet = createRawSnippet<[string]>((getProfilePictureUrl) => {
					const profilePictureUrl = getProfilePictureUrl();
					return {
						render: () => `<img src="${profilePictureUrl}" class="h-8 w-8 rounded-lg" />`
					};
				});

				return renderSnippet(profilePictureUrlCellSnippet, row.getValue('profilePictureUrl'));
			},
		},
		{
			accessorKey: 'firstName',
			header: 'First Name'
		},
		{
			accessorKey: 'lastName',
			header: 'Last Name'
		},
		{
			accessorKey: 'username',
			header: 'username'
		},
		{
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'roles',
			header: 'Roles',
      cell: ({ row }) => {
        const formatter = (roles: string[]) => roles.join(', ');
        const rolesCellSnippet = createRawSnippet<[string]>((getRoles) => {
					const roles = getRoles();
					return {
						render: () => `${roles}`
					};
				});

				return renderSnippet(rolesCellSnippet, formatter(row.getValue('roles')));
      },
		},
		{
			accessorKey: 'createdAt',
			header: 'Created At',
      cell: ({ row }) => {
        const formatter = (date: string) => new Date(date).toDateString();
        const createdAtCellSnippet = createRawSnippet<[string]>((getCreatedAt) => {
					const createdAt = getCreatedAt();
					return {
						render: () => `${createdAt}`
					};
				});

				return renderSnippet(createdAtCellSnippet, formatter(row.getValue('createdAt')));
      },
		},
		{
			accessorKey: 'updatedAt',
			header: 'Updated At',
      cell: ({ row }) => {
        const formatter = (date: string) => new Date(date).toDateString();
        const createdAtCellSnippet = createRawSnippet<[string]>((getCreatedAt) => {
					const createdAt = getCreatedAt();
					return {
						render: () => `${createdAt}`
					};
				});

				return renderSnippet(createdAtCellSnippet, formatter(row.getValue('createdAt')));
      },
		}
	];

	const data: User[] = [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			username: 'johndoe',
			email: 'johndoe@example.com',
			roles: ['admin'],
			active: true,
			profilePictureUrl:
				'https://www.everydogsday.net/wp-content/uploads/2017/12/image-dog-square-2.jpg',
			createdAt: '2023-01-01T00:00:00Z',
			updatedAt: '2023-01-01T00:00:00Z'
		},
		{
			id: 2,
			firstName: 'Mary',
			lastName: 'Grace',
			username: 'marygrace',
			email: 'marygrace@example.com',
			roles: ['user'],
			active: true,
			profilePictureUrl: 'https://i.pinimg.com/736x/2b/47/18/2b4718827a37b6f11dc82e939984c571.jpg',
			createdAt: '2023-01-01T00:00:00Z',
			updatedAt: '2023-01-01T00:00:00Z'
		}
	];
</script>

<div class="mx-auto h-auto w-full max-w-6xl rounded-xl bg-muted/50">
	<DataTable {data} {columns} />
</div>
