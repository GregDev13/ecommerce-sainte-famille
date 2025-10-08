# Dockerfile - Frontend Vue.js 3
FROM node:22-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Argument pour l'URL de l'API (peut être overridé au build)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Builder l'application pour la production
RUN npm run build

# ============================================================================
# Stage de production avec Nginx
# ============================================================================
FROM nginx:alpine AS production

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés depuis le stage build
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
