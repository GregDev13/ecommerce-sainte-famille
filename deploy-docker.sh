#!/bin/bash

# ============================================================================
# Script de déploiement Docker - Sainte-Famille E-commerce
# ============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Déploiement Docker - Sainte-Famille${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé !${NC}"
    echo -e "${YELLOW}Installez Docker avec : curl -fsSL https://get.docker.com | sh${NC}"
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    echo -e "${YELLOW}Copie du template .env.docker vers .env...${NC}"
    cp .env.docker .env
    echo -e "${RED}❌ Veuillez éditer le fichier .env avec vos vraies valeurs !${NC}"
    echo -e "${YELLOW}Puis relancez ce script.${NC}"
    exit 1
fi

# Demander confirmation
echo -e "${YELLOW}Ce script va :${NC}"
echo "  1. Arrêter les conteneurs existants"
echo "  2. Reconstruire les images Docker"
echo "  3. Démarrer tous les services"
echo "  4. Exécuter les migrations de base de données"
echo ""
read -p "Continuer ? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Déploiement annulé.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}[1/5] Arrêt des conteneurs existants...${NC}"
docker compose down

echo ""
echo -e "${YELLOW}[2/5] Construction des images Docker...${NC}"
docker compose build --no-cache

echo ""
echo -e "${YELLOW}[3/5] Démarrage des services...${NC}"
docker compose up -d

echo ""
echo -e "${YELLOW}[4/5] Attente du démarrage de la base de données...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}[5/5] Exécution des migrations...${NC}"
docker compose exec backend node ace migration:run --force

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Services en cours d'exécution :${NC}"
docker compose ps
echo ""
echo -e "${BLUE}Commandes utiles :${NC}"
echo "  • Voir les logs : ${YELLOW}docker compose logs -f${NC}"
echo "  • Arrêter : ${YELLOW}docker compose down${NC}"
echo "  • Redémarrer : ${YELLOW}docker compose restart${NC}"
echo "  • Voir le statut : ${YELLOW}docker compose ps${NC}"
echo ""
echo -e "${GREEN}Application accessible sur :${NC}"
echo "  • Frontend : ${YELLOW}http://localhost${NC}"
echo "  • Backend API : ${YELLOW}http://localhost:3333${NC}"
echo ""
