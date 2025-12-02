# VPS Check Commands

## Check .env.local file on VPS

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Navigate to frontend directory
cd /var/www/publisherauthority/frontend

# Check if .env.local exists
ls -la .env.local

# View .env.local contents
cat .env.local

# Or use nano/vim to edit
nano .env.local
```

## Check Frontend Status

```bash
# Check PM2 status
pm2 status

# Check frontend logs
pm2 logs publisherauthority-frontend

# Restart frontend
pm2 restart publisherauthority-frontend
```

## Check Backend Status

```bash
# Navigate to backend directory
cd /var/www/publisherauthority/backend

# Check backend .env file
cat .env

# Check PM2 status
pm2 status publisherauthority-backend

# Check backend logs
pm2 logs publisherauthority-backend
```

## Manual .env.local Update (if needed)

```bash
cd /var/www/publisherauthority/frontend

# Create/update .env.local
echo "NEXT_PUBLIC_API_URL=https://publisherauthority.com/api/v1" > .env.local

# Verify
cat .env.local

# Restart frontend
pm2 restart publisherauthority-frontend
```

