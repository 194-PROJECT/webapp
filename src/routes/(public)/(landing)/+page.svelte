<script lang="ts">
    // You can add any necessary imports or script logic here
</script>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;600&display=swap');

    /* Global Reset */
    :global(html), :global(body) {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden; /* Prevents scrollbars */
        font-family: 'Poppins', sans-serif;
    }

    /* Background Image (Blur & Dim) */
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Melchor_Hall%2C_U.P._Diliman%2C_April_2023.jpg/640px-Melchor_Hall%2C_U.P._Diliman%2C_April_2023.jpg") 
            center center / cover no-repeat;
        filter: blur(5px) brightness(70%);
        z-index: -1;
    }

    /* Banner (Navbar) */
    .banner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #030917; /* Confirmed banner color */
        color: white;
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
        z-index: 10;
    }

    /* Links inside the banner */
    .links {
        display: flex;
        gap: 1rem;
    }

    .link {
        padding: 0.7rem 1.5rem;
        background-color: white; /* Updated to white */
        color: black; /* Updated to black text */
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s, color 0.3s;
        font-weight: bold;
    }

    .link:hover {
        background-color: #030917; 
        color: white; 
    }

    /* Landing Page Layout */
    .container {
        display: flex;
        height: 100vh;
        width: 100vw;
        max-width: 100vw;
        align-items: center;
        justify-content: center;
    }

    /* Content Box */
    .content-box {
        max-width: 90%; /* Adjusted for responsiveness */
        background: rgba(0, 0, 0, 0.7); /* Dark semi-transparent box */
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        color: white;
        backdrop-filter: blur(10px);
    }

    .title {
        font-size: 2.5rem; 
        font-weight: 700;
        font-family: 'Montserrat', sans-serif;
        color: #FFC107; 
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        word-wrap: break-word; /* Prevents text overflow */
    }

    .subtitle {
        font-size: 1rem;
        font-weight: 400;
        color: #ddd;
        margin-bottom: 1.5rem;
        font-family: 'Poppins', sans-serif;
    }

</style>

<div class="background"></div>

<div class="container">
    <div class="banner">
        <div class="links">
            <a href="/login" class="link">Login</a>
            <a href="/signup" class="link">Signup</a>
        </div>
    </div>

    <div class="content-box">
        <h1 class="title">E-Bridge</h1>
        <p class="subtitle">Asset Management and Reservation System</p>
    </div>
</div>