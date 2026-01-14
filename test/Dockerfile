FROM node:22-slim

# Allow building amd64 image on arm64 mac
# DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build --tag 'fraud-cri-test-image' -f test/Dockerfile .

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    libglib2.0-0 \
    libnss3 \
    libglu1 \
    libxcb1 \
    fonts-liberation \
    dbus-x11 \
    libxss1 \
    lsb-release \
    xdg-utils \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws/

# Set working directory
WORKDIR /home/node

# Copy project files
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Copy run script and make it executable
COPY test/run-tests.sh /run-tests.sh
RUN chmod +x /run-tests.sh

ENTRYPOINT ["/run-tests.sh"]
