FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
COPY server/index.js ./
COPY server/db.js ./
COPY server/questionnaire.json ./
COPY server/answers.json ./
# Copy frontend static site into container root so server can serve /web
COPY web /web
RUN npm install --production
EXPOSE 3000
CMD ["node","index.js"]
