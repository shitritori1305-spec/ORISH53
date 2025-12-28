FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY index.js ./
COPY db.js ./
COPY questionnaire.json ./
COPY answers.json ./ || true
RUN npm install --production
EXPOSE 3000
CMD ["node","index.js"]
