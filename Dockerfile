# Stage 1
FROM mhart/alpine-node:12 as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# No npm prune since that removes devDependencies
RUN npm run build

# Stage 2
FROM mhart/alpine-node:slim-12

WORKDIR /app
COPY --from=builder /app/package.json  ./
COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["node", "build"]