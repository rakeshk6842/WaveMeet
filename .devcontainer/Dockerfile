FROM registry.access.redhat.com/ubi9/ubi:latest

LABEL maintainer="dev@example.com" \
      description="RHEL 10 Development Container with Node.js, Python, and Database Tools"

# Update system packages
RUN yum update -y && \
    yum install -y \
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
    nodejs \
    npm \
    postgresql-devel \
    sqlite-devel \
    libffi-devel \
    openssl-devel \
    redis \
    supervisor \
    && yum clean all

# Install Node.js LTS
RUN npm install -g npm@latest yarn pnpm

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
RUN useradd -m -s /bin/bash -G wheel vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/vscode

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
