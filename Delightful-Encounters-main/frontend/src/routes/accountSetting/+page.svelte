<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Modal from "$lib/components/Modal.svelte";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { PUBLIC_IMAGES_URL } from "$env/static/public";
  const USER_URL = `${PUBLIC_API_BASE_URL}/users`;
  const CHECKUSERNAME_URL = `${PUBLIC_API_BASE_URL}/users/check-username`;

  export let data;

  let userId = data.userId;
  let userInfo = {};
  let errorMessage;
  let isEditing = false;
  let usernameExistMessage = "";
  let isUsernameAvailable = true;
  let validationErrors = {};
  let filesToUpload;
  let avatarPreview = "";
  let showPasswordField = false; // New variable to track password field visibility
  let password = ""; // New variable to store the password
  let isModalOpen = false;
  let isValid = false;

  const isLoggedIn = data.isLoggedIn;
  onMount(() => {
    if (!isLoggedIn) {
      goto("/", { replaceState: true });
    }
  });

  async function loadUserInfo() {
    try {
      const response = await fetch(`${USER_URL}/get-user/${userId}`);
      const result = await response.json();

      if (response.ok) {
        userInfo = result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  onMount(loadUserInfo);

  async function updateUserInfo(e) {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      formData.append("username", userInfo.username);
      formData.append("fname", userInfo.fname);
      formData.append("lname", userInfo.lname);
      formData.append("date_of_birth", userInfo.date_of_birth);
      formData.append("description", userInfo.description);
      if (filesToUpload && filesToUpload.length > 0) {
        formData.append("image-file", filesToUpload[0]);
      }
      formData.append("avatar", userInfo.avatar);
      if (password) {
        formData.append("password", password);
      }

      const response = await fetch(`${USER_URL}/`, {
        method: "PUT",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      isEditing = false;
      if (userInfo.username !== initialUsername) {
        goto("/", { invalidateAll: true, replaceState: true });
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function checkUserName() {
    if (userInfo.username !== initialUsername) {
      const response = await fetch(`${CHECKUSERNAME_URL}/${userInfo.username}`, {
        method: "GET"
      });
      const result = await response.json();
      if (result.message === "Username already exists") {
        usernameExistMessage = "Username already exists";
        isUsernameAvailable = false;
      } else {
        usernameExistMessage = "Username is available";
        isUsernameAvailable = true;
      }
    } else {
      usernameExistMessage = "";
      isUsernameAvailable = true;
    }
  }

  async function deleteAccount() {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${USER_URL}/`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }
      closeModal();
      goto("/", { invalidateAll: true, replaceState: true });
    } catch (error) {
      errorMessage = error.message;
    }
  }

  let avatars = [
    "StockCake-AgileDogJumping.jpg",
    "StockCake-CatEnjoyingSunlight.jpg",
    "StockCake-DeerinStream.jpg",
    "StockCake-DetectiveCatPoses.jpg",
    "StockCake-DogPreparesDinner.jpg",
    "StockCake-ElephantCelebrationJoy.jpg",
    "StockCake-FoxinFlight.jpg",
    "StockCake-GiraffeEatingLeaves.jpg",
    "StockCake-KangarooPortraitPose.jpg",
    "StockCake-MajesticLionPose.jpg",
    "StockCake-MajesticYellowBird.jpg",
    "StockCake-SunsetDolphinLeap.jpg"
  ];

  let selectedAvatar = "";

  function setAvatarPath(avatar) {
    return function () {
      avatarPreview = "";
      filesToUpload = null;
      selectedAvatar = selectedAvatar === avatar ? "" : avatar;
      userInfo.avatar = selectedAvatar ? selectedAvatar : "";
      isValid = true;
    };
  }

   function getTodayDate() {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }

  function validateForm() {
    validationErrors = {};

    if (
      !userInfo.username ||
      userInfo.username.length < 5 ||
      userInfo.username.length > 20 ||
      !/^[\w]+$/.test(userInfo.username)
    ) {
      validationErrors.username =
        "Username must be 5-20 characters long and can include letters, numbers, and underscores only.";
    }

    if (!userInfo.fname || userInfo.fname.length < 3 ||
      userInfo.username.length > 20) {
      validationErrors.fname = "First name must be 3-20 characters long.";
    }

    if (!userInfo.lname || userInfo.lname.length < 3||
      userInfo.username.length > 20) {
      validationErrors.lname = "Last name must be 3-20 characters long.";
    }

    if (
      !userInfo.description ||
      userInfo.description.length < 1 ||
      userInfo.description.length > 1000
    ) {
      validationErrors.description = "Description must be 1-1000 characters long.";
    }

    if (showPasswordField && (password.length < 5 || !/^[\w]+$/.test(password))) {
      validationErrors.password =
        "Password must be at least 5 characters long and can include letters, numbers, and underscores only.";
    }

    if(!userInfo.date_of_birth || userInfo.date_of_birth > getTodayDate()){
     
      validationErrors.date_of_birth = "You cannot be born in the future!";
    }
    if (validationErrors.length > 0) {
      return (isValid = false);
    }

    return (isValid = true);
  }

  function onFileSelected(e) {
    let image = e.target.files[0];
    let reader = new FileReader();
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (image.size > MAX_FILE_SIZE) {
      errorMessage = "File size must be less than 2MB.";
      avatarPreview = "";
      filesToUpload = null;
      isValid = false;
      e.target.value = ""; // Clear the selected file
      return;
    } else {
      isValid = true;
    }

    if (image) {
      reader.onload = (e) => {
        avatarPreview = e.target.result;
      };
      reader.readAsDataURL(image);
      filesToUpload = e.target.files;
    }
  }

  function togglePasswordField() {
    showPasswordField = !showPasswordField;
    if (showPasswordField) {
      password = ""; // Reset password field to empty when shown
    }
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

{#if userInfo}
  <div
    class="user-info-container"
    style="background-image: url('{`${PUBLIC_IMAGES_URL}/loginbgunder.png`}');"
  >
    <h1>ACCOUNTSETTING</h1>

    {#if isEditing}
      <form on:submit|preventDefault={updateUserInfo} class="user-details">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="145"
          height="136"
          viewBox="0 0 145 136"
          fill="none"
          class="icon2"
        >
          <path
            d="M47.3293 131.428L72.4381 93.4869L97.5398 131.184L98.647 132.847L100.311 131.742L126.091 114.617L127.936 113.392L126.529 111.681L97.204 76.0293L139.69 63.245L141.677 62.647L141.006 60.6831L131.339 32.3905L130.646 30.3638L128.672 31.1932L88.4621 48.0831L90.5433 4.09452L90.6423 2H88.5455H56.5684H54.4715L54.5706 4.09452L56.6518 48.0831L16.442 31.1932L14.4674 30.3638L13.7749 32.3905L4.10744 60.6831L3.43639 62.647L5.42371 63.245L47.8977 76.0257L18.3419 111.675L16.932 113.376L18.7639 114.61L44.5438 131.983L46.2163 133.11L47.3293 131.428Z"
            fill="#B5FD1E"
            stroke="black"
            stroke-width="4"
          />
        </svg>
        <div class="edit-avatar">
          {#if avatarPreview}
            <img class="avatar-preview" src={avatarPreview} alt="Avatar Preview" />
          {:else if userInfo.avatar}
            <img
              class="avatar-preview"
              src={`${PUBLIC_IMAGES_URL}/${userInfo.avatar}`}
              alt="Avatar Preview"
            />
          {/if}
          <div class="form-group">
            <label for="defaultAvatar">Choose default avatar:</label>
            <div class="avatars">
              {#each avatars as avatar}
                <img
                  on:click={setAvatarPath(avatar)}
                  src={`http://localhost:3000/images/${avatar}`}
                  class:active={selectedAvatar == avatar}
                />
              {/each}
            </div>
          </div>
          <div class="form-group">
            <label for="avatar"><strong>Upload Avatar:</strong></label>

            <input
              type="file"
              multiple={false}
              name="image-file"
              accept="image/png, image/jpeg"
              on:change={onFileSelected}
            />
          </div>
        </div>

        <div class="user-info">
          <div class="form-group">
            <label for="username"><strong>Username:</strong></label>
            <input
              id="username"
              type="text"
              bind:value={userInfo.username}
              on:blur={checkUserName}
              on:input="{validateForm}"
            />
            {#if usernameExistMessage}
              <p class="validation-message">{usernameExistMessage}</p>
            {/if}
            {#if validationErrors.username}
              <p class="validation-message">{validationErrors.username}</p>
            {/if}
          </div>
          <div class="form-group">
            <label for="fname"><strong>First Name:</strong></label>
            <input id="fname" type="text" bind:value={userInfo.fname} on:input="{validateForm}" />
            {#if validationErrors.fname}
              <p class="validation-message">{validationErrors.fname}</p>
            {/if}
          </div>
          <div class="form-group">
            <label for="lname"><strong>Last Name:</strong></label>
            <input id="lname" type="text" bind:value={userInfo.lname} on:input="{validateForm}" />
            {#if validationErrors.lname}
              <p class="validation-message">{validationErrors.lname}</p>
            {/if}
          </div>
          <div class="form-group">
            <label for="date_of_birth"><strong>Date of Birth:</strong></label>
            <input
              id="date_of_birth"
              type="date"
              bind:value={userInfo.date_of_birth}
              on:input="{validateForm}"
            />
            {#if validationErrors.date_of_birth}
              <p class="validation-message">{validationErrors.date_of_birth}</p>
            {/if}
          </div>
          <div class="form-group">
            <label for="description"><strong>Description:</strong></label>
            <textarea id="description" bind:value={userInfo.description} on:input="{validateForm}"
            ></textarea>
            {#if validationErrors.description}
              <p class="validation-message">{validationErrors.description}</p>
            {/if}
          </div>
          <div class="form-group">
            <button type="button" on:click={togglePasswordField}>
              {showPasswordField ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>
          {#if showPasswordField}
            <div class="form-group">
              <label for="password"><strong>New Password:</strong></label>
              <input id="password" type="password" bind:value={password} on:input="{validateForm}" />
              {#if validationErrors.password}
                <p class="validation-message">{validationErrors.password}</p>
              {/if}
            </div>
          {/if}

          {#if errorMessage}
            <p class="validation-message">{errorMessage}</p>
          {/if}
          <div class="button-container">
            <button type="submit" disabled={!isUsernameAvailable || !isValid}> Save </button>
            <button type="button" on:click={() => (isEditing = false)}>Cancel</button>
          </div>
        </div>
      </form>
    {:else}
      <div class="user-details">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="145"
          height="136"
          viewBox="0 0 145 136"
          fill="none"
          class="icon2"
        >
          <path
            d="M47.3293 131.428L72.4381 93.4869L97.5398 131.184L98.647 132.847L100.311 131.742L126.091 114.617L127.936 113.392L126.529 111.681L97.204 76.0293L139.69 63.245L141.677 62.647L141.006 60.6831L131.339 32.3905L130.646 30.3638L128.672 31.1932L88.4621 48.0831L90.5433 4.09452L90.6423 2H88.5455H56.5684H54.4715L54.5706 4.09452L56.6518 48.0831L16.442 31.1932L14.4674 30.3638L13.7749 32.3905L4.10744 60.6831L3.43639 62.647L5.42371 63.245L47.8977 76.0257L18.3419 111.675L16.932 113.376L18.7639 114.61L44.5438 131.983L46.2163 133.11L47.3293 131.428Z"
            fill="#B5FD1E"
            stroke="black"
            stroke-width="4"
          />
        </svg>
        {#if userInfo.avatar}
          <img src={`${PUBLIC_IMAGES_URL}/${userInfo.avatar}`} alt="Avatar" />
        {/if}
        <div class="user-info">
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>First Name:</strong> {userInfo.fname}</p>
          <p><strong>Last Name:</strong> {userInfo.lname}</p>
          <p><strong>Date of Birth:</strong> {userInfo.date_of_birth}</p>
          <p><strong>Description:</strong> {userInfo.description}</p>
          <div class="info-button">
            <button on:click={() => (isEditing = true)}>Edit</button>
            <button on:click={openModal}>Delete Account</button>
            {#if isModalOpen}
              <Modal on:close={closeModal}>
                <p style="text-align: center;;">Are you sure you want to delete your account?</p>
                <button on:click={deleteAccount}>Delete</button>
              </Modal>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <p>Loading...</p>
{/if}

<!-- YourMainComponent.svelte -->
<style>
  .user-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw; /* Use viewport width */
    height: 94vh; /* Use viewport height */
    padding: 60px 20px 20px 20px;

    box-sizing: border-box;
    background-size: 100%;
    background-position: center top;
    background-repeat: repeat;
    background-color: #f4f6fe;
  }

  h1 {
    font-size: 48px;
    margin-bottom: 20px;
    position: absolute;
    font-family: Poppins;
    font-weight: 700;
    right: 70px;
    top: 50px;
    background: #f723fb;
    z-index: 1;
    transform: rotate(6.659deg);
  }
  .edit-avatar{
    width: 50%;
  }
  .user-details {
    margin: 0 auto;
    justify-content: center;
    gap: 10px;
    width: 70%;
    background: white;
    padding: 40px;
    border-radius: 30px;
    border: 5px solid #000;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: row;
  }

 @media (max-width: 1100px) {
  
  .user-details {
    flex-direction: column;
    width: 50%; /* Stack items vertically */
  }
  .user-info{
    margin: 0%  0%  0% auto;
  }
}
@media (min-width: 1100px){
  .user-info{
    margin: 2% 3% auto 8%;
  }
}
  .user-info {
    font-size: 30px; /* Set the font size to 18px or any other desired size */
    text-align: left;
    
    width: 40%;
    display: flex;
    flex-direction: column;
  }
  .user-info p {
    margin: 6px 0;
    color: #000;
    text-align: right;
    font-family: Poppins;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: uppercase;
    word-wrap: break-word;
  }

  .info-button {
    margin: 50% 0 auto auto;
  }

  .user-details img {
    width: 300px;
    height: 300px;
    
    margin: auto;
    border: 5px solid #000000;
    border-radius: 50%;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  input,
  textarea {
    padding: 10px;
    border-radius: 5px;
    border: 2px solid #000;
    width: 100%;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .avatars {
 
  gap: 10px;
  margin: 16px 16px;
}

  .avatars img {
    margin: 5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #000;
    transition: border-color 0.3s ease;
  }

  .avatars img.active {
    border: 2px solid #000;
  }

  .avatar-preview  {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0 0 auto;
  }

  button {
    padding: 10px 20px;
    background-color: #b5fd1e;
    border: none;
    border-radius: 5px;
    color: #363636;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.5s ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #f723fb;
  }

  .form-group  p {
    color: red;
    font-size: 12px;
    margin-top: -10px;
    font-weight: 600;
    margin-bottom: 10px;
    text-transform:none;
    text-align: left;
  }
  img {
    object-fit: cover;
  }

  .icon2 {
    position: absolute;
    top: -9%;
    left: -6%;
    z-index: 1;
  }
</style>
