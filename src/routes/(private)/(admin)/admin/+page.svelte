<script lang="ts">
    // You can import any necessary components or types here
</script>

<style>
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

    .admin-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start; /* Align to the top */
        padding-top: 2rem; /* Add some padding from the top */
        height: 100vh;
        background-color: var(--background-color);
        font-family: Arial, sans-serif;
    }

    .admin-header {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: var(--text-color);
    }

    .admin-content {
        font-size: 1.2rem;
        color: var(--text-color);
    }

    .admin-card {
        background-color: var(--card-background-color);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px var(--card-shadow-color);
        text-align: center;
        width: 100%;
        max-width: 800px;
    }

    .quick-links {
        margin-top: 2rem;
        width: 100%;
        background-color: var(--card-background-color);
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px var(--card-shadow-color);
    }

    .quick-links-header {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: var(--text-color);
        text-align: center;
    }

    .quick-links-menu {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .quick-link-item {
        flex: 1 1 30%;
        margin: 0.5rem;
        padding: 1rem;
        background-color: var(--card-background-color);
        border-radius: 8px;
        box-shadow: 0 2px 4px var(--card-shadow-color);
        text-align: center;
        text-decoration: none;
        color: var(--text-color);
    }

    .quick-link-item:hover {
        background-color: var(--background-color);
        box-shadow: 0 4px 8px var(--card-shadow-color);
    }
</style>

<div class="admin-container">
    <div class="admin-card">
        <div class="admin-header">Admin Dashboard</div>
        <div class="admin-content">
            Welcome to the DGE Admin dashboard. Here you can manage users, assets, asset reservations, and other administrative tasks.
        </div>
        <div class="quick-links">
            <div class="quick-links-header">Quick Links</div>
            <div class="quick-links-menu">
                <a href="/admin/assets" class="quick-link-item">
                    <div>Assets</div>
                </a>
                <a href="/admin/user" class="quick-link-item">
                    <div>User Management</div>
                </a>
                <a href="/admin/reservations" class="quick-link-item">
                    <div>Reservations</div>
                </a>
            </div>
        </div>
    </div>
</div>