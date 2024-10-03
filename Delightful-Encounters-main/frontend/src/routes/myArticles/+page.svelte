<script>
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import ArticlesList from "$lib/components/ArticlesList.svelte";
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
  let myArticles = [];
  export let data;

  const isLoggedIn = data.isLoggedIn;
  onMount(() => {
    if (!isLoggedIn) {
      goto("/", { replaceState: true });
    }
  });

  async function fetchMyArticles() {
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/articles/get-my-articles`, {
        credentials: "include", // Include credentials for authentication
        headers: {
          "Content-Type": "application/json"
          // Add other headers if necessary
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      myArticles = data; // Set the articles data
      console.log(111, data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  }

  onMount(() => {
    fetchMyArticles();
  });
</script>

<div class="container" style="background-image: url('{`${PUBLIC_IMAGES_URL}/background.png`}');">
<div class="articles-body">
  <div class="articles-list-container">
    <h1>My Articles</h1>
    {#if myArticles.length === 0}
      <p>You have no articles yet. Start writing to share your thoughts!</p>
    {:else}
      <ArticlesList articles={myArticles} />
    {/if}
  </div>
</div>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
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

  .articles-body {
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 70%;
    min-width: 550px;
    padding: 0px;
    margin-top: 500px;
    border-radius: 60px;
    background: #fff;
  }

  .articles-list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

</style>
