<script>
	import { onMount } from "svelte";
  import { PUBLIC_API_BASE_URL, PUBLIC_IMAGES_URL } from "$env/static/public";

  import Editor from "@tinymce/tinymce-svelte";
  import { goto } from "$app/navigation";

  export let data; // This will be populated from the load function
  let currentArticle = data.currentArticle;
  let title = currentArticle.title;
  let content = currentArticle.content;
  let currentImage = currentArticle.image;
  let filesToUpload = null;
  let error = false;
  let success = false;
  let contentError = false;
  let deleteImage = false;
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
    formData.append("currentImage", currentImage);
    
    // Append the deleteImage flag
    formData.append("deleteImage", deleteImage);

    // Only append the new image if one is selected
    if (filesToUpload && filesToUpload.length > 0) {
      formData.append("image-file", filesToUpload[0]);
    }

    const response = await fetch(`${PUBLIC_API_BASE_URL}/articles/${currentArticle.article_id}`, {
      method: "PUT",
      credentials: "include",
      body: formData
    });
    

    if (response.status === 200) {
      // Wait for 2 seconds before navigating
      success=true;
      setTimeout(() => {
        goto(`/articles/${currentArticle.article_id}`, { invalidateAll: true, replaceState: true });
      }, 2000);
    }
    else if (response.status === 404) {
      fileSizeError = true;
      errorMessage = "Article not found!";
    } else {
      error = true;
    }
  }

  function handleCancel() {
    history.back();
  }

  function handleDeleteImage() {
    deleteImage = true;
    currentImage = null;
    filesToUpload = null;
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


<div class="page-header " style="background-image: url('{`${PUBLIC_IMAGES_URL}/background.png`}');">
  <div class="edit-article-container">
  <form  on:submit|preventDefault={handlePublish}>
     <label for="title">Title:</label>
     <input type="text" name="title" bind:value={title} maxlength="50" required />
     {#if titleLengthExceeded}
         <span class="error">Sorry, title should not exceed 50 characters!</span>
     {/if}
      <label for="contentEditor">Content:</label>
     <Editor bind:value={content} apiKey="nvfbut79i1vx8nzifk2zx7czsnkngmox1hpmw4tyb4pcxl1y" {conf} />
     {#if contentLengthExceeded}
        <span class="error">Sorry, content should not exceed 5000 characters!</span>
     {/if}
     {#if currentImage}
        <div class="image-preview">
           <img src="{PUBLIC_IMAGES_URL}/{currentImage}" alt={title} />
           <button type="button" on:click={handleDeleteImage}>Delete Image</button>
        </div>
       {/if}

     {#if !currentImage || deleteImage}
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
     {/if}
    
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

  
.page-header {
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
  form {
    margin: auto;
    padding: 10px;
    display: grid;
    width: 95%;
    grid-template-columns: auto 1fr;
    gap: 30px;
  }
  label {
    font-size: 1.3rem;
  }

  form>input[type=text] {
    font-size: 1.5rem;
  }

  .edit-article-container {
    display: flex;
    justify-content: space-between;
    background-size: 100%;
    background-position: center top;
    background-repeat: repeat;
    background-color: white;
    border-radius: 25px;
    width: 70%;
    min-height: 60vh;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
  }
  .button-container {
    display: flex;
    gap: 20px;
  }

  button,
  .error,
  .success {
    grid-column: 1 / 3;
  }

  button {
    font-size: 1.2rem;
    background-color: rgb(145, 129, 244);
    color: white;
    border: 0;
    border-radius: 20px;
  }

  .error,
  .success {
    font-weight: bold;
    padding: 5px;
    text-align: center;
  }

  .error {
    color: darkred;
    background-color: lightcoral;
  }

  .success {
    color: darkgreen;
    background-color: lightgreen;
  }

  .image-preview {
    grid-column: 1 / 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .image-preview img {
    max-width: 100%;
    max-height: 300px; /* Set a max height to prevent the image becoming too large */
    height: auto;
    border: 1px solid #ccc;
    padding: 5px;
  }


</style>
