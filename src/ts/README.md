# Next.js Docker Setup

This guide will help you set up a Next.js application in a Docker container.

## Prerequisites
- Ensure [Docker](https://docs.docker.com/get-docker/) is installed on your machine.

## Setup Instructions

1. **Build the Docker Container**

   ```bash
   docker build -t face-2-simpson-ts .
   ```

2. **Run the Docker Container**

   ```bash
   docker-compose up
   ```

After executing the above steps, your Next.js application should be running on `http://localhost:3000`.

If you encounter any issues or need further assistance, feel free to raise an issue or reach out to the maintainers.
