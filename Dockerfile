FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client first
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 4000

# Always ensure client is generated again at runtime (safety net)
CMD ["sh", "-c", "npx prisma generate && node dist/server.js"]
