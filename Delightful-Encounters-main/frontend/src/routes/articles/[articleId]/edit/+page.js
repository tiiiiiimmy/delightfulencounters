import { PUBLIC_API_BASE_URL } from "$env/static/public";
const ARTICLES_URL = `${PUBLIC_API_BASE_URL}/articles`;

export async function load({ fetch, params, parent }) {
    const articleResponse = await fetch(`${ARTICLES_URL}/get-content/${params.articleId}`);
    const currentArticle = await articleResponse.json();
    
    const { isLoggedIn } = await parent();


//     console.log("currentArticle");
// console.log(currentArticle);
    return {currentArticle, isLoggedIn};;
}
