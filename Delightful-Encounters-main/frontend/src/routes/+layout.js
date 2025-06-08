import { PUBLIC_API_BASE_URL } from "$env/static/public";
const USER_URL = `${PUBLIC_API_BASE_URL}/users`;


export async function load({ fetch }) {
  try {
    const response = await fetch(USER_URL, { credentials: "include" });
    if (response.status === 401) return { isLoggedIn: false };
    
    if (!response.ok) {
      console.error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      return { isLoggedIn: false };
    }

    const userId = await response.json();
    console.log("routes/+layout.js", userId);
    const isLoggedIn = !!userId;

    console.log("routes/+layout.js", userId, isLoggedIn);

    return { userId: userId, isLoggedIn };
  } catch (error) {
    console.error('Error loading user data:', error);
    return { isLoggedIn: false };
  }
}
