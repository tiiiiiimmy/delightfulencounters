import {PUBLIC_API_BASE_URL} from "$env/static/public";
const ARTICLES_URL = `${PUBLIC_API_BASE_URL}/articles`;



export async function load({ fetch, params }) {
  
    const articleResponse = await fetch(`${ARTICLES_URL}/get-content/${params.articleId}`);
    const currentArticle = await articleResponse.json();
  
    const likesResponse = await fetch(`${ARTICLES_URL}/${params.articleId}/like`);
    const likesCount = await likesResponse.json();
    
    return {currentArticle, likesCount};
    
  }

  
 
 