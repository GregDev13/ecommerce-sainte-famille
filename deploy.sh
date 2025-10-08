#!/bin/bash

# ============================================================================
# Script de déploiement - Sainte-Famille E-commerce
# VPS Debian - Déploiement automatisé
# ============================================================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de configuration
APP_DIR="/home/deploy/ecommerce-sainte-famille"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
GIT_REPO="https://github.com/VOTRE_USERNAME/ecommerce-sainte-famille.git"  # À MODIFIER
BRANCH="main"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Début du déploiement${NC}"
echo -e "${GREEN}================================${NC}"

# 1. Naviguer vers le répertoire de l'application
cd $APP_DIR || exit

# 2. Sauvegarder le commit actuel
echo -e "${YELLOW}[1/9] Sauvegarde du commit actuel...${NC}"
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "Commit actuel: $CURRENT_COMMIT" > .last-deploy

# 3. Pull des dernières modifications
echo -e "${YELLOW}[2/9] Récupération des dernières modifications...${NC}"
git fetch origin
git reset --hard origin/$BRANCH

# 4. Backend - Installation des dépendances
echo -e "${YELLOW}[3/9] Installation des dépendances backend...${NC}"
cd $BACKEND_DIR
npm ci --production=false

# 5. Backend - Build
echo -e "${YELLOW}[4/9] Build du backend...${NC}"
npm run build

# 6. Backend - Migrations
echo -e "${YELLOW}[5/9] Exécution des migrations de base de données...${NC}"
node ace migration:run --force

# 7. Frontend - Installation des dépendances
echo -e "${YELLOW}[6/9] Installation des dépendances frontend...${NC}"
cd $FRONTEND_DIR
npm ci

# 8. Frontend - Build
echo -e "${YELLOW}[7/9] Build du frontend...${NC}"
npm run build

# 9. Redémarrage de l'application avec PM2
echo -e "${YELLOW}[8/9] Redémarrage de l'application avec PM2...${NC}"
pm2 reload ecosystem.config.js --update-env

# 10. Vérification de l'état de l'application
echo -e "${YELLOW}[9/9] Vérification de l'état de l'application...${NC}"
sleep 3
pm2 status

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Déploiement terminé avec succès !${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Commit déployé: $(git rev-parse HEAD)"
echo -e "Pour rollback: git reset --hard $CURRENT_COMMIT && ./deploy.sh"
