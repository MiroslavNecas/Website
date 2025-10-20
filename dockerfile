# Build
FROM public.ecr.aws/docker/library/node:20-alpine AS build
WORKDIR /Website
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Serve
FROM public.ecr.aws/docker/library/nginx:alpine
COPY --from=build /Website/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
