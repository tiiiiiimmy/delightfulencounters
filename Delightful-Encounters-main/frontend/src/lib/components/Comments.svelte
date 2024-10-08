<script>
  import { onMount } from "svelte";
  import CommentItem from "$lib/components/CommentItem.svelte"

  export let articleId;
  export let currentUserId;
  let comments = [];
  let newCommentContent = "";
  let showComments = true;
  let error = false;
  let errorMessage;

  $: limitation = newCommentContent.length < 200;
  onMount(async () => {
    await loadComments();
  });

  async function loadComments() {
    const response = await fetch(`http://localhost:3000/api/articles/${articleId}/comments`);
    if (response.status === 201|| 200) {
      const rawComments = await response.json();
      comments = organizeComments(rawComments);
    } else if (response.status === 400) {
      const errorData = await response.json();
      errorMessage = errorData.message;
    } else {
      const errorData = await response.json();
      errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred";
    }
  }


  function organizeComments(rawComments) {
    const commentMap = {};
    const rootComments = [];

    rawComments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.comment_id] = comment;

      if (comment.parent_comment_id === null) {
        rootComments.push(comment);
      } else {
        const parentComment = commentMap[comment.parent_comment_id];
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      }
    });

    return rootComments;
  }

  async function handleDelete(event) {
    const commentId = event.detail.commentId;
    const response = await fetch(
      `http://localhost:3000/api/articles/${articleId}/comments/${commentId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      await loadComments();
    } else {
      console.error("Failed to delete comment:", await response.text());
    }
  }

  async function handleSubmitReply(event) {
    const { commentId, replyContent } = event.detail;
    

    const response = await fetch(`http://localhost:3000/api/articles/${articleId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: replyContent,
        parent_comment_id: commentId
      })
    });

    if (response.status === 201||200) {
        await loadComments(); 
    } else if (response.status === 400) {
        const errorData = await response.json();
        errorMessage = errorData.message;
    } else {
        const errorData = await response.json();
        errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred"; 
    }
  }

  async function handlePublish() {
    if (newCommentContent.trim().length === 0) {
      error = true;
      return;
    }
    error = false;

    const response = await fetch(`http://localhost:3000/api/articles/${articleId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: newCommentContent,
        parent_comment_id: null
      })
    });

    if (response.status === 201 || 200) {
        newCommentContent = ""; 
        await loadComments(); 
    } else if (response.status === 400) {
        const errorData = await response.json();
        errorMessage = errorData.message;
    } else {
        const errorData = await response.json();
        errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred"; 
    }
  }
</script>

<main>
  <h1>Comments</h1>
  <button on:click={() => (showComments = !showComments)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M10.0723 7.40039C9.66621 7.40039 9.35156 7.71504 9.35156 8.10352C9.35156 8.49199 9.66621 8.80664 10.0723 8.80664C10.4432 8.80664 10.7578 8.49199 10.7578 8.10352C10.7578 7.71504 10.4432 7.40039 10.0723 7.40039ZM5.15039 7.40039C4.74434 7.40039 4.42969 7.71504 4.42969 8.10352C4.42969 8.49199 4.74434 8.80664 5.15039 8.80664C5.52129 8.80664 5.83594 8.49199 5.83594 8.10352C5.83594 7.71504 5.52129 7.40039 5.15039 7.40039Z" fill="#BD57FF"/>
      <path d="M15.7146 6.06426C14.8691 4.90411 13.6879 4.12891 12.3923 3.77911V3.78086C12.0918 3.44688 11.7525 3.13926 11.3728 2.86504C8.49527 0.773247 4.45582 1.41133 2.35523 4.28887C0.662461 6.62676 0.734531 9.77149 2.4607 12.0057L2.47477 14.3365C2.47477 14.3928 2.48355 14.449 2.50113 14.5018C2.5943 14.7988 2.9107 14.9623 3.20602 14.8691L5.43141 14.1678C6.02027 14.377 6.62848 14.4965 7.23316 14.5299L7.22437 14.5369C8.79059 15.6777 10.8437 16.0205 12.7263 15.3982L14.9605 16.126C15.0168 16.1436 15.0748 16.1541 15.1345 16.1541C15.4457 16.1541 15.697 15.9027 15.697 15.5916V13.2361C17.2457 11.1338 17.2861 8.22813 15.7146 6.06426ZM5.6775 12.9197L5.46656 12.8318L3.72633 13.3768L3.70875 11.5486L3.56812 11.3904C2.08102 9.57637 1.98258 6.96251 3.37477 5.04473C5.0693 2.7209 8.31773 2.20762 10.6345 3.88458C12.9584 5.57383 13.4734 8.817 11.7947 11.1268C10.3867 13.0586 7.86598 13.7723 5.6775 12.9197ZM14.5545 12.6209L14.4138 12.7967L14.4314 14.6248L12.7087 14.0447L12.4978 14.1326C11.5134 14.4982 10.464 14.5281 9.49195 14.2557L9.48844 14.2539C10.7875 13.8549 11.9652 13.0463 12.8142 11.8826C14.1572 10.0316 14.3752 7.70606 13.5947 5.72325L13.6052 5.73028C14.0095 6.02032 14.3804 6.38243 14.6951 6.82012C15.9712 8.5709 15.8992 10.9545 14.5545 12.6209Z" fill="#BD57FF"/>
      <path d="M7.61133 7.40039C7.20527 7.40039 6.89062 7.71504 6.89062 8.10352C6.89062 8.49199 7.20527 8.80664 7.61133 8.80664C7.98223 8.80664 8.29688 8.49199 8.29688 8.10352C8.29688 7.71504 7.98223 7.40039 7.61133 7.40039Z" fill="#BD57FF"/>
    </svg>
    {showComments ? "Hide Comments" : "Show Comments"}
  </button>

  {#if showComments}
    <ul>
      {#each comments as comment}
        <CommentItem
          {comment}
          {articleId}
          {currentUserId}
          on:deleteComment={handleDelete}
          on:submitReply={handleSubmitReply}
        />
      {/each}
    </ul>
  {/if}
  {#if currentUserId }
  <form on:submit|preventDefault={handlePublish}>
    <textarea bind:value={newCommentContent} maxlength="200" placeholder="Type your comment here..." rows="3"
    ></textarea>
    <button type="submit">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M10.0723 7.40039C9.66621 7.40039 9.35156 7.71504 9.35156 8.10352C9.35156 8.49199 9.66621 8.80664 10.0723 8.80664C10.4432 8.80664 10.7578 8.49199 10.7578 8.10352C10.7578 7.71504 10.4432 7.40039 10.0723 7.40039ZM5.15039 7.40039C4.74434 7.40039 4.42969 7.71504 4.42969 8.10352C4.42969 8.49199 4.74434 8.80664 5.15039 8.80664C5.52129 8.80664 5.83594 8.49199 5.83594 8.10352C5.83594 7.71504 5.52129 7.40039 5.15039 7.40039Z" fill="#BD57FF"/>
        <path d="M15.7146 6.06426C14.8691 4.90411 13.6879 4.12891 12.3923 3.77911V3.78086C12.0918 3.44688 11.7525 3.13926 11.3728 2.86504C8.49527 0.773247 4.45582 1.41133 2.35523 4.28887C0.662461 6.62676 0.734531 9.77149 2.4607 12.0057L2.47477 14.3365C2.47477 14.3928 2.48355 14.449 2.50113 14.5018C2.5943 14.7988 2.9107 14.9623 3.20602 14.8691L5.43141 14.1678C6.02027 14.377 6.62848 14.4965 7.23316 14.5299L7.22437 14.5369C8.79059 15.6777 10.8437 16.0205 12.7263 15.3982L14.9605 16.126C15.0168 16.1436 15.0748 16.1541 15.1345 16.1541C15.4457 16.1541 15.697 15.9027 15.697 15.5916V13.2361C17.2457 11.1338 17.2861 8.22813 15.7146 6.06426ZM5.6775 12.9197L5.46656 12.8318L3.72633 13.3768L3.70875 11.5486L3.56812 11.3904C2.08102 9.57637 1.98258 6.96251 3.37477 5.04473C5.0693 2.7209 8.31773 2.20762 10.6345 3.88458C12.9584 5.57383 13.4734 8.817 11.7947 11.1268C10.3867 13.0586 7.86598 13.7723 5.6775 12.9197ZM14.5545 12.6209L14.4138 12.7967L14.4314 14.6248L12.7087 14.0447L12.4978 14.1326C11.5134 14.4982 10.464 14.5281 9.49195 14.2557L9.48844 14.2539C10.7875 13.8549 11.9652 13.0463 12.8142 11.8826C14.1572 10.0316 14.3752 7.70606 13.5947 5.72325L13.6052 5.73028C14.0095 6.02032 14.3804 6.38243 14.6951 6.82012C15.9712 8.5709 15.8992 10.9545 14.5545 12.6209Z" fill="#BD57FF"/>
        <path d="M7.61133 7.40039C7.20527 7.40039 6.89062 7.71504 6.89062 8.10352C6.89062 8.49199 7.20527 8.80664 7.61133 8.80664C7.98223 8.80664 8.29688 8.49199 8.29688 8.10352C8.29688 7.71504 7.98223 7.40039 7.61133 7.40039Z" fill="#BD57FF"/>
      </svg>
      Submit Comment
    </button>
    {#if error}<span class="error">Comment content cannot be empty!</span>{/if}
    {#if !limitation }
    <div class="warning">The number of characters cannot exceed 200.</div>
    {/if}
  </form>
  {/if}
  {#if !currentUserId }
  <a class="tips" href="http://localhost:5173/login">Login to add your comment here</a>
  {/if}
</main>

{#if errorMessage}
<p class="errormessage">{errorMessage}</p>
{/if}

<style>
  main {
    background-color: white;
    border-radius: 8px;
    width: 100%;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  textarea {
    width: 90%;
    margin: 10px 0px;
    padding: 10px;
    background-color: #ffffff;
    border: 2px solid #800080;
    border-radius: 8px;
    color: #333;
    font-size: 16px;
    font-family: Arial, sans-serif;
  }

  button {
    display: inline-block;
    padding: 8px 15px;
    cursor: pointer;
    background-color: #F6F5FF;
    border: none;
    border-radius: 10px;
    color: #000;
  }

  button:hover {
    background-color: #cecece;
  }

  .error {
    color: red;
  }
  .tips {
    color: #BD57FF;
    text-decoration: none;   
  }

  .tips:hover {
    text-decoration: underline; 
  }

  .warning{
    color: red;
  }

  .errormessage{
    color: red;
  }
</style>


