#!/bin/bash

# ============================================================================
# Script de backup automatique - Sainte-Famille E-commerce
# À exécuter via cron : 0 2 * * * /home/deploy/ecommerce-sainte-famille/backup.sh
# (Tous les jours à 2h du matin)
# ============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/home/deploy/backups"
APP_DIR="/home/deploy/ecommerce-sainte-famille"
DB_NAME="sainte_famille_prod"
DB_USER="sainte_famille_user"
RETENTION_DAYS=30  # Garder les backups pendant 30 jours

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"/{database,uploads}

# Date du backup
DATE=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}Début du backup - $DATE${NC}"
echo -e "${GREEN}====================================${NC}"

# ============================================================================
# 1. Backup de la base de données PostgreSQL
# ============================================================================
echo -e "${YELLOW}[1/3] Backup de la base de données...${NC}"

DB_BACKUP_FILE="$BACKUP_DIR/database/db_backup_$DATE.sql.gz"

# Dump de la base de données et compression
PGPASSWORD="${DB_PASSWORD}" pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" | gzip > "$DB_BACKUP_FILE"

if [ -f "$DB_BACKUP_FILE" ]; then
    echo -e "${GREEN}✓ Backup DB créé: $DB_BACKUP_FILE${NC}"
    echo -e "  Taille: $(du -h "$DB_BACKUP_FILE" | cut -f1)"
else
    echo -e "${RED}✗ Erreur lors du backup de la base de données${NC}"
    exit 1
fi

# ============================================================================
# 2. Backup des fichiers uploadés
# ============================================================================
echo -e "${YELLOW}[2/3] Backup des fichiers uploadés...${NC}"

UPLOADS_BACKUP_FILE="$BACKUP_DIR/uploads/uploads_backup_$DATE.tar.gz"

if [ -d "$APP_DIR/backend/storage/uploads" ]; then
    tar -czf "$UPLOADS_BACKUP_FILE" -C "$APP_DIR/backend/storage" uploads/

    if [ -f "$UPLOADS_BACKUP_FILE" ]; then
        echo -e "${GREEN}✓ Backup uploads créé: $UPLOADS_BACKUP_FILE${NC}"
        echo -e "  Taille: $(du -h "$UPLOADS_BACKUP_FILE" | cut -f1)"
    else
        echo -e "${RED}✗ Erreur lors du backup des uploads${NC}"
    fi
else
    echo -e "${YELLOW}! Dossier uploads introuvable, ignoré${NC}"
fi

# ============================================================================
# 3. Nettoyage des anciens backups (> RETENTION_DAYS jours)
# ============================================================================
echo -e "${YELLOW}[3/3] Nettoyage des anciens backups (> $RETENTION_DAYS jours)...${NC}"

# Supprimer les anciens backups de la base de données
find "$BACKUP_DIR/database" -name "db_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
DELETED_DB=$(find "$BACKUP_DIR/database" -name "db_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)

# Supprimer les anciens backups des uploads
find "$BACKUP_DIR/uploads" -name "uploads_backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
DELETED_UPLOADS=$(find "$BACKUP_DIR/uploads" -name "uploads_backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)

echo -e "${GREEN}✓ Nettoyage terminé${NC}"

# ============================================================================
# Résumé
# ============================================================================
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}Backup terminé avec succès !${NC}"
echo -e "${GREEN}====================================${NC}"
echo -e "Date: $DATE"
echo -e "Backups DB disponibles: $(ls -1 "$BACKUP_DIR/database" | wc -l)"
echo -e "Backups uploads disponibles: $(ls -1 "$BACKUP_DIR/uploads" 2>/dev/null | wc -l)"
echo -e "Espace utilisé: $(du -sh "$BACKUP_DIR" | cut -f1)"

# ============================================================================
# Instructions de restauration (à garder en commentaire)
# ============================================================================
# Pour restaurer la base de données :
# gunzip < /home/deploy/backups/database/db_backup_YYYYMMDD_HHMMSS.sql.gz | psql -U sainte_famille_user -d sainte_famille_prod
#
# Pour restaurer les uploads :
# tar -xzf /home/deploy/backups/uploads/uploads_backup_YYYYMMDD_HHMMSS.tar.gz -C /home/deploy/ecommerce-sainte-famille/backend/storage/
