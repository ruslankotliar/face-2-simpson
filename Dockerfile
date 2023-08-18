# STAGE 1: A container with pnpm and python3 is required
FROM node:18-alpine as pnpm_base

WORKDIR /app
# install pnpm
RUN npm i --global --no-update-notifier --no-fund pnpm@7
# install python3 and other deps
RUN apk add --no-cache g++ make py3-pip libc6-compat

# STAGE 2: fetch deps into the pnpm store
# We run pnpm fetch in a separate step to avoid re-fetching deps on every code change
# fetch is a pnpm command that downloads all dependencies to the local store
# You could remove or skip this step if using npm or yarn (but make sure to copy your lock file)
FROM pnpm_base as fetched_deps
WORKDIR /app
# setting production env usually speeds up install for your package manager
ENV NODE_ENV production
# copy the lock file that you use
COPY pnpm-lock.yaml ./
# set the store dir to a folder that is not in the project
RUN pnpm config set store-dir /workdir/.pnpm-store
RUN pnpm fetch

# STAGE 3: Copy the application code and install all deps from cache into the application
FROM fetched_deps as with_all_deps
# I use mono repo so I copy the whole project code (except for ignored things)
COPY . ./
# finally, install all the deps
RUN pnpm install --offline

# STAGE 4: Build the NextJS app
# Here we use pnpm filtering to only build the frontend app
# Then we use pnpm deploy command to prune the dependencies
FROM with_all_deps as builder
RUN pnpm --filter='*frontend' build
RUN pnpm --filter='*frontend' deploy pruned --prod

# STAGE 5: Create a clean production image - only take pruned assets
FROM node:18-alpine AS runner
WORKDIR /app
# We set the NODE_ENV to production to make sure that the NextJS app runs in production mode
ENV NODE_ENV=production
# We add a non-root user to run the app for security reasons
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

# We copy the built NextJS app assets from the builder stage
# NextJS produces a backend server and a frontend app
COPY --chown=app:app --from=builder /app/apps/frontend/.next/standalone src/
COPY --chown=app:app --from=builder /app/apps/frontend/public src/apps/frontend/public
COPY --chown=app:app --from=builder /app/apps/frontend/.next/static src/apps/frontend/.next/static

# Set the port that the NextJS app will run on
# You should choose a port that is supported by your cloud provider
ENV PORT 5000
# Expose the port to the outside world
EXPOSE 5000

# Finally, we run the NextJS app
CMD ["node", "src/apps/frontend/server.js"]