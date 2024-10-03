package ictgradschool.randompokemon.swingclient.web;

import ictgradschool.randompokemon.swingclient.pojos.User;
import ictgradschool.randompokemon.swingclient.util.JSONUtils;

import java.io.IOException;
import java.net.CookieManager;
import java.net.HttpCookie;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class API {
    private static API instance;

    private static final String BASE_URL = "http://localhost:3000/api";

    public static API getInstance() {
        if (instance == null) {
            instance = new API();
        }
        return instance;
    }

    private final CookieManager cookieManager;
    private final HttpClient client;

    private API() {
        this.cookieManager = new CookieManager();

        this.client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NEVER)
                .connectTimeout(Duration.ofSeconds(10))
                .cookieHandler(this.cookieManager)
                .build();
    }
    public boolean login(String username, String password) throws IOException, InterruptedException {
        String url = BASE_URL + "/auth/login";

        String json = String.format("{\"username\":\"%s\", \"password\":\"%s\"}", username, password);

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .setHeader("Content-Type", "application/json")
                .setHeader("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json));

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            // Extract the authToken from the cookies
            HttpHeaders headers = response.headers();
            //没见过的代码
            Optional<String> authToken = headers.firstValue("Set-Cookie")
                    .map(cookie -> HttpCookie.parse(cookie).stream()
                            .filter(c -> "authToken".equals(c.getName()))
                            .findFirst()
                            .map(HttpCookie::getValue)
                            .orElse(null));

            if (authToken.isPresent()) {
                System.out.println("Login successful. Auth token: " + authToken.get());
                return true;
            } else {
                System.out.println("Login failed: auth token not found.");
                return false;
            }
        } else {
            System.out.println("Login failed. HTTP status code: " + response.statusCode());
            return false;
        }
    }

    public boolean logout() throws IOException, InterruptedException {
        String url = BASE_URL + "/auth/logout";

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .setHeader("Accept", "application/json")
                .method("DELETE", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 204) {
            System.out.println("Logout successful.");
            return true;
        } else {
            System.out.println("Logout failed. HTTP status code: " + response.statusCode());
            return false;
        }
    }

    public List<User> getAllUsers() throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/admin/get-userslist"))
                .setHeader("Accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        String json = response.body();

        // Assuming you have a method JSONUtils.toObject that converts JSON array to List<User>
        User[] usersArray = JSONUtils.toObject(json, User[].class);
        return Arrays.asList(usersArray);
    }
    public boolean deleteUser(int userId) throws IOException, InterruptedException {
        String url = BASE_URL + "/admin/" + userId;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .setHeader("Accept", "application/json")
                .method("DELETE", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            System.out.println("User deleted successfully.");
            return true;
        } else if (response.statusCode() == 404) {
            System.out.println("User not found.");
            return false;
        } else if (response.statusCode() == 403) {
            System.out.println("Forbidden: You don't have permission to delete this user.");
            return false;
        } else {
            System.out.println("Failed to delete user. HTTP status code: " + response.statusCode());
            return false;
        }
    }

    public User getUserInfo(int userId) throws IOException, InterruptedException {
        String url = BASE_URL + "/users/get-user/" + userId;


        // Build the GET request
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .setHeader("Accept", "application/json")
                .GET();

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            String responseBody = response.body();
            return JSONUtils.toObject(responseBody, User.class);
        } else if (response.statusCode() == 404) {
            System.out.println("User not found.");
        } else {
            System.out.println("Failed to get user info. HTTP status code: " + response.statusCode());
        }

        return null;
    }
    public int getArticlesCount(int id) throws Exception {
        String urlString = BASE_URL + "/admin/get-articles-count/" + id ;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(urlString))
                .setHeader("Accept", "application/json")
                .GET();

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            String responseBody = response.body();
            return JSONUtils.toInt(responseBody); // Parse the response body to int
        } else if (response.statusCode() == 404) {
            System.out.println("User not found.");
        } else {
            System.out.println("Failed to get articles count. HTTP status code: " + response.statusCode());
        }

        return -1;
    }


}
