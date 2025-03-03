<script lang="ts">
    import { writable, derived } from 'svelte/store';
    import type { Asset } from '$datastores/asset/assets.model';

    const data: Asset[] = [
        {
            id: 1,
            name: 'Mouse',
            type: 'Type A',
            value: 1000,
            category: 'Category 1',
            purchaseDate: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            assetPictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/ADB_mouse_II_range_cropped.jpg/640px-ADB_mouse_II_range_cropped.jpg',
            availability: 'Available'
        },
        {
            id: 2,
            name: 'Tripod A',
            type: 'Type B',
            value: 2000,
            category: 'Category 2',
            purchaseDate: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            assetPictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tripod.svg/640px-Tripod.svg.png',
            availability: 'Maintenance'
        },
        {
            id: 3,
            name: 'Tripod B',
            type: 'Type B',
            value: 3000,
            category: 'Category 3',
            purchaseDate: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            assetPictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Jiangsu_Provincial_Highway_238_construction_site_%2820240718%29_P5.jpg/640px-Jiangsu_Provincial_Highway_238_construction_site_%2820240718%29_P5.jpg',
            availability: 'Calibration'
        }
    ];

    const searchText = writable('');
    const selectedType = writable('');

    const filteredData = derived(
        [searchText, selectedType],
        ([$searchText, $selectedType]) => {
            return data.filter(asset => {
                const matchesText = asset.id.toString().includes($searchText) || asset.name.toLowerCase().includes($searchText.toLowerCase());
                const matchesType = !$selectedType || asset.type === $selectedType;
                return matchesText && matchesType;
            });
        }
    );
</script>

<style lang="css">
    :root {
        --background-color: #f5f5f5;
        --text-color: #333;
        --card-background-color: #fff;
        --card-shadow-color: rgba(0, 0, 0, 0.1);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --background-color: #1e1e1e;
            --text-color: #ccc;
            --card-background-color: #2c2c2c;
            --card-shadow-color: rgba(0, 0, 0, 0.5);
        }
    }

    .header {
        text-align: center;
        margin: 2rem 0;
        font-size: 2rem;
        font-weight: bold;
        color: var(--text-color);
    }

    .filter-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
    }

    .filter-container input,
    .filter-container select {
        margin-left: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--text-color);
    }

    .filter-container input {
        width: 25%; /* Extend the length of the dropdown box by 125% */
    }

    .filter-container select {
        width: 10%; /* Extend the length of the dropdown box by 125% */
    }

    .filter-container input::placeholder {
        color: var(--text-color);
    }

    .card-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .card {
        background-color: var(--card-background-color);
        color: var(--text-color);
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 4px var(--card-shadow-color);
        padding: 1rem;
        width: calc(33.333% - 1rem);
        box-sizing: border-box;
        text-align: left;
    }

    .card img {
        display: block;
        margin: 0 auto 1rem;
        width: 100px;
        height: 100px;
        border-radius: 8px;
    }

    .card h2 {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .card p {
        margin-bottom: 0.5rem;
    }

    .card .spacer {
        margin-bottom: 1rem;
    }

    .card button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .card button:hover {
        background-color: #0056b3;
    }

    .card button.disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>

<div class="mx-auto h-auto w-full max-w-6xl rounded-xl bg-muted/50">
    <div class="header">Asset Information</div>
    <div class="filter-container">
        <input type="text" placeholder="Search by ID or Name" on:input={(e) => searchText.set(e.target.value)} />
        <select on:change={(e) => selectedType.set(e.target.value)}>
            <option value="">All Types</option>
            <option value="Type A">Type A</option>
            <option value="Type B">Type B</option>
            <option value="Type C">Type C</option>
        </select>
    </div>
    <div class="card-container">
        {#each $filteredData as asset}
            <div class="card">
                <img src={asset.assetPictureUrl} alt="Asset Picture" />
                <h2>{asset.name}</h2>
                <p><strong>ID:</strong> {asset.id}</p>
                <p><strong>Type:</strong> {asset.type}</p>
                <p><strong>Value:</strong> ${asset.value}</p>
                <div class="spacer"></div>
                <p><strong>Category:</strong> {asset.category}</p>
                <div class="spacer"></div>
                <p><strong>Purchase Date:</strong> {new Date(asset.purchaseDate).toDateString()}</p>
                <p><strong>Created At:</strong> {new Date(asset.createdAt).toDateString()}</p>
                <p><strong>Updated At:</strong> {new Date(asset.updatedAt).toDateString()}</p>
                <div class="spacer"></div>
                <p><strong>Availability:</strong> {asset.availability}</p>
                <button>Edit</button>
            </div>
        {/each}
    </div>
</div>