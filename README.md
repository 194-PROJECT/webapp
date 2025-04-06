# Item Scheduling - Webapp

This is a webapp for item scheduling for DGE. It is built using SvelteKit.

## Creating a project

Clone this repository and install the dependencies:

> Make sure to have Node.js installed on your machine. You can use a different package manager like `pnpm` or `yarn` if you prefer.

```bash
cd path-to-project/webapp

# install dependencies
npm install
```

#### Environment variables

Create a `.env` file with the following content:

> Make sure to replace the values with the actual values for your database

```
# For google oauth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# For API
PUBLIC_HTTP_PROTOCOL="http"
PUBLIC_API_URL="127.0.0.1"
PUBLIC_API_PORT="5000"

ENCRYPTION_KEY="gwbI7/iLikatYxm+cvYwfpC35dvdCUeSYJA0/sB7dxQ=" # THIS IS JUST A DUMMY VALUE
ALGORITHM="aes-256-cbc"
```

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
