# Contacts Auth API

Node.js, Express and MongoDB contacts CRUD API with authentication.

## Scripts

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your MongoDB Atlas values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

Or use separate MongoDB Atlas values:

```env
PORT=3000
MONGODB_USER=your_user
MONGODB_PASSWORD=your_password
MONGODB_URL=your_cluster.mongodb.net
MONGODB_DB=your_database
```

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/send-reset-email`
- `POST /auth/reset-pwd`
- `GET /contacts`
- `GET /contacts/:contactId`
- `POST /contacts`
- `PATCH /contacts/:contactId`
- `DELETE /contacts/:contactId`

Contact routes require an `Authorization: Bearer <accessToken>` header.
