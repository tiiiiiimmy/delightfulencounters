<script>
  import { onMount } from "svelte";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { writable } from "svelte/store";
  export let articles = [];
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
    let errorMessage;

  let likesCounts = writable(new Map());

 async function fetchLikes(articleId) {
    const response = await fetch(`${PUBLIC_API_BASE_URL}/articles/${articleId}/like`);
    if (response.status === 200) {
        const data = await response.json();
        likesCounts.update((counts) => {
      counts.set(articleId, data.like_count);
      return new Map(counts);
    });
  } else if (response.status === 404) {
        const errorData = await response.json();
        errorMessage = errorData.message;
        return; 
    }
    else {
      const errorData = await response.json();
        errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred";
    }
  }
  onMount(async () => {
    articles.forEach((article) => {
      fetchLikes(article.article_id);
    });
  });

  function formatDate(timestamp) {
    console.log("Timestamp received:", timestamp);
    if (!timestamp) {
      return "No date provided";
    }
    const date = new Date(parseInt(timestamp));
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  let currentPage = 1;
  const articlesPerPage = 4;
  $: totalPages = Math.ceil(articles.length / articlesPerPage);

  function paginate(array, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return array.slice(start, end);
  }

  $: displayedArticles = paginate(articles, currentPage, articlesPerPage);

  function goToPage(page) {
    currentPage = page;
  }

  function nextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }
</script>

<div class="article-list">
  {#each displayedArticles as article}
    <a href="/articles/{article.article_id}" class="article">
      <div>
        <h2>{article.title}</h2>
        <div class="author">
          <p>{article.username}&nbsp;&nbsp;{formatDate(article.published_date)}</p>
        </div>

        <h1>Likes: {$likesCounts.get(article.article_id)}</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="41"
          height="41"
          viewBox="0 0 41 41"
          fill="none"
        >
          <circle cx="20.5" cy="20.5" r="20.5" fill="#B9FF66" />
          <path
            d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7033 27.0609 30.2284 27.2753 29.4282L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z"
            fill="black"
          />
        </svg>
      </div>

      <div>
        {#if article.image}
          <img src="{PUBLIC_IMAGES_URL}/{article.image}" alt={article.title} />
        {/if}
      </div>
    </a>
  {/each}
</div>

<div class="pagination">
  <button on:click={previousPage}>&lt;</button>
  <span>{currentPage} / {totalPages}</span>
  <button on:click={nextPage}>&gt;</button>
</div>

<style>
  .article-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 94%;
  }

  img {
    max-width: 400px;
    max-height: 200px;
    border-radius: 20px;
    object-fit: cover;
    margin: 0px 20px;
    object-position: center;
  }

  .article {
    margin: 0px 0px 40px 0px;
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 20px 0;
    justify-content: space-between;
    align-items: center;
    border-radius: 45px;
    border: 1px solid #191a23;
    box-shadow: 0px 5px 0px 0px #191a23;
    color: #191a23;
    text-decoration: none;
  }

  .article:nth-child(odd) {
    background-color: #191a23;
  }

  .article:nth-child(even) {
    background-color: #f3f3f3;
  }

  .author {
    margin: -18px;
    margin-left: 20px;
    margin-bottom: 80px;
    font-family: "Space Grotesk";
    font-size: 16px;
    min-width: 80px;
    font-weight: 400;
    line-height: 28px;
    background: #b9ff66;
    border-radius: 10px;
    padding: 0px 0px 0px 0px;
  }
  a {
    padding: 0px 0px 0px 0px;
  }

  h2 {
    margin: 0px;
    font-family: "Space Grotesk";
    font-size: 30px;
    margin-left: 50px;
    font-style: normal;
    font-weight: 1500;
    line-height: normal;
    background: #b9ff66;
    border-radius: 10px;
    padding: 0px 0px 0px 0px;
    word-break: break-word;
  }
  svg {
    margin-left: 50px;
  }

  .pagination button {
    background-color: #003cff;
    color: white;
    border: none;
    padding: 10px 15px;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  h1 {
    font-size: 16px;
    margin-bottom: 20px;
    margin-left: -20px;
    font-family: Poppins;
    font-weight: 700;
    max-width: 200px;
    background: #f723fb;
    z-index: 1;
  }
</style>
