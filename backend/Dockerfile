# Dockerfile - Backend AdonisJS 6
FROM node:22-alpine AS base

# Installation des dépendances système
RUN apk add --no-cache dumb-init

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# ============================================================================
# Stage de développement
# ============================================================================
FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
CMD ["dumb-init", "node", "ace", "serve", "--hmr"]

# ============================================================================
# Stage de build
# ============================================================================
FROM base AS build
ENV NODE_ENV=production
RUN npm ci --production=false
COPY . .
RUN npm run build

# ============================================================================
# Stage de production
# ============================================================================
FROM base AS production

# Installer uniquement les dépendances de production
ENV NODE_ENV=production
RUN npm ci --production

# Copier le code buildé depuis le stage build
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

# Créer les dossiers nécessaires
RUN mkdir -p storage/uploads && \
    chown -R node:node /app

# Utiliser l'utilisateur node pour la sécurité
USER node

# Exposer le port
EXPOSE 3333

# Lancer l'application avec dumb-init pour une gestion correcte des signaux
CMD ["dumb-init", "node", "build/bin/server.js"]
