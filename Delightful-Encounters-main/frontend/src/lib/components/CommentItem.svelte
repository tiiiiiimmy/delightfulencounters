<script>
  import { createEventDispatcher } from "svelte";
  import { PUBLIC_API_BASE_URL, PUBLIC_IMAGES_URL } from "$env/static/public";
  import { onMount } from "svelte";
  export let comment;
  export let articleId;
  export let currentUserId;
  let newReplyContent = "";
  let showReplyBox = false;
  let errorMessage;
  let replyError = "";

  const USER_URL = `${PUBLIC_API_BASE_URL}/users`;

  const dispatch = createEventDispatcher();

  function handleInputChange(event) {
    newReplyContent = event.target.value;
    
    if (newReplyContent.length >= 200) {
      replyError = 'Comment cannot exceed 200 characters!';
    } else {
      replyError = '';
    }
  }

  function handleReplySubmit() {
    if (newReplyContent.trim() === "") {
      replyError = "Comment cannot be empty!";
      return;
    }

    dispatch("submitReply", {
      commentId: comment.comment_id,
      replyContent: newReplyContent
    });

    newReplyContent = "";
    replyError = "";
    showReplyBox = false;
  }

  function handleDelete() {
    dispatch("deleteComment", {
      commentId: comment.comment_id
    });
  }

  let avatarPath = null;; 

  async function fetchAvatar() {
    const response = await fetch(`${USER_URL}/get-user/${comment.comment_user_id}`);
    if (response.status === 200) {
      const result = await response.json();
      avatarPath = PUBLIC_IMAGES_URL + "/" + result.avatar;
    } else if (response.status === 404) {
      const errorData = await response.json();
      errorMessage = errorData.message;
    } else {
      const errorData = await response.json();
      errorMessage = errorData.errors ? errorData.errors[0] : "An error occurred";
    }
  }

  onMount(() => {
    fetchAvatar();
  });
</script>

<div class="comment">
  <div class="comment-content">
    <div class="user-info-container">
      <div class="avatar-actions-container">
        <div class="avatar-user-date">
          <img src={avatarPath} alt="avatar" class="user-avatar" />
          <p class="username-date">
            {comment.comment_username}
            <span class="date">{new Date(comment.comment_date).toLocaleString()}:</span>
          </p>
        </div>
        <div class="actions-container">
          {#if currentUserId && currentUserId === comment.comment_user_id}
            <button class="delete-button" on:click={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3.47807 11.0016L3.47765 10.9362C3.47765 10.9585 3.47782 10.9802 3.47807 11.0016ZM8.39711 3.54133C8.09473 3.54133 7.84959 3.78621 7.84959 4.08885L7.85467 10.9543C7.85467 11.2564 8.09981 11.5019 8.40219 11.5019C8.70457 11.5019 8.94972 11.2564 8.94972 10.9543L8.94492 4.08885C8.94492 3.78622 8.69977 3.54133 8.39711 3.54133ZM12.2122 1.91533L7.85231 1.91736L7.84987 1.35124C7.84987 1.0486 7.60469 0.803711 7.30207 0.803711C7.20235 0.803711 7.10893 0.830489 7.02839 0.877049C6.9478 0.830489 6.85435 0.803711 6.75453 0.803711C6.45216 0.803711 6.20701 1.0486 6.20701 1.35124L6.20958 1.91813L3.06346 1.91958C3.01932 1.90811 2.97304 1.90198 2.92532 1.90198C2.87743 1.90198 2.831 1.90816 2.78673 1.91971L1.78777 1.92017C1.4854 1.92017 1.24023 2.16559 1.24023 2.46769C1.24023 2.77033 1.48539 3.01522 1.78777 3.01522L2.37807 3.01494L2.38207 11.4628H2.38288V12.0446C2.38288 12.6493 2.87319 13.1396 3.47793 13.1396H4.02547V13.1438L10.0482 13.1403V13.1396H10.5958C11.1927 13.1396 11.6779 12.6618 11.6903 12.0678L11.6858 4.09207C11.6858 3.78944 11.4406 3.54455 11.1382 3.54455C10.8359 3.54455 10.5907 3.78944 10.5907 4.09207L10.5946 11.0555C10.5754 11.8801 10.3404 12.0312 9.50098 12.0312L10.0694 12.0452L3.85632 12.0488L4.5727 12.0312C3.71527 12.0312 3.48845 11.8737 3.47807 11.0016L3.48482 12.049H3.47739L3.47311 3.01441L6.71092 3.01291C6.72696 3.01432 6.74319 3.01519 6.7596 3.01519C6.77623 3.01519 6.79264 3.01432 6.80888 3.01287L7.25512 3.01266C7.27226 3.01428 7.28959 3.01519 7.30715 3.01519C7.32492 3.01519 7.34246 3.01427 7.35981 3.01262L12.2121 3.01038C12.5145 3.01038 12.7597 2.76549 12.7597 2.46286C12.7597 2.16022 12.5145 1.91533 12.2122 1.91533ZM10.5947 11.1464L10.5952 12.0449H10.5889L10.5947 11.1464ZM5.65949 3.54133C5.35711 3.54133 5.11196 3.78621 5.11196 4.08885L5.11703 10.9543C5.11703 11.2564 5.36219 11.5019 5.66458 11.5019C5.96694 11.5019 6.2121 11.2564 6.2121 10.9543L6.20702 4.08885C6.20701 3.78622 5.96185 3.54133 5.65949 3.54133Z"
                  fill="#363636"
                />
              </svg>
            </button>
          {/if}
          {#if currentUserId}
            <button class="reply-button" on:click={() => (showReplyBox = !showReplyBox)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M10.0723 7.40039C9.66621 7.40039 9.35156 7.71504 9.35156 8.10352C9.35156 8.49199 9.66621 8.80664 10.0723 8.80664C10.4432 8.80664 10.7578 8.49199 10.7578 8.10352C10.7578 7.71504 10.4432 7.40039 10.0723 7.40039ZM5.15039 7.40039C4.74434 7.40039 4.42969 7.71504 4.42969 8.10352C4.42969 8.49199 4.74434 8.80664 5.15039 8.80664C5.52129 8.80664 5.83594 8.49199 5.83594 8.10352C5.83594 7.71504 5.52129 7.40039 5.15039 7.40039Z"
                  fill="#BD57FF"
                />
                <path
                  d="M15.7146 6.06426C14.8691 4.90411 13.6879 4.12891 12.3923 3.77911V3.78086C12.0918 3.44688 11.7525 3.13926 11.3728 2.86504C8.49527 0.773247 4.45582 1.41133 2.35523 4.28887C0.662461 6.62676 0.734531 9.77149 2.4607 12.0057L2.47477 14.3365C2.47477 14.3928 2.48355 14.449 2.50113 14.5018C2.5943 14.7988 2.9107 14.9623 3.20602 14.8691L5.43141 14.1678C6.02027 14.377 6.62848 14.4965 7.23316 14.5299L7.22437 14.5369C8.79059 15.6777 10.8437 16.0205 12.7263 15.3982L14.9605 16.126C15.0168 16.1436 15.0748 16.1541 15.1345 16.1541C15.4457 16.1541 15.697 15.9027 15.697 15.5916V13.2361C17.2457 11.1338 17.2861 8.22813 15.7146 6.06426ZM5.6775 12.9197L5.46656 12.8318L3.72633 13.3768L3.70875 11.5486L3.56812 11.3904C2.08102 9.57637 1.98258 6.96251 3.37477 5.04473C5.0693 2.7209 8.31773 2.20762 10.6345 3.88458C12.9584 5.57383 13.4734 8.817 11.7947 11.1268C10.3867 13.0586 7.86598 13.7723 5.6775 12.9197ZM14.5545 12.6209L14.4138 12.7967L14.4314 14.6248L12.7087 14.0447L12.4978 14.1326C11.5134 14.4982 10.464 14.5281 9.49195 14.2557L9.48844 14.2539C10.7875 13.8549 11.9652 13.0463 12.8142 11.8826C14.1572 10.0316 14.3752 7.70606 13.5947 5.72325L13.6052 5.73028C14.0095 6.02032 14.3804 6.38243 14.6951 6.82012C15.9712 8.5709 15.8992 10.9545 14.5545 12.6209Z"
                  fill="#BD57FF"
                />
                <path
                  d="M7.61133 7.40039C7.20527 7.40039 6.89062 7.71504 6.89062 8.10352C6.89062 8.49199 7.20527 8.80664 7.61133 8.80664C7.98223 8.80664 8.29688 8.49199 8.29688 8.10352C8.29688 7.71504 7.98223 7.40039 7.61133 7.40039Z"
                  fill="#BD57FF"
                />
              </svg>Reply</button
            >
          {/if}
        </div>
      </div>
      <p class="content-text">{comment.content}</p>
    </div>
  </div>

  {#if errorMessage}
    <p class="errormessage">{errorMessage}</p>
  {/if}

  {#if showReplyBox}
  <div class="reply-box">
    <textarea bind:value={newReplyContent} on:input={handleInputChange} maxlength="200" placeholder="write here..." rows="3"></textarea>
    <button class="submit-button" on:click={handleReplySubmit}>Submit Reply</button>
    {#if replyError}
      <span style="color: red;">{replyError}</span>
    {/if}
  </div>
{/if}

  {#if comment.replies && comment.replies.length > 0}
    <ul>
      {#each comment.replies as reply}
        <li>
          <svelte:self
            comment={reply}
            {articleId}
            {currentUserId}
            on:deleteComment
            on:submitReply
          />
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .comment {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  .comment-content {
    display: flex;
    align-items: center;
    border-left: 1.5px solid #800080;
    padding: 0px 10px;
  }

  .avatar-actions-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .user-info-container {
    flex-grow: 1;
    padding: 0px 5px;
    line-height: 1.2;
    max-width: 100%;
    display: flex;
    flex-direction: column;
  }

  .actions-container {
    display: flex;
    margin-left: 20px;
  }

  .delete-button {
    background-color: #fff4e7;
    color: black;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .delete-button:hover {
    background-color: #ffced5;
  }

  .reply-button svg {
    vertical-align: middle;
    margin-right: 2px;
  }

  .reply-button {
    background: #f6f5ff;
    color: black;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .reply-button:hover {
    background-color: #c4c4c4;
  }

  .submit-button {
    background-color: rgb(211, 255, 198);
    color: black;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    margin-left: 10px;
  }

  .submit-button:hover {
    background-color: #7cd47c;
  }

  textarea {
    width: 90%;
    padding: 10px;
    background-color: #ffffff;
    border: 2px solid #800080;
    border-radius: 8px;
    color: #333;
    font-size: 16px;
    font-family: Arial, sans-serif;
    margin-top: 20px;
    margin-bottom: 10px;

  }

  ul {
    list-style-type: none;
    padding-left: 10px;
  }

  .avatar-user-date {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .username-date {
    font-family: "Source Han Sans SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    display: inline-block;
  }

  .date {
    color: #cacaca;
    font-family: "Source Han Sans SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-left: 8px;
  }

  .content-text {
    color: var(--carbon-800, #363636);
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    margin-top: 0px;
    margin-bottom: 0px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .errormessage {
    color: red;
  }
</style>


