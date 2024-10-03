<script>
  import ArticlesList from "$lib/components/articlesList.svelte";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
  import { onMount } from "svelte";
  export let data;

  let searchInput = "";
  let searchField = "title";
  let sortField = "date";
  let articles = data.articles;
  $: limitation = searchInput.length < 50;

  async function fetchArticles() {
    const searchQuery = `${searchField}:${encodeURIComponent(searchInput)}`;
    const ARTICLES_URL = `${PUBLIC_API_BASE_URL}/articles/search?search=${searchQuery}&sort=${sortField}`;

    const response = await fetch(ARTICLES_URL);
    articles = await response.json();
  }

  function handleSearch(event) {
    event.preventDefault();
    searchInput = searchInput.replace(/\s+/g, '');
    fetchArticles();
  }
  
  onMount(async () => {
    if (sortField) {
      fetchArticles();
    }
    window.location.reload
  });
</script>

<div class="container" style="background-image: url('{`${PUBLIC_IMAGES_URL}/background.png`}');">
  <div class="articles-body">
    <div class="search-sort-container">
      <div class="search-bar">
        <form on:submit={handleSearch}>
          <div class="input-group">
            <select bind:value={searchField} class="search-field">
              <option value="title">Title</option>
              <option value="username">Username</option>
              <option value="date">Date</option>
            </select>
            <input type="text" placeholder="Enter search content"bind:value={searchInput} maxlength="50" class="search-input"/>
            <button type="submit">Search</button>
          </div>
        </form>
      </div>

      <div class="sort-bar">
        <select bind:value={sortField} on:change={fetchArticles} class="sort-field">
          <option value="date">Date</option>
          <option value="username">Username</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
        {#if !limitation }
          <div class="warning">The number of characters cannot exceed 50.</div>
        {/if}
    <div class="articles-list-container">
      {#if articles.length === 0}
        <p>Search has no results, please enter other content.</p>
      {:else}
        <ArticlesList {articles} />
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
    align-items: center; /* Center children horizontally */
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

  .search-sort-container {
    border-radius: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    width: 100%;
    margin-left: -30px;
  }

  .search-bar {
    max-width: 300px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 10px;
  }

  .search-field,
  input[type="text"] {
    height: 2rem;
    border: none;
    outline: none;
    min-width: 0px;
    margin: 0 5px;

    border-radius: 40px;
    background-color: black;
    color: white;
  }

  .input-group {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    border-radius: 40px;
    padding: 0.5rem;
    width: 100%;
    max-width: 800px;
  }

  .search-input {
    width: 100%;
    min-width: 100px;
    padding: 0px 8px;
    box-sizing: border-box;
    margin: 0 10px;
    background-color: #f1f1f1;
  }

  button {
    padding: 0.3rem 0.5rem;
    border-radius: 40px;
    border: none;
    background-color: black;
    color: white;
    cursor: pointer;
    min-width: 10px;
    flex-shrink: 0;
    transition: background-color 0.3s;
  }


  button:hover {
    background-color: #0056b3;
  }

  .sort-bar {
    background-color: #f1f1f1;
    height: 100%;
    display: flex;
    max-width: 100px;
    justify-content: flex-end;
    margin: 0 20px;
    border-radius: 40px;
    padding: 10px;

    /* Adjust margin to align tightly with the search bar */
  }

  .sort-field {
    height: 100%;
    border: none;
    outline: none;
    padding: 0.5rem 1rem;
    border-radius: 40px;
    max-width: 80px;
    background-color: #f1f1f1;
  }

  .warning {
    margin-left: 35%;
    padding: 0px;
    margin-top: 0px;
    margin-bottom: 10px;
    color:red;
    
  }
</style>
