FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install
RUN mkdir -p test-results
EXPOSE 9323
CMD ["npm", "test"] 