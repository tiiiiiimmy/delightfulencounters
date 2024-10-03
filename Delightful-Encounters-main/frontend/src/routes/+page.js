import { PUBLIC_API_BASE_URL } from "$env/static/public";

const ARTICLES_URL = `${PUBLIC_API_BASE_URL}/articles`;

export async function load({ fetch }) {
    const response = await fetch(ARTICLES_URL);
    const articles = await response.json();
    return { articles};
}