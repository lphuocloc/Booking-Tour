# Tour Booking App (MVC)

Express + EJS + MongoDB following MVC pattern (controllers separated).

## Setup

```bash
cp .env.sample .env
npm install
npm run seed
npm run dev
```

Default admin: **admin / 123456**

## Structure

```
controllers/
models/
routes/
views/
```

Routes delegate to controllers, controllers handle logic & DB.

MIT
