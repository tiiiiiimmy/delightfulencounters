<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }
</script>

<div class="modal">
  <div class="modal-content">
    <slot></slot>
    <button on:click={closeModal}>Cancel</button>
  </div>
</div>

<style>
 
  /* .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  button {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  } */

   
  .modal {
   
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 400px;
    border-radius: 10px;
    text-align: center;
  }

  .modal button {
    margin-top: 10px;
    background-color: #f723fb;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.5s ease;
  }

  .modal button:hover {
    background-color: #b5fd1e;
  }
</style>
