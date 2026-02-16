FROM registry.redhat.io/ubi10/ubi:10.1

LABEL maintainer="rakeshk.6842@gmail.com" \
      description="RHEL 10 UBI 10.1 Development Container with JDK 21, Node.js 22, Python, and Database Tools"

# Update system packages and install JDK 21
RUN yum update -y && \
    yum install -y --allowerasing \
    java-21-openjdk \
    java-21-openjdk-devel \
    java-21-openjdk-headless \
    git \
    curl \
    wget \
    nano \
    vim \
    git-lfs \
    gcc \
    g++ \
    make \
    cmake \
    python3 \
    python3-pip \
    python3-devel \
    postgresql-devel \
    sqlite-devel \
    libffi-devel \
    openssl-devel \
    && yum clean all

# Install Redis and Redis Tools from source (redis-server not in UBI9)
RUN curl -fsSL https://download.redis.io/redis-stable.tar.gz | tar -xz && \
    cd redis-stable && \
    make && \
    make install && \
    cd .. && \
    rm -rf redis-stable && \
    mkdir -p /var/lib/redis && \
    useradd -r -s /bin/false redis || true

# Install latest Node.js (v22) using NodeSource repo
RUN curl -sL https://rpm.nodesource.com/setup_22.x | bash - && \
    yum remove -y nodejs npm 2>/dev/null || true && \
    yum install -y nodejs && \
    npm install -g yarn pnpm

# Install Python development tools
RUN pip3 install --upgrade pip setuptools wheel && \
    pip3 install \
    Flask \
    Flask-SocketIO \
    python-socketio \
    python-engineio \
    SQLAlchemy \
    psycopg2-binary \
    redis \
    requests \
    python-dotenv \
    gunicorn

# Create non-root user
RUN mkdir -p /etc/sudoers.d && \
    useradd -m -s /bin/bash -G wheel vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode && \
    chmod 440 /etc/sudoers.d/vscode

# Set working directory
WORKDIR /workspace

# Copy application files
COPY --chown=vscode:vscode . /workspace

# Set proper permissions
RUN chown -R vscode:vscode /workspace

USER vscode

# Expose ports
EXPOSE 3000 5000 8000 8080 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["/bin/bash"]
