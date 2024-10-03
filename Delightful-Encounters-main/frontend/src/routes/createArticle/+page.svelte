<script>
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
  import Editor from "@tinymce/tinymce-svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let article = {};
  export let data;

  let title = article.title || "";
  let content = article.content || "";
  let filesToUpload = null;
  let error = false;
  let success = false;
  let contentError = false;
  let fileSizeError = false;
  let errorMessage = "";

  const isLoggedIn = data.isLoggedIn;

  onMount(() => {
    if (!isLoggedIn) {
      goto("/", { replaceState: true });
    }
  });

  const conf = {
    plugins: "lists table",
    toolbar:
      "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
  };

  async function handlePublish(e) {
    const formData = new FormData();
    error = false;
    success = false;
    contentError = false;
    fileSizeError = false;

    if (content.length > 5000) {
      return (contentError = true);
    }
    formData.append("title", title);
    formData.append("content", content);
    // Only if there is an image
    if (filesToUpload && filesToUpload.length > 0) {
      formData.append("image-file", filesToUpload[0]);
    }

    const response = await fetch(`${PUBLIC_API_BASE_URL}/articles`, {
      method: "POST",
      credentials: "include",
      body: formData
    });

    success = response.status === 201;
    error = !success;

    if (success) {
      setTimeout(() => {
        goto("/", { invalidateAll: true, replaceState: true });
      }, 2000);
    }
  }

  function handleCancel() {
    history.back();
  }
  //limit the file size in 2MB
  function onFileSelected(e) {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    let image = e.target.files[0];

    if (image.size > MAX_FILE_SIZE) {
      fileSizeError = true;
      errorMessage = "File size should be less than 2MB.";
      filesToUpload = null;
      e.target.value = ""; // Clear the selected file
      return;
    } else {
      fileSizeError = false;
      filesToUpload = e.target.files;
    }
  }

  $: titleLengthExceeded = title.length >= 50;
  $: contentLengthExceeded = content.length >= 5000;
</script>

<div
  class="create-article-wrapper"
  style="background-image: url('{`${PUBLIC_IMAGES_URL}/background.png`}');"
>
  <div class="create-article-container">
    <form on:submit|preventDefault={handlePublish}>
      <div class="form-group-inline">
        <label for="title" class="title-label">Title:</label>
        <input type="text" name="title" bind:value={title} maxlength="50" required />
        {#if titleLengthExceeded}
          <span class="error">Sorry, title should not exceed 50 characters!</span>
        {/if}
      </div>
      <div class="form-group">
        <label for="contentEditor">Content:</label>
        <Editor
          bind:value={content}
          apiKey="nvfbut79i1vx8nzifk2zx7czsnkngmox1hpmw4tyb4pcxl1y"
          {conf}
        />
      </div>
      {#if contentLengthExceeded}
        <span class="error">Sorry, content should not exceed 5000 characters!</span>
      {/if}
      <div class="form-group">
        <label for="imageFile">File to upload:</label>
        <input
          type="file"
          multiple={false}
          name="image-file"
          accept="image/png, image/jpeg"
          on:change={onFileSelected}
        />
        {#if fileSizeError}
          <span class="error">{errorMessage}</span>
        {/if}
      </div>
      <div class="button-container">
        <button type="submit">Publish</button>
        <button type="button" on:click={handleCancel}>Cancel</button>
      </div>
      {#if error}<span class="error">Could not save!</span>{/if}
      {#if success}<span class="success">Saved!</span>{/if}
      {#if contentError}<span class="error">Content should not exceed 5000 characters!</span>{/if}
    </form>
  </div>
</div>

<style>
  body {
    font-family: "Arial", sans-serif;
    background-color: #f4f6fe;
    margin: 0;
    padding: 0;
  }

  .create-article-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    background-size: 100%;
    background-position: center top;
    background-repeat: repeat;
    background-color: #f4f6fe;
    height: 86vh;
  }

  .create-article-container {
    background-size: 100%;
    background-position: center top;
    background-repeat: repeat;
    background-color: white;
    border-radius: 25px;
    width: 90%;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
  }

  form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group-inline {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-group {
    align-items: center;
  }

  .title-label {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    display: inline-block;
    width: 100px; /* 调整这个宽度以适应你的布局 */
  }

  label {
    font-size: 18px;
    margin-bottom: 5px;
  }

  input[type="text"],
  input[type="file"],
  .tox-tinymce {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .tox-tinymce {
    height: 300px;
  }

  .button-container {
    display: flex;
    gap: 20px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .button-container > button:nth-child(1) {
    background-color: rgb(145, 129, 244);
    color: white;
  }

  .button-container > button:nth-child(1):hover {
    background-color: rgb(124, 109, 221);
  }

  .button-container > button:nth-child(2) {
    background-color: rgb(236, 236, 236);
  }

  .button-container > button:nth-child(2):hover {
    background-color: rgb(200, 200, 200);
  }

  .error,
  .success {
    font-weight: bold;
    padding: 5px;
    text-align: center;
    width: 100%;
  }

  .error {
    color: darkred;
    background-color: lightcoral;
  }

  .success {
    color: darkgreen;
    background-color: lightgreen;
  }
</style>
