# CineNest

CineNest combines the movie browser with the login, registration, password reset, and session API from the Login-Form project. The movie app is available at `/dashboard` after signing in.

## Setup

1. Install Node.js 20.9 or later and PostgreSQL.
2. Copy `.env.example` to `.env` and fill in the database URL, a private JWT secret, and a TMDB API key. Add Resend credentials to enable password reset emails.
3. Install dependencies with `npm install`.
4. Generate the Prisma client and apply the included migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Start CineNest with `npm run dev`, then open [http://localhost:3000](http://localhost:3000).

New visitors can create an account from the login screen. Signing in or registering takes them to the protected movie browser. Sign out returns to the login screen.

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string for user accounts and password reset tokens.
- `JWT_SECRET`: private signing key used for the HttpOnly session cookie.
- `NEXT_PUBLIC_TMDB_API_KEY`: TMDB API key used by the movie browser.
- `NEXT_PUBLIC_APP_URL`: public CineNest URL used in password reset links.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL`: email delivery settings for password resets.
