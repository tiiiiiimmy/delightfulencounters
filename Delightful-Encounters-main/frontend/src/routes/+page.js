import { PUBLIC_API_BASE_URL } from "$env/static/public";

const ARTICLES_URL = `${PUBLIC_API_BASE_URL}/articles`;

export async function load({ fetch }) {
    try {
        const response = await fetch(ARTICLES_URL);
        if (!response.ok) {
            console.error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
            return { articles: [] };
        }
        const articles = await response.json();
        return { articles };
    } catch (error) {
        console.error('Error loading articles:', error);
        return { articles: [] };
    }
}