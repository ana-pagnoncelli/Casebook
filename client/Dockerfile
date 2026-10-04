FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

EXPOSE 8081

ENV EXPO_NO_TELEMETRY=1
ENV BROWSER=none

CMD ["npx", "expo", "start", "--web", "--host", "lan", "--port", "8081"]
