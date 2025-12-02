# Development Guide

## Quick Start

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/publisherauthority
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Troubleshooting

### "Failed to fetch" Error

This error means the frontend cannot connect to the backend. Check:

1. **Backend is running**: Open `http://localhost:5000/api/v1/health` in browser
2. **Correct port**: Backend should be on port 5000 (default)
3. **CORS**: Backend CORS_ORIGIN should include `http://localhost:3000`
4. **MongoDB**: Make sure MongoDB is running if using local database

### Check Backend Health

```bash
curl http://localhost:5000/api/v1/health
```

Should return:
```json
{
  "success": true,
  "message": "API is healthy"
}
```

## Common Issues

1. **Port already in use**: Change PORT in backend/.env
2. **MongoDB connection error**: Start MongoDB service
3. **CORS errors**: Update CORS_ORIGIN in backend/.env

