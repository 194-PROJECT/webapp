<script lang="ts">
	import type { User } from '$datastores/user/user.type';
	import { createRawSnippet } from 'svelte';
	import DataTable from './@components/user-data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import { renderSnippet } from '$components/elements/data-table';
	import { Roles } from '$core/auth/auth.type';

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: 'id',
			header: 'ID'
		},
		{
			accessorKey: 'profilePictureUrl',
			header: 'Avatar',
			cell: ({ row }) => {
				const profilePictureUrlCellSnippet = createRawSnippet<[string]>((getProfilePictureUrl) => {
					const profilePictureUrl = getProfilePictureUrl();
					return {
						render: () => `<img src="${profilePictureUrl}" class="h-8 w-8 rounded-lg" />`
					};
				});

				return renderSnippet(profilePictureUrlCellSnippet, row.getValue('profilePictureUrl'));
			}
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
			header: 'Username'
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
			}
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
			}
		},
		{
			accessorKey: 'updatedAt',
			header: 'Updated At',
			cell: ({ row }) => {
				const formatter = (date: string) => new Date(date).toDateString();
				const updatedAtCellSnippet = createRawSnippet<[string]>((getUpdatedAt) => {
					const updatedAt = getUpdatedAt();
					return {
						render: () => `${updatedAt}`
					};
				});

				return renderSnippet(updatedAtCellSnippet, formatter(row.getValue('updatedAt')));
			}
		},
		{
			accessorKey: 'viewreservationhistory',
			header: 'Action',
			cell: ({ row }) => {
				const buttonSnippet = createRawSnippet<[() => number]>((getRowId) => {
					return {
						render: () => `
                            <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="handleEdit(${getRowId()})">
                                View History
                            </button>
                        `
					};
				});

				return renderSnippet(buttonSnippet, () => row.getValue('id'));
			}
		},
		{
			accessorKey: 'edit',
			header: 'Action',
			cell: ({ row }) => {
				const buttonSnippet = createRawSnippet<[() => number]>((getRowId) => {
					return {
						render: () => `
                            <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="handleEdit(${getRowId()})">
                                Edit Profile
                            </button>
                        `
					};
				});

				return renderSnippet(buttonSnippet, () => row.getValue('id'));
			}
		}
	];

	const data: User[] = [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			username: 'johndoe',
			email: 'johndoe@example.com',
			type: 'admin',
			role: Roles.ADMIN,
			profilePictureUrl:
				'https://www.everydogsday.net/wp-content/uploads/2017/12/image-dog-square-2.jpg',
			createdAt: new Date('2023-01-01T00:00:00Z'),
			updatedAt: new Date('2023-01-01T00:00:00Z'),
		},
		{
			id: 2,
			firstName: 'Mary',
			lastName: 'Grace',
			username: 'marygrace',
			email: 'marygrace@example.com',
			type: 'user',
			role: Roles.USER,
			profilePictureUrl: 'https://i.pinimg.com/736x/2b/47/18/2b4718827a37b6f11dc82e939984c571.jpg',
			createdAt: new Date('2023-01-01T00:00:00Z'),
			updatedAt: new Date('2023-01-01T00:00:00Z'),
		},
		{
			id: 3,
			firstName: 'Zoro',
			lastName: 'Roronoa',
			username: 'zorororonoa',
			email: 'zorororonoa@example.com',
      type: 'user',
			role: Roles.USER,
			profilePictureUrl:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cosplay_Roronoa_Zoro_-_One_Piece.jpg/640px-Cosplay_Roronoa_Zoro_-_One_Piece.jpg',
			createdAt: new Date('2023-01-01T00:00:00Z'),
			updatedAt: new Date('2023-01-01T00:00:00Z'),
		}
	];
</script>

<div class="mx-auto h-auto w-full max-w-6xl rounded-xl bg-muted/50">
	<DataTable {data} {columns} />
</div>
