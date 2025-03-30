<script lang="ts">
    // You can add any necessary imports or script logic here
</script>

<style>
    .container {
        display: flex;
        height: 90vh; /* Reduced by 10% */
        background-color: var(--background-color, #f5f5f5);
    }

    .left-half {
        flex: 1;
        background-color: maroon;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        padding: 5rem; /* Reduced by 10% */
    }

    .right-half {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--background-color, #f5f5f5);
    }

    .banner {
        position: absolute;
        top: 0;
        width: 90%;
        background-color: black;
        color: white;
        display: flex;
        justify-content: flex-end;
        padding: 0.9rem; /* Reduced by 10% */
    }

    .links {
        display: flex;
        gap: 0.9rem; /* Reduced by 10% */
    }

    .link {
        padding: 0.675rem 1.35rem; /* Reduced by 10% */
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 3.6px; /* Reduced by 10% */
        transition: background-color 0.3s;
    }

    .link:hover {
        background-color: #0056b3;
    }

    .title {
        font-size: 1.8rem; /* Reduced by 10% */
        font-weight: bold;
    }
</style>

<div class="container">
    <div class="banner">
        <div class="links">
            <a href="/login" class="link">Login</a>
            <a href="/signup" class="link">Signup</a>
        </div>
    </div>
    <div class="left-half">
        <h1 class="title">E-Bridge: Asset Management and Reservation</h1>
    </div>
    <div class="right-half">
        <!-- You can add additional content here if needed -->
    </div>
</div>