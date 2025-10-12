# 🐳 Guide de Déploiement Docker - Sainte-Famille E-commerce

Guide complet pour déployer votre application avec Docker + Caddy sur VPS Ubuntu.

---

## 📋 Prérequis

- [ ] VPS Ubuntu (OVH ou autre)
- [ ] Accès SSH au VPS
- [ ] Nom de domaine configuré (boutiquesaintefamille.fr)
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
git clone https://github.com/VOTRE_USERNAME/ecommerce-sainte-famille.git ecommerce-sainte-famille
cd ecommerce-sainte-famille

# Ou avec SSH si configuré :
# git clone git@github.com:VOTRE_USERNAME/ecommerce-sainte-famille.git
```

### Étape 2.3 : Configurer les variables d'environnement

```bash
# Créer le fichier .env
vim .env
```

**Remplissez avec ces valeurs :**

```env
# Application
TZ=UTC
LOG_LEVEL=info

# Backend AdonisJS - Security
APP_KEY=    # ⚠️ Sera généré à l'étape suivante

# Base de données PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_USER=sainte_famille_user
DB_PASSWORD=CHANGEZ_CE_MOT_DE_PASSE_TRÈS_SÉCURISÉ
DB_DATABASE=sainte_famille_prod

# Storage / Drive
DRIVE_DISK=fs

# Mail - Mailgun
MAILGUN_API_KEY=VOTRE_CLE_API_MAILGUN
MAILGUN_DOMAIN=boutiquesaintefamille.fr
MAILGUN_API_URL=https://api.eu.mailgun.net
MAILGUN_FROM_EMAIL=noreply@boutiquesaintefamille.fr
MAILGUN_FROM_NAME=Marché de Noël la Sainte Famille

# Email Admin
ADMIN_EMAIL=matcsnv@gmail.com

# URLs de production
APP_URL=https://boutiquesaintefamille.fr
VITE_API_URL=https://boutiquesaintefamille.fr/api/v1
```

**Sauvegarder dans vim :** `Echap`, puis `:wq`, puis `Entrée`

### Étape 2.4 : Générer l'APP_KEY

⚠️ **IMPORTANT :** Avec Docker en production, on ne peut pas utiliser `node ace generate:key` avant le build.

**Solution : Générer avec Node.js directement**

```bash
# Générer une clé aléatoire sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copier la clé affichée
```

**Éditer .env et coller la clé :**

```bash
vim .env
# Appuyez sur 'i' pour passer en mode insertion
# Allez à la ligne APP_KEY= et collez la clé
# Appuyez sur Echap puis :wq
```

---

## 🏗️ PHASE 3 : Build et Déploiement

### Étape 3.1 : Builder les images Docker

```bash
# Builder toutes les images (peut prendre 5-10 minutes)
docker compose build
```

**Note :** Si vous voyez l'avertissement `version is obsolete`, c'est normal, ignorez-le.

### Étape 3.2 : Démarrer les services

```bash
# Démarrer tous les conteneurs en arrière-plan
docker compose up -d
```

### Étape 3.3 : Vérifier que tout fonctionne

```bash
# Voir le statut des conteneurs
docker compose ps

# Tous les conteneurs doivent être "Up" (healthy)
```

### Étape 3.4 : Exécuter les migrations de base de données

⚠️ **IMPORTANT :** Avec Docker en production, la commande Ace est dans le dossier `build/`

```bash
# Attendre 10 secondes que PostgreSQL soit prêt
sleep 10

# Exécuter les migrations (ATTENTION à la commande !)
docker compose exec backend node build/ace.js migration:run --force
```

### Étape 3.5 : Tester l'application localement

```bash
# Tester le health check de l'API
curl http://localhost:3333/health
# Doit retourner: {"status":"healthy",...}

# Tester le frontend
curl http://localhost:8080
# Doit retourner du HTML

# Tester l'API
curl http://localhost:3333/api/v1/products
```

**Depuis votre navigateur local :**
- Frontend : `http://VOTRE_IP_VPS:8080`
- Backend API : `http://VOTRE_IP_VPS:3333`

---

## 🌐 PHASE 4 : Configuration DNS (OVH)

### Étape 4.1 : Obtenir l'IP de votre VPS

```bash
curl ifconfig.me
# Notez cette IP (ex: 123.45.67.89)
```

### Étape 4.2 : Configurer le DNS chez OVH

1. **Se connecter sur OVH** : https://www.ovh.com/manager/
2. **Aller dans "Noms de domaine"** → `boutiquesaintefamille.fr`
3. **Cliquer sur l'onglet "Zone DNS"**
4. **Ajouter/Modifier ces 2 enregistrements :**

```
Type A : @ (ou vide) → VOTRE_IP_VPS
Type A : www → VOTRE_IP_VPS
```

5. **Sauvegarder**
6. **Attendre 10-60 minutes** pour la propagation DNS

### Étape 4.3 : Vérifier la propagation DNS

```bash
# Depuis votre machine locale
nslookup boutiquesaintefamille.fr

# Ou
dig boutiquesaintefamille.fr

# L'IP doit correspondre à celle de votre VPS
```

---

## 🔒 PHASE 5 : Installation de Caddy (SSL automatique)

### Étape 5.1 : Installer Caddy

```bash
# Installer les dépendances
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl

# Ajouter le repository Caddy
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list

# Mettre à jour et installer Caddy
sudo apt update
sudo apt install caddy

# Vérifier l'installation
caddy version
```

### Étape 5.2 : Copier le Caddyfile

```bash
# Copier le Caddyfile dans /etc/caddy
sudo cp Caddyfile /etc/caddy/Caddyfile

# Vérifier la configuration
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Étape 5.3 : Démarrer Caddy

```bash
# Activer Caddy au démarrage
sudo systemctl enable caddy

# Démarrer Caddy
sudo systemctl start caddy

# Vérifier le statut
sudo systemctl status caddy
```

**Caddy va automatiquement :**
- ✅ Obtenir un certificat SSL de Let's Encrypt
- ✅ Configurer HTTPS
- ✅ Rediriger HTTP → HTTPS
- ✅ Renouveler le certificat tous les 90 jours

### Étape 5.4 : Vérifier que tout fonctionne

```bash
# Tester depuis le VPS
curl https://boutiquesaintefamille.fr

# Voir les logs Caddy
sudo journalctl -u caddy -f
```

**Depuis votre navigateur :**
- 🌐 https://boutiquesaintefamille.fr (doit afficher votre site en HTTPS !)

---

## 🔄 PHASE 6 : Script de Déploiement Rapide

Pour les prochaines mises à jour, utilisez le script automatisé :

```bash
# Donner les permissions d'exécution
chmod +x deploy-docker.sh

# Lancer le déploiement
./deploy-docker.sh
```

Le script fera automatiquement :
1. Arrêter les conteneurs
2. Rebuilder les images
3. Démarrer les conteneurs
4. Exécuter les migrations

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

# Exécuter une commande Ace (IMPORTANT : utiliser build/ace.js)
docker compose exec backend node build/ace.js list
docker compose exec backend node build/ace.js migration:run --force
docker compose exec backend node build/ace.js migration:rollback
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

## 💾 Backups

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

### Script de backup automatique (Cron)

```bash
# Éditer le crontab
crontab -e

# Ajouter (backup tous les jours à 2h du matin) :
0 2 * * * cd ~/app/ecommerce-sainte-famille && docker compose exec postgres pg_dump -U sainte_famille_user sainte_famille_prod | gzip > ~/backups/db_backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

---

## 🔒 Sécurité

### Configurer le firewall UFW

```bash
# Installer UFW
sudo apt install ufw -y

# Autoriser SSH (IMPORTANT !)
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS (pour Caddy)
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

### Erreur "Cannot find module '/app/ace'"

⚠️ **C'est normal !** En production, utilisez :

```bash
# ❌ MAUVAIS
docker compose exec backend node ace migration:run

# ✅ CORRECT
docker compose exec backend node build/ace.js migration:run --force
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
curl http://localhost:3333/health

# Vérifier les logs du backend
docker compose logs backend

# Vérifier la variable VITE_API_URL dans .env
cat .env | grep VITE_API_URL
```

### Caddy ne démarre pas (port 80 déjà utilisé)

```bash
# Vérifier ce qui utilise le port 80
sudo lsof -i :80

# Si c'est Docker frontend, vérifier docker-compose.yml
# Le frontend doit être sur 8080:80, pas 80:80
```

### Caddy n'obtient pas le certificat SSL

```bash
# Vérifier les logs Caddy
sudo journalctl -u caddy -n 50

# Vérifier que le DNS est bien configuré
nslookup boutiquesaintefamille.fr

# Vérifier que les ports 80 et 443 sont ouverts
sudo ufw status

# Redémarrer Caddy
sudo systemctl restart caddy
```

### 502 Bad Gateway

```bash
# Vérifier que les conteneurs tournent
docker compose ps

# Tester depuis le VPS
curl http://localhost:8080  # Frontend
curl http://localhost:3333  # Backend

# Voir les logs Caddy
sudo journalctl -u caddy -f
```

---

## ✅ Checklist de Déploiement

### Préparation
- [ ] Docker installé et fonctionnel
- [ ] Repository cloné dans ~/app/ecommerce-sainte-famille
- [ ] Fichier `.env` créé et configuré
- [ ] APP_KEY générée avec Node.js
- [ ] DNS configuré chez OVH (enregistrements A)
- [ ] DNS propagé (10-60 minutes)

### Déploiement Docker
- [ ] `docker compose build` réussi
- [ ] `docker compose up -d` réussi
- [ ] 3 conteneurs "Up" (postgres, backend, frontend)
- [ ] Migrations exécutées avec `build/ace.js`
- [ ] API répond : `curl http://localhost:3333/health`
- [ ] Frontend répond : `curl http://localhost:8080`

### Configuration Caddy
- [ ] Caddy installé
- [ ] Caddyfile copié dans /etc/caddy
- [ ] Caddy démarré : `sudo systemctl status caddy`
- [ ] Certificat SSL obtenu automatiquement
- [ ] Site accessible en HTTPS : https://boutiquesaintefamille.fr

### Sécurité
- [ ] Firewall UFW activé (ports 22, 80, 443)
- [ ] Fail2ban installé
- [ ] Backups configurés (cron)

---

## 📞 Commandes de Gestion Caddy

```bash
# Voir le statut
sudo systemctl status caddy

# Redémarrer Caddy
sudo systemctl restart caddy

# Recharger la config (sans downtime)
sudo systemctl reload caddy

# Voir les logs
sudo journalctl -u caddy -f

# Voir les certificats SSL
sudo caddy list-certificates

# Forcer le renouvellement SSL (test)
sudo caddy renew --force
```

---

## 🎉 Félicitations !

Votre application est maintenant déployée avec Docker + Caddy ! 🚀

**Architecture finale :**
```
Internet (port 80/443)
    ↓
Caddy (reverse proxy + SSL auto)
    ├→ Frontend Docker (port 8080)
    └→ Backend Docker (port 3333)
         ↓
    PostgreSQL Docker (port 5432)
```

**Prochaines étapes recommandées :**
- ✅ Tester toutes les fonctionnalités de l'application
- ✅ Créer un utilisateur admin
- ✅ Ajouter des produits
- ✅ Tester les emails Mailgun
- 📊 Configurer un monitoring (Grafana + Prometheus)
- 🔔 Mettre en place des alertes
- 🔄 Configurer un système de CI/CD (GitHub Actions)

Bon déploiement ! 🐳


# Récupérer les derniers changements
git pull

# Arrêter les conteneurs
docker compose down

# Rebuilder le backend avec les nouveaux changements
docker compose build backend

# Redémarrer tous les conteneurs
docker compose up -d

# Vérifier que tout fonctionne
docker compose ps