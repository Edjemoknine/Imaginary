# Eido AI

Eido AI is a web-based image library and editor built with Next.js. Browse and
organize images stored in Cloudinary, mark favorites, and edit images with
Cloudinary transformations. Clerk handles authentication and plan-based access
to AI editing tools.

## Features

- **Image studio:** Upload or select an image, preview edits, then download the
  result or save it to Cloudinary.
- **Basic editing:** Crop and fit images, adjust color and brightness, rotate,
  blur, sharpen, and apply other effects.
- **AI editing:** Access generative fill and replacement, background and object
  removal, enhancement, smart cropping, auto-tagging, and more with an eligible
  Clerk plan.
- **Image library:** Browse and search Cloudinary images by tag.
- **Albums and favorites:** Organize images into Cloudinary folders and mark
  favorites with a Cloudinary tag.
- **Authentication and plans:** Clerk protects the library and studio and
  controls access to plan-gated features.

## Tech stack

- Next.js 15 with the App Router and React 18
- TypeScript and Tailwind CSS
- Clerk for authentication and billing plans
- Cloudinary for image uploads, storage, search, and transformations

## Prerequisites

- Node.js **24.x** (see the `engines` field in `package.json`)
- npm
- A Clerk application
- A Cloudinary account

## Getting started

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Edjemoknine/Imaginary.git
   cd imaginary
   npm install
   ```

2. Create a `.env.local` file in the project root and add the configuration
   described below.

3. In Cloudinary, create an **unsigned upload preset** named `uploads`. The
   upload control uses this preset.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Set the following values in `.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key for your Clerk application |
| `CLERK_SECRET_KEY` | Secret key for your Clerk application |
| `CLERK_DEMO_USER_ID` | Clerk user ID of the dedicated account used by the sign-in page demo button |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name used by client-side uploads and image delivery |
| `CLOUDINARY_URL` | Cloudinary server credentials, in the form `cloudinary://<api_key>:<api_secret>@<cloud_name>` |

Keep secret keys private. Do not commit `.env.local` or share the value of
`CLOUDINARY_URL`.

The sign-in page's **Try the demo** button creates a short-lived Clerk sign-in
token for `CLERK_DEMO_USER_ID`; it does not expose or use that account's
password. Use a dedicated demo account with non-sensitive sample content. Demo
sessions share that account and its access to configured Cloudinary resources.

To enable AI editing tools, configure the `pro` and/or `enterprise` plans in
Clerk. The studio checks the signed-in user's plan before enabling these tools.
Some transformations and auto-tagging capabilities may also depend on your
Cloudinary account and plan.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run the Next.js lint command |

## Application areas

| Route | Description |
| --- | --- |
| `/` | Public landing page; signed-in users are redirected to the studio |
| `/studio` | Image editor |
| `/gallery` | Search and browse images |
| `/album` | Browse albums |
| `/album/[albumName]` | View images in an album |
| `/favorite` | View favorite images |
| `/pricing` | Clerk pricing table |
| `/profile` | Clerk user profile |
| `/sign-in` and `/sign-up` | Clerk authentication pages |

## Project structure

```text
app/          App Router pages, layouts, and global styles
actions/      Server actions for Cloudinary operations and image editing
components/   Shared UI, navigation, gallery, and studio components
helpers/      Cloudinary utilities, feature catalog, and studio tools
hooks/        Client-side gallery and studio state
public/       Static assets and branding
types/        Shared TypeScript types
```

## Deployment

Deploy as a Next.js application on a platform that supports Node.js 24. Configure
the same Clerk and Cloudinary environment variables in the deployment
environment, and ensure the Cloudinary `uploads` unsigned preset is available
for the configured cloud. Build with `npm run build` and start with
`npm run start`, or use your hosting provider's standard Next.js deployment
workflow.
