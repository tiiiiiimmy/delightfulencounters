<script>
  import { goto } from "$app/navigation";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { PUBLIC_IMAGES_URL } from "$env/static/public";

  // User registration and username check URLs
  const REG_URL = `${PUBLIC_API_BASE_URL}/users`;
  const CHECKUSERNAME_URL = `${PUBLIC_API_BASE_URL}/users/check-username`;

  let user = {
    username: "",
    password: "",
    passwordConfirm: "",
    fname: "",
    lname: "",
    birthDate: "",
    description: "",
    //default avatar
    avatar: "StockCake-AgileDogJumping.jpg",
    file: null
  };

  let errorMessage = "";
  let isExist = false;
  let avatarPreview = "";
  let filesToUpload;

  // Regex patterns for validation
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  function getTodayDate() {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }
  // Real-time validations
  $: usernameValid =
    user.username.length >= 5 && user.username.length <= 20 && !chineseRegex.test(user.username);
  $: usernameExistValid = isExist;
  $: passwordValid = user.password.length >= 5 && user.password.length <= 20;
  $: passwordConfirmValid = user.password === user.passwordConfirm;
  $: birthDateValid = birthDateRegex.test(user.birthDate) && user.birthDate <= getTodayDate();
  $: firstNameValid = user.fname.length >= 1 && user.fname.length <= 20;
  $: lastNameValid = user.lname.length >= 1 && user.fname.length <= 20;
  $: descriptionValid = user.description.length >= 1 && user.description.length <= 1000;
  $: allValid =
    usernameValid &&
    passwordValid &&
    passwordConfirmValid &&
    birthDateValid &&
    descriptionValid &&
    !usernameExistValid &&
    firstNameValid &&
    lastNameValid;

  async function handleRegister() {
    const formData = new FormData();
    if (filesToUpload && filesToUpload.length > 0) {
      formData.append("image-file", filesToUpload[0]);
    }
    formData.append("username", user.username);
    formData.append("password", user.password);
    formData.append("passwordConfirm", user.passwordConfirm);
    formData.append("fname", user.fname);
    formData.append("lname", user.lname);
    formData.append("date_of_birth", user.birthDate);
    formData.append("description", user.description);
    formData.append("avatar", user.avatar);
    formData.append("admin", 0);

    const resp = await fetch(REG_URL, {
      method: "POST",
      body: formData
    });

    if (resp.status === 409) {
      const result = await resp.json();
      errorMessage = result.message;
    } else if (resp.ok) {
      // No errors, clear user session and redirect to login page
      sessionStorage.setItem("user", "");
      goto("/login", { replaceState: true });
    } else {
      // Other errors
      const result = await resp.json();
      errorMessage = result.errors ? result.errors[0] : "An error occurred";
    }
  }

  async function checkUserName() {
    const resp1 = await fetch(CHECKUSERNAME_URL + "/" + user.username, {
      method: "GET"
    });
    const result = await resp1.json();
    isExist = result.message === "Username already exists";
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
      user.avatar = selectedAvatar || " ";
      allValid = true;
    };
  }

  function handleChange(e) {
    let image = e.target.files[0];
    let reader = new FileReader();
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (image.size > MAX_FILE_SIZE) {
      errorMessage = "File size must be less than 2MB.";
      avatarPreview = "";
      filesToUpload = null;
      allValid = false;
      e.target.value = ""; // Clear the selected file
      return;
    } else {
      allValid = true;
    }

    if (image) {
      reader.onload = (e) => {
        avatarPreview = e.target.result;
      };
      reader.readAsDataURL(image);
      filesToUpload = e.target.files;
    }
  }
</script>

<div class="container" style="background-image: url('{`${PUBLIC_IMAGES_URL}/loginbgunder.png`}');">
  <form on:submit|preventDefault={handleRegister} class="form">
    <h2>Signup</h2>

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
    {#if avatarPreview}
      <img class="avatar-preview" src={avatarPreview} alt="Avatar Preview" />
    {:else if user.avatar}
      <img
        class="avatar-preview"
        src={`${PUBLIC_IMAGES_URL}/${user.avatar}`}
        alt="Avatar Preview"
      />
    {/if}
    <div class="error-message" style="color: red;">{errorMessage}</div>
    <div class="upload">
      <label for="fileInput" class="fileLabel">
        <span style="color:black">Choose avatar or click to upload</span>
        <input type="file" id="fileInput" class="fileInput" on:change={handleChange} />
      </label>
    </div>
    <div class="avatars">
      {#each avatars as avatar}
        <img
          on:click={setAvatarPath(avatar)}
          src={`${PUBLIC_IMAGES_URL}/${avatar}`}
          class:active={selectedAvatar == avatar}
        />
      {/each}
    </div>

    <div class="form-group">
      <label for="username">Username:</label>
      <input
        on:input={checkUserName}
        id="input-username"
        type="text"
        placeholder="username"
        bind:value={user.username}
        required
        autocomplete="username"
      />
      {#if user.username.length > 0 && !usernameValid}
        <span>Usernames must be 5-20 characters long and cannot contain Chinese characters.</span>
      {/if}
      {#if user.username.length > 0 && usernameExistValid}
        <span>User already exists</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
        id="input-password"
        type="password"
        placeholder="password"
        bind:value={user.password}
        required
        autocomplete="password"
      />
      {#if user.password.length > 0 && !passwordValid}
        <span>The password must be between 5 and 20 characters.</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="password-confirm">Confirm Password:</label>
      <input
        id="input-password-confirm"
        type="password"
        placeholder="password-confirm"
        bind:value={user.passwordConfirm}
        required
        autocomplete="passwordConfirm"
      />
      {#if user.password.length > 0 && user.passwordConfirm.length > 0 && !passwordConfirmValid}
        <span>Passwords must match!</span>
      {/if}
    </div>

    <div class="form-group-row">
      <div class="form-group">
        <label for="fname">First name:</label>
        <input type="text" id="fname" bind:value={user.fname} required />
        {#if user.fname.length > 0 && !firstNameValid}
          <span>First name must be between 5 and 20 characters.</span>
        {/if}
      </div>

      <div class="form-group">
        <label for="lname">Last name:</label>
        <input type="text" id="lname" bind:value={user.lname} required />
        {#if user.lname.length > 0 && !lastNameValid}
          <span>First name must be between 5 and 20 characters.</span>
        {/if}
      </div>
    </div>

    <div class="form-group">
      <label for="birthDate">BirthDate:</label>
      <input type="date" bind:value={user.birthDate} required />
      {#if user.birthDate.length > 0 && !birthDateValid}
        <span>You cannot be born in the future!</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="description">Description:</label>
      <textarea id="description" bind:value={user.description} required></textarea>
      {#if user.description.length > 0 && !descriptionValid}
        <span>Description must be between 1 and 1000 characters.</span>
      {/if}
    </div>

    <button type="submit" disabled={!allValid} class:disabled={!allValid}>Submit</button>
  </form>
  <div class="image-container">
    <img src={`${PUBLIC_IMAGES_URL}/loginbg.png`} alt="loginbg" />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
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

  h2 {
    font-size: 30px;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
    color: #333;
  }

  .error-message {
    margin: 10px 0;
    color: red;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    width: 80%;
    max-width: 430px;
    background: white;
    padding: 40px;
    border-radius: 30px;
    border: 5px solid #000;
    text-align: center;
    position: relative;
  }
  .image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 60%;
    margin-left: 20px;
  }

  .image-container img {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .form-group-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 40px;
  }

  label {
    margin: 0;
    color: #555;
    font-size: 12px;
  }

  input,
  textarea {
    padding: 6px 0px 6px 10px;
    border-radius: 16px;
    border: 2px solid #000;
    background: rgba(240, 237, 255, 0.8);
    font-size: 14px;
    width: 100%;
    margin: 0px 0px 0px -8px;
  }

  textarea {
    resize: vertical;
    min-height: 40px;
  }

  .avatar-preview {
    position: absolute;
    top: 20px;
    right: -70px;
    width: 130px;
    height: 130px;
    margin: 0 auto 0;
    border: 5px solid #000000;
    border-radius: 50%;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }

  .avatars img {
    margin: 1px;
    width: 50px;
    height: 50px;
    border: 2px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }

  .avatars img.active {
    border: 2px solid;
  }

  .upload {
    display: flex;
    flex-direction: column;
  }

  .fileLabel {
    margin: 0 auto 0;
    display: inline-block;
    border-radius: 32px;
    border: #000 2px solid;
    background: #eaffbc;
    padding: 0px 20px;
    cursor: pointer;
    transition: background-color 0.5s ease;
  }

  .fileInput {
    display: none;
  }

  .selectedFile {
    margin-top: 5px;
    color: #777;
  }

  button {
    padding: 10px;
    background-color: #b5fd1e;
    border: none;
    border-radius: 32px;
    color: #363636;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.5s ease;
    border: 6px solid #000;
    width: 124px;
    margin: 20px auto 0;
  }

  button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:hover:not(.disabled) {
    background-color: #f723fb;
  }

  .fileLabel:hover {
    background-color: #f723fb;
  }

  span {
    color: rgb(255, 33, 33);
    padding: 5px;
    border-radius: 5px;
    display: block;
    text-align: left;
  }

  .login-icon2 {
    position: absolute;
    bottom: -50px;
    left: -50px;
  }
</style>
