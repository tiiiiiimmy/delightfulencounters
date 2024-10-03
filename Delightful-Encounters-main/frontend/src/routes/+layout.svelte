<script>
  import "$lib/css/app.css";
  import Navbar from "$lib/components/Navbar.svelte";

  export let data;
</script>

<Navbar userId={data.userId} isLoggedIn={data.isLoggedIn} />
<slot />