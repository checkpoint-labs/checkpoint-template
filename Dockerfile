# Base image to use
FROM ubuntu:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV DATABASE_URL=mysql://root:default_password@localhost:3306/checkpoint

# Refresh the package list and install required packages in a single run statement to reduce image size
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    mysql-server \
    mysql-client \
    apt-transport-https \
    ca-certificates \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Adding nodesource GPG key, repository, and install nodejs
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor > /usr/share/keyrings/nodesource.gpg \
    && echo 'deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x jammy main' > /etc/apt/sources.list.d/nodesource.list \
    && echo 'deb-src [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x jammy main' >> /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Add Docker's GPG key, repository, and install Docker and Docker-compose
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce docker-ce-cli containerd.io \
    && curl -fsSL https://github.com/docker/compose/releases/latest/download/docker-compose-Linux-x86_64 -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    && rm -rf /var/lib/apt/lists/*

# Add Yarn's GPG key, repository, and install yarn
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor > /usr/share/keyrings/yarnkey.gpg \
    && echo 'deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main' > /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn \
    && rm -rf /var/lib/apt/lists/*

# Start MySQL service
RUN service mysql start

# Copy all files and directories from the local build directory into the root directory of the Docker image.
COPY ./ /

# Expose port 3000 on the Docker container, allowing this port to be mapped to the host when the container is run.
EXPOSE 3000

# Define the entry point for the Docker container. It states that the container will run a command using /bin/bash as shell.
ENTRYPOINT ["/bin/bash", "-c"]

# Command to use when running the docker
CMD ["yarn && yarn dev"]
