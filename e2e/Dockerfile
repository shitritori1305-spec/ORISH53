FROM mcr.microsoft.com/playwright:v1.43.0-focal
WORKDIR /workspace
COPY . /workspace
WORKDIR /workspace/e2e
RUN npm ci --no-audit --no-fund
CMD ["npx","playwright","test","--reporter=dot"]
