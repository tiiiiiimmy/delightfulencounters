<script>
    import ArticleView from "$lib/components/ArticleView.svelte";
    export let data;
  
    const article = data.currentArticle;
  
    const likesCount = data.likesCount; 

    const isLoggedIn= data.isLoggedIn;

    const userId =data.userId;


  </script>
  
  <ArticleView {article}  {likesCount} {isLoggedIn} userId={userId}/>