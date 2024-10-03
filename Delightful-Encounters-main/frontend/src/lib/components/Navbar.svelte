<script>
  import { page } from "$app/stores";
  import { PUBLIC_API_BASE_URL, PUBLIC_IMAGES_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const USER_URL = `${PUBLIC_API_BASE_URL}/users`;
  const AUTH_URL = `${PUBLIC_API_BASE_URL}/auth/logout`;
  export let userId;

  export let isLoggedIn;
  $: path = $page.url.pathname;
  let userName = "";
  let userInfo = null;
  $: avatarPath = null;
  let errorMessage;
  async function goToHomeAndRefresh() {
    await goto("/", { replaceState: true });
    window.location.reload();
  }
  async function loadUserInfo() {
    const response = await fetch(`${USER_URL}/get-user/${userId}`);
    const result = await response.json();
    if (response.status === 200) {
      userInfo = result;
      userName = userInfo.username;
      avatarPath = PUBLIC_IMAGES_URL + "/" + result.avatar;
    } else if (response.status === 404) {
      const errorData = await response.json();
      errorMessage = errorData.message;
    } else {
      const errorData = await response.json();
      errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred";
    }
  }

  onMount(loadUserInfo);

  async function handleLogout() {
    const response = await fetch(AUTH_URL, {
      method: "DELETE",
      credentials: "include"
    });

    if (response.status === 204) {
      sessionStorage.clear();
      localStorage.clear();
      goto("/", { invalidateAll: true, replaceState: true });
    } else if (response.status !== 204) {
      const errorData = await response.json();
      errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred";
    }
  }

  function handleNavigate(url) {
    goto(url);
  }
</script>

<nav>
  {#if isLoggedIn}
    <ul>
      <li>
        <a
          href="/"
          class:active={path === "/" || path.startsWith("/")}
          class:is-active={path === "/"}
          on:click|preventDefault={goToHomeAndRefresh}>Home</a
        >
      </li>
      <li>
        <a
          href="/createArticle"
          class:active={path === "/createArticle" || path.startsWith("/createArticle/")}
          class:is-active={path === "/createArticle"}>Create Article</a
        >
      </li>
      <li>
        <a
          href="/myArticles"
          class:active={path === "/myArticles" || path.startsWith("/myArticles/")}
          class:is-active={path === "/myArticles"}>My Articles</a
        >
      </li>
    </ul>
    <div class="dropdown">
      <img src={avatarPath} alt="avatar" />
      <button class="dropbtn"> {userName}</button>
      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="10" viewBox="0 0 9 10" fill="none">
        <g clip-path="url(#clip0_387_1112)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.50025 5.64112L7.08573 3.05563C7.47626 2.66511 8.03028 2.58596 8.32317 2.87886C8.61606 3.17175 8.53692 3.72577 8.14639 4.11629L5.31797 6.94472C5.07468 7.18801 4.76793 7.31045 4.5004 7.29738C4.2328 7.31056 3.92592 7.18811 3.68254 6.94473L0.854115 4.11631C0.46359 3.72578 0.384445 3.17176 0.677338 2.87887C0.970231 2.58598 1.52425 2.66512 1.91477 3.05565L4.50025 5.64112Z"
            fill="#363636"
          />
        </g>
        <defs>
          <clipPath id="clip0_387_1112">
            <rect width="10" height="9" fill="white" transform="translate(9) rotate(90)" />
          </clipPath>
        </defs>
      </svg>
      <div class="dropdown-content">
        <button on:click={() => handleNavigate("/accountSetting")}>Setting</button>
        <button on:click={handleLogout}>Logout</button>
      </div>
    </div>
  {:else}
    <a
      href="/"
      class:active={path === "/" || path.startsWith("/")}
      class:is-active={path === "/"}
      class="home_login"
      on:click|preventDefault={goToHomeAndRefresh}>Home</a
    >
    <p>Connect with each other and share happiness.</p>
    <a href="/login" class:active={path.startsWith("/login")} class="a_login">
      <button
        >Login &nbsp;<svg
          xmlns="http://www.w3.org/2000/svg"
          width="6"
          height="11"
          viewBox="0 0 6 11"
          fill="none"
        >
          <path
            d="M1.04004 1.5L5.04004 5.5L1.04004 9.5"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg></button
      >
    </a>
  {/if}
</nav>
{#if errorMessage}
  <p class="errormessage">{errorMessage}</p>
{/if}

<style>
  nav {
    padding: 16px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    height: 30px;
  }

  ul {
    list-style: none;
    margin: 0 -6rem 0 0;
    /* make sure the <a> in the middle */
    padding: 0;
    display: flex;
  }

  li {
    margin-right: 1rem;
  }

  a {
    color: #333;
    font-size: 1.2rem;
    text-decoration: none;
  }

  a.is-active {
    color: blue;
    font-weight: 800;
    text-decoration: underline;
    text-decoration-thickness: 3px;
  }

  .a_login > button {
    background: black;
    color: white;
    border-radius: 10px;
  }

  a:hover,
  a:active,
  a:focus {
    text-decoration: underline;
    color: #000;
  }
  .home_login {
    margin-right: auto;
  }
  .dropbtn {
    background-color: transparent;
    border: none;
    color: #333;
    font-size: 1rem;
    cursor: pointer;
    padding: 0px 10px;
  }

  .dropdown {
    width: 6rem;
    /* make sure the <a> in the middle */
    position: absolute;
    display: flex;
    justify-content: center;
    right: 10px;
  }

  .dropdown img {
    margin: auto 0;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }
  svg {
    margin: auto 0;
  }

  .dropdown-content {
    margin-top: 24px;
    margin-right: 16px;
    border-radius: 16px;
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 120px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    text-align: center;
  }

  .dropdown-content button {
    border-radius: 20px;
    height: 40px;
    width: 100%;
    font-size: 0.9rem;
    display: block;
    border: none;
    background: none;
    text-align: center;
    cursor: pointer;
  }
  .dropdown-content button:hover {
    background-color: #0123ff;
    color: white;
    font-weight: 800;
  }
  .dropdown:hover .dropdown-content {
    display: block;
  }
  button {
    color: black;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    height: 26px;
  }
  p {
    font-size: 16px;
    margin: 0 30px;
  }
.errormessage {
    color: red;
  }
</style>

