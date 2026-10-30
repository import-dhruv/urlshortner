# URL Shortener

A small URL-shortening API built with Node.js, Express, and MongoDB. It accepts a
full URL, assigns it a short code, stores the mapping, and redirects requests for
that code to the original address.

## What the repository contains

This project currently provides a backend API; it does not include a finished
web interface. `index.html` is empty.

The request flow is:

1. `server.js` loads environment variables, configures Express and CORS, connects
   to MongoDB, and mounts the URL routes.
2. `routes/urlRoutes.js` maps HTTP requests to the URL controller.
3. `controllers/useControllers.js` validates and shortens URLs, looks up
   existing mappings, redirects visitors, and contains the URL-listing handler.
4. `models/urlSchema.js` defines the MongoDB document for each mapping.
5. `db/db.js` manages the MongoDB connection and shutdown handling.

## Requirements

- Node.js and npm
- A MongoDB database and its connection URI

## Run locally

1. Install the dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set the values for your environment:

   ```dotenv
   MONGO_URL=mongodb://127.0.0.1:27017/urlshortener
   PORT=8080
   BASE_URL=http://localhost:8080
   ```

   `MONGO_URL` must be a MongoDB connection URI. `BASE_URL` is the public origin
   used when constructing short links; leave off the trailing slash.

3. Start the server:

   ```sh
   npm run dev
   ```

   The server listens on `PORT`. MongoDB must be reachable for the API to work.

## API

### Create or retrieve a short URL

`POST /shorten`

Send a JSON body containing an absolute URL with an `http://` or `https://`
scheme:

```json
{
  "originalUrl": "https://example.com/a/long/path"
}
```

Example:

```sh
curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d "{\"originalUrl\":\"https://example.com/a/long/path\"}"
```

On success, the response contains the short link:

```json
{
  "shortUrl": "http://localhost:8080/AbCd1234"
}
```

The code is generated with eight characters. Submitting the same original URL
again returns its existing short link rather than creating another mapping.
Missing or invalid URLs return HTTP 400. A database or server error returns
HTTP 500.

### Follow a short link

`GET /:shortUrl`

For example, opening `http://localhost:8080/AbCd1234` looks up the code, adds
one to its click count, and redirects to the original URL. An unknown code
returns HTTP 404.

### List saved URLs

A listing handler is present in the controller, but this feature is not
currently functional: its route is registered as `urls` rather than the
conventional `/urls`, and the handler queries an undefined model name (`UR`).
Treat URL listing as unavailable until those implementation issues are fixed.

## Stored URL data

Each MongoDB URL document contains:

| Field | Meaning |
| --- | --- |
| `originalUrl` | The destination URL supplied by the caller |
| `shortUrl` | The generated short code; indexed and unique |
| `clicks` | Number of redirects recorded for this code; starts at `0` |
| `createdAt` | Creation time, configured with a 30-day MongoDB TTL expiration |

MongoDB's TTL cleanup runs asynchronously, so expiration is not an exact
30-day deletion deadline.

## Development notes

- The project uses CommonJS modules.
- `npm run dev` runs `node server.js`; it does not currently start a file watcher.
- The `npm test` script is a placeholder and exits with an error because no
  automated tests have been configured.
- The API enables CORS and parses JSON request bodies.