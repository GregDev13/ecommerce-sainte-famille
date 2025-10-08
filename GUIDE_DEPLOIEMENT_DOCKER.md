# 🐳 Guide de Déploiement Docker - Sainte-Famille E-commerce

Guide complet pour déployer votre application avec Docker sur VPS Ubuntu.

---

## 📋 Prérequis

- [ ] VPS Ubuntu (OVH ou autre)
- [ ] Accès SSH au VPS
- [ ] Nom de domaine (optionnel mais recommandé)
- [ ] Credentials Mailgun
- [ ] Repository Git configuré

---

## 🚀 PHASE 1 : Installation de Docker sur le VPS

### Étape 1.1 : Connexion au VPS

```bash
# Depuis votre machine locale
ssh ubuntu@VOTRE_IP_VPS
```

### Étape 1.2 : Mise à jour du système

```bash
sudo apt update
sudo apt upgrade -y
```

### Étape 1.3 : Installation de Docker

```bash
# Installer Docker avec le script officiel
curl -fsSL https://get.docker.com | sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Activer Docker au démarrage
sudo systemctl enable docker
sudo systemctl start docker

# Vérifier l'installation
docker --version
docker compose version
```

**⚠️ IMPORTANT :** Déconnectez-vous et reconnectez-vous pour que les changements de groupe prennent effet :

```bash
exit
ssh ubuntu@VOTRE_IP_VPS
```

### Étape 1.4 : Vérifier que Docker fonctionne

```bash
# Test rapide
docker run hello-world

# Vous devriez voir "Hello from Docker!"
```

---

## 📦 PHASE 2 : Préparation du Projet

### Étape 2.1 : Installer Git (si nécessaire)

```bash
sudo apt install git -y
```

### Étape 2.2 : Cloner votre repository

```bash
# Créer le dossier de l'application
mkdir -p ~/app
cd ~/app

# Cloner le repository (remplacer par votre URL)
git clone https://github.com/VOTRE_USERNAME/ecommerce-sainte-famille.git .

# Ou avec SSH si configuré :
# git clone git@github.com:VOTRE_USERNAME/ecommerce-sainte-famille.git .
```

### Étape 2.3 : Configurer les variables d'environnement

```bash
# Copier le template vers .env
cp .env.docker .env

# Éditer le fichier .env
nano .env
```

**Remplissez les valeurs suivantes :**

```env
# Backend
APP_KEY=                    # ⚠️ Sera généré à l'étape suivante

# Base de données
DB_USER=sainte_famille_user
DB_PASSWORD=CHANGEZ_CE_MOT_DE_PASSE_TRÈS_SÉCURISÉ
DB_DATABASE=sainte_famille_prod

# Mailgun
MAILGUN_API_KEY=VOTRE_CLE_API_MAILGUN
MAILGUN_DOMAIN=VOTRE_DOMAINE_MAILGUN

# URLs (adapter selon votre domaine)
APP_URL=https://votre-domaine.fr
VITE_API_URL=https://votre-domaine.fr/api
```

**Sauvegarder :** `Ctrl+O`, `Entrée`, puis `Ctrl+X`

### Étape 2.4 : Générer l'APP_KEY

```bash
# Générer l'APP_KEY pour AdonisJS
docker compose run --rm backend node ace generate:key

# Copier la clé générée et l'ajouter dans .env
nano .env
# Coller la clé après APP_KEY=
```

---

## 🏗️ PHASE 3 : Build et Déploiement

### Étape 3.1 : Builder les images Docker

```bash
# Builder toutes les images (peut prendre 5-10 minutes)
docker compose build
```

### Étape 3.2 : Démarrer les services

```bash
# Démarrer tous les conteneurs en arrière-plan
docker compose up -d
```

### Étape 3.3 : Vérifier que tout fonctionne

```bash
# Voir le statut des conteneurs
docker compose ps

# Tous les conteneurs doivent être "Up"
```

### Étape 3.4 : Exécuter les migrations de base de données

```bash
# Attendre 10 secondes que PostgreSQL soit prêt
sleep 10

# Exécuter les migrations
docker compose exec backend node ace migration:run --force
```

### Étape 3.5 : Tester l'application

```bash
# Tester que l'API répond
curl http://localhost:3333

# Depuis votre navigateur local :
# http://VOTRE_IP_VPS (frontend)
# http://VOTRE_IP_VPS:3333 (backend API)
```

---

## 🌐 PHASE 4 : Configuration du Domaine et SSL

### Étape 4.1 : Configurer le DNS

**Dans votre interface de domaine (OVH, Cloudflare, etc.) :**

1. Créer un enregistrement A : `@` → `VOTRE_IP_VPS`
2. Créer un enregistrement A : `www` → `VOTRE_IP_VPS`
3. Attendre la propagation DNS (5-30 minutes)

Vérifier avec :
```bash
ping votre-domaine.fr
# Doit pointer vers votre IP VPS
```

### Étape 4.2 : Installer Nginx pour le reverse proxy

```bash
sudo apt install nginx -y
```

### Étape 4.3 : Configurer Nginx

```bash
# Créer la configuration
sudo nano /etc/nginx/sites-available/sainte-famille
```

**Coller cette configuration :**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name votre-domaine.fr www.votre-domaine.fr;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name votre-domaine.fr www.votre-domaine.fr;

    # SSL Configuration (Certbot les ajoutera)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.fr/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Remplacer `votre-domaine.fr` par votre vrai domaine !**

### Étape 4.4 : Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/sainte-famille /etc/nginx/sites-enabled/

# Désactiver le site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### Étape 4.5 : Installer le certificat SSL avec Certbot

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
sudo certbot --nginx -d votre-domaine.fr -d www.votre-domaine.fr

# Suivre les instructions :
# - Entrer votre email
# - Accepter les conditions
# - Choisir de rediriger HTTP vers HTTPS
```

### Étape 4.6 : Configurer le renouvellement automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est déjà configuré via cron
```

---

## 🔄 PHASE 5 : Script de Déploiement Rapide

Pour les prochaines mises à jour, utilisez le script automatisé :

```bash
# Donner les permissions d'exécution
chmod +x deploy-docker.sh

# Lancer le déploiement
./deploy-docker.sh
```

---

## 📊 Commandes Utiles Docker

### Gestion des conteneurs

```bash
# Voir tous les conteneurs
docker compose ps

# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend

# Arrêter tous les conteneurs
docker compose down

# Arrêter et supprimer les volumes (⚠️ SUPPRIME LA DB)
docker compose down -v

# Redémarrer tous les services
docker compose restart

# Redémarrer un service spécifique
docker compose restart backend
```

### Accès aux conteneurs

```bash
# Accéder au shell du backend
docker compose exec backend sh

# Accéder à PostgreSQL
docker compose exec postgres psql -U sainte_famille_user -d sainte_famille_prod

# Exécuter une commande Ace
docker compose exec backend node ace list
docker compose exec backend node ace migration:run
```

### Monitoring

```bash
# Voir l'utilisation des ressources
docker stats

# Voir les volumes
docker volume ls

# Voir les réseaux
docker network ls
```

### Maintenance

```bash
# Nettoyer les images inutilisées
docker image prune -a

# Nettoyer tout (⚠️ ATTENTION)
docker system prune -a --volumes
```

---

## 💾 Backups avec Docker

### Backup de la base de données

```bash
# Créer un dossier de backup
mkdir -p ~/backups

# Backup de PostgreSQL
docker compose exec postgres pg_dump -U sainte_famille_user sainte_famille_prod | gzip > ~/backups/db_backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Backup des uploads

```bash
# Backup du volume des uploads
docker run --rm -v sainte-famille-uploads:/data -v ~/backups:/backup alpine tar czf /backup/uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### Restaurer la base de données

```bash
# Restaurer depuis un backup
gunzip < ~/backups/db_backup_YYYYMMDD_HHMMSS.sql.gz | docker compose exec -T postgres psql -U sainte_famille_user -d sainte_famille_prod
```

### Script de backup automatique

Créer un cron job :

```bash
# Éditer le crontab
crontab -e

# Ajouter (backup tous les jours à 2h du matin) :
0 2 * * * cd ~/app && docker compose exec postgres pg_dump -U sainte_famille_user sainte_famille_prod | gzip > ~/backups/db_backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

---

## 🔒 Sécurité

### Configurer le firewall UFW

```bash
# Installer UFW
sudo apt install ufw -y

# Autoriser SSH (IMPORTANT !)
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier
sudo ufw status
```

### Installer Fail2ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Voir les logs détaillés
docker compose logs

# Reconstruire les images
docker compose build --no-cache
docker compose up -d
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker compose ps postgres

# Voir les logs PostgreSQL
docker compose logs postgres

# Redémarrer PostgreSQL
docker compose restart postgres
```

### Le frontend ne se connecte pas au backend

```bash
# Vérifier que le backend tourne
curl http://localhost:3333

# Vérifier les logs du backend
docker compose logs backend

# Vérifier la variable VITE_API_URL dans .env
```

### Nginx 502 Bad Gateway

```bash
# Vérifier que les conteneurs tournent
docker compose ps

# Tester depuis le VPS
curl http://localhost:80
curl http://localhost:3333
```

### Problème de permissions

```bash
# Corriger les permissions des volumes
docker compose down
sudo chown -R $USER:$USER ~/app
docker compose up -d
```

---

## ✅ Checklist de Déploiement

- [ ] Docker installé et fonctionnel
- [ ] Repository cloné
- [ ] Fichier `.env` configuré avec toutes les valeurs
- [ ] APP_KEY générée
- [ ] Images Docker buildées
- [ ] Conteneurs démarrés (postgres, backend, frontend)
- [ ] Migrations exécutées
- [ ] DNS configuré et propagé
- [ ] Nginx configuré
- [ ] Certificat SSL installé
- [ ] Application accessible via HTTPS
- [ ] Emails Mailgun testés
- [ ] Backups configurés
- [ ] Firewall activé

---

## 📞 Support & Ressources

### Documentation Docker
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)

### Logs importants
```bash
# Logs de l'application
docker compose logs -f

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs système
sudo journalctl -u docker -f
```

---

## 🎉 Félicitations !

Votre application est maintenant déployée avec Docker ! 🚀

**Prochaines étapes recommandées :**
- Configurer un monitoring (Grafana + Prometheus)
- Mettre en place des alertes
- Configurer des backups automatiques vers un stockage externe
- Ajouter un système de CI/CD (GitHub Actions)

Bon déploiement ! 🐳
