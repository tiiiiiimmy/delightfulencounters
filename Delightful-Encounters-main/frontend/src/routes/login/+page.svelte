<script>
  import { goto } from "$app/navigation";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
  const AUTH_URL = `${PUBLIC_API_BASE_URL}/auth/login`;
  import { invalidateAll } from "$app/navigation";

  let username = "";
  let password = "";
  let error = false;

  /**
   * Handles logging in by sending a POST request to /api/auth, with the given username and password.
   *
   * If successful, redirect the user back to the homepage. Otherwise, display an error message.
   */
  async function handleSubmit() {
    error = false;
    const response = await fetch(AUTH_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.status === 401) {
      error = true;
    } else {
      console;
      invalidateAll().then(() => {
        goto("/", { replaceState: true });
      });
      // goto("/", { invalidateAll: true, replaceState: true });
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="container" style="background-image: url('{`${PUBLIC_IMAGES_URL}/loginbgunder.png`}');">
  <div class="login-box">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="145"
      height="136"
      viewBox="0 0 145 136"
      fill="none"
      class="login-icon1"
    >
      <path
        d="M47.3293 131.428L72.4381 93.4869L97.5398 131.184L98.647 132.847L100.311 131.742L126.091 114.617L127.936 113.392L126.529 111.681L97.204 76.0293L139.69 63.245L141.677 62.647L141.006 60.6831L131.339 32.3905L130.646 30.3638L128.672 31.1932L88.4621 48.0831L90.5433 4.09452L90.6423 2H88.5455H56.5684H54.4715L54.5706 4.09452L56.6518 48.0831L16.442 31.1932L14.4674 30.3638L13.7749 32.3905L4.10744 60.6831L3.43639 62.647L5.42371 63.245L47.8977 76.0257L18.3419 111.675L16.932 113.376L18.7639 114.61L44.5438 131.983L46.2163 133.11L47.3293 131.428Z"
        fill="#B5FD1E"
        stroke="black"
        stroke-width="4"
      />
    </svg>
    <h1>Login</h1>
    <p>Let's start at the rainbow!</p>
    <form on:submit|preventDefault={handleSubmit}>
      <label for="username">Username:</label>
      <input type="text" name="username" bind:value={username} required />
      <label for="password">Password:</label>
      <input type="password" name="password" bind:value={password} required />
      <button type="submit" class="login-button">Login Now!</button>
      {#if error}
        <span class="error">Could not log in with those credentials, please try again.</span>
      {/if}
    </form>
    <div class="signup-box">
      <p>Don't have an account?</p>
      <a href="/signup"><button type="button">Signup</button></a>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="126"
      height="126"
      viewBox="0 0 126 126"
      fill="none"
      class="login-icon2"
    >
      <path
        d="M63 4L72.9257 25.9567L92.5 11.9045L90.1175 35.8825L114.095 33.5L100.043 53.0743L122 63L100.043 72.9257L114.095 92.5L90.1175 90.1175L92.5 114.095L72.9257 100.043L63 122L53.0743 100.043L33.5 114.095L35.8825 90.1175L11.9045 92.5L25.9567 72.9257L4 63L25.9567 53.0743L11.9045 33.5L35.8825 35.8825L33.5 11.9045L53.0743 25.9567L63 4Z"
        fill="#FFEA01"
        stroke="black"
        stroke-width="3"
      />
    </svg>
  </div>
  <div class="image-container">
    <img src={`${PUBLIC_IMAGES_URL}/loginbg.png`} alt="loginbg" />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-size: 100%;
    background-position: center top;
    background-repeat: repeat;
    background-color: #f4f6fe;
    min-height: 100vh;
  }

  .login-box,
  .image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .login-icon1 {
    position: absolute;
    top: -60px;
    left: -50px;
  }

  .login-icon2 {
    position: absolute;
    bottom: -50px;
    right: -50px;
  }

  .login-box {
    width: 25%;
    border-radius: 30px;
    border: 5px solid #000;
    background: white;
    padding: 40px;
    text-align: center;
  }

  .signup-box {
    margin-top: 120px;
  }

  h1 {
    font-size: 35px;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #777;
  }

  form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3px;
    width: 80%;
  }

  label {
    margin: 10px 0 5px 0;
    text-align: left;
    color: #555;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    border-radius: 16px;
    border: 2px solid #000;
    background: rgba(240, 237, 255, 0.8);
  }

  .login-button {
    width: 124px;
    margin: 40px 0 0px 0;
    border-radius: 32px;
    border: 6px solid #000;
    background: #b5fd1e;
    color: #000;
    margin: 40px auto 0;
  }

  button {
    padding: 10px;

    background-color: white;
    border: none;
    border-radius: 32px;
    color: #363636;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #f723fb;
  }

  .error {
    color: darkred;
    background-color: lightcoral;
    padding: 5px;
    border-radius: 5px;
  }

  .image-container {
    width: 60%;
    margin-left: 20px;
  }

  .image-container img {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
  }

  @media (max-width: 950px) {
    .container {
      flex-direction: column;
      align-items: center;
    }
    .login-box {
      width: 50%;
    }
    .image-container {
      width: 80%;
      margin-left: 0;
      margin-top: 20px;
    }
  }
</style>
