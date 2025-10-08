# 🚀 Guide de Déploiement VPS Debian - Sainte-Famille E-commerce

Guide complet pour déployer votre application AdonisJS 6 + Vue 3 sur VPS OVH Debian via SSH.

---

## 📋 Prérequis

- [ ] VPS Debian installé (OVH)
- [ ] Adresse IP du VPS
- [ ] Nom de domaine configuré (ou en cours)
- [ ] Accès SSH root initial
- [ ] Credentials Mailgun
- [ ] Repository Git (GitHub/GitLab)

---

## 🔐 PHASE 1 : Connexion et Sécurisation du Serveur

### Étape 1.1 : Première connexion SSH

```bash
# Sur votre machine locale, connectez-vous en tant que root
ssh ubuntu@VOTRE_IP_VPS

# Exemple : ssh root@51.68.123.456
```

### Étape 1.2 : Mise à jour du système

```bash
# Une fois connecté, mettez à jour Debian
sudo apt update 
sudo apt upgrade -y
```

### Étape 1.3 : Créer un utilisateur de déploiement

```bash
# Créer l'utilisateur 'deploy'
adduser deploy

# Ajouter 'deploy' au groupe sudo
usermod -aG sudo deploy

# Créer le dossier .ssh pour cet utilisateur
mkdir -p /home/deploy/.ssh

# Copier votre clé SSH du root vers deploy
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### Étape 1.4 : Tester la connexion avec l'utilisateur deploy

```bash
# Sur votre machine locale (nouvelle fenêtre terminal)
ssh deploy@VOTRE_IP_VPS

# Si ça fonctionne, continuez. Sinon, vérifiez les permissions.
```

### Étape 1.5 : Configurer le firewall UFW

```bash
# Sur le VPS en tant que deploy
sudo apt install ufw -y

# Autoriser SSH (IMPORTANT : à faire AVANT d'activer le firewall !)
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Autoriser le port 3333 pour l'API (optionnel si proxy Nginx)
# sudo ufw allow 3333/tcp

# Activer le firewall
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

### Étape 1.6 : Désactiver la connexion root SSH (sécurité)

```bash
# Éditer la config SSH
sudo nano /etc/ssh/sshd_config

# Trouver et modifier cette ligne :
# PermitRootLogin yes
# Remplacer par :
PermitRootLogin no

# Sauvegarder : Ctrl+O, Entrée, puis Ctrl+X

# Redémarrer SSH
sudo systemctl restart sshd
```

### Étape 1.7 : Installer Fail2ban (protection brute-force)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🛠️ PHASE 2 : Installation de la Stack

### Étape 2.1 : Installer Node.js v22 avec nvm

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Recharger le shell
source ~/.bashrc

# Installer Node.js v22
nvm install 22
nvm use 22
nvm alias default 22

# Vérifier
node -v
npm -v
```

### Étape 2.2 : Installer PostgreSQL

```bash
# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier
sudo systemctl status postgresql
```

### Étape 2.3 : Configurer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL, exécutez :
CREATE DATABASE sainte_famille_prod;
CREATE USER sainte_famille_user WITH ENCRYPTED PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON DATABASE sainte_famille_prod TO sainte_famille_user;
\q

# Retour au shell normal
```

### Étape 2.4 : Installer Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier
sudo systemctl status nginx

# Tester : ouvrir http://VOTRE_IP_VPS dans un navigateur
# Vous devriez voir la page par défaut de Nginx
```

### Étape 2.5 : Installer Certbot (SSL Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

## 📦 PHASE 3 : Déploiement de l'Application

### Étape 3.1 : Cloner le repository

```bash
# Créer le dossier de l'application
mkdir -p /home/deploy/ecommerce-sainte-famille
cd /home/deploy/ecommerce-sainte-famille

# Configurer Git (si première utilisation)
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# Cloner le repo (remplacer par votre URL)
git clone https://github.com/VOTRE_USERNAME/ecommerce-sainte-famille.git .

# Ou si vous utilisez une clé SSH GitHub :
# git clone git@github.com:VOTRE_USERNAME/ecommerce-sainte-famille.git .
```

### Étape 3.2 : Configurer le Backend

```bash
cd /home/deploy/ecommerce-sainte-famille/backend

# Copier le template .env.production vers .env
cp .env.production .env

# Éditer le fichier .env
nano .env
```

**Remplir les valeurs suivantes dans `.env` :**
```env
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=                    # ⚠️ À générer à l'étape suivante
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=sainte_famille_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE_SECURISE
DB_DATABASE=sainte_famille_prod
MAILGUN_API_KEY=VOTRE_CLE_MAILGUN
MAILGUN_DOMAIN=VOTRE_DOMAINE_MAILGUN
APP_URL=https://votre-domaine.fr
```

### Étape 3.3 : Générer l'APP_KEY

```bash
# Installer les dépendances (nécessaire pour générer la clé)
npm install

# Générer l'APP_KEY
node ace generate:key

# Copier la clé générée et l'ajouter dans .env
nano .env
# Coller la clé après APP_KEY=
```

### Étape 3.4 : Installer les dépendances et builder le backend

```bash
# Installer les dépendances (mode production)
npm ci --production=false

# Builder l'application
npm run build

# Vérifier que le dossier build/ a été créé
ls -la build/
```

### Étape 3.5 : Exécuter les migrations

```bash
# Exécuter les migrations de base de données
node ace migration:run --force
```

### Étape 3.6 : Créer les dossiers de logs et uploads

```bash
# Créer le dossier de logs
mkdir -p /home/deploy/logs

# Créer le dossier uploads avec bonnes permissions
mkdir -p /home/deploy/ecommerce-sainte-famille/backend/storage/uploads
chmod 755 /home/deploy/ecommerce-sainte-famille/backend/storage/uploads
```

### Étape 3.7 : Configurer le Frontend

```bash
cd /home/deploy/ecommerce-sainte-famille/frontend

# Copier le template .env.production vers .env.production
cp .env.production .env

# Éditer
nano .env

# Remplacer par votre domaine :
VITE_API_URL=https://votre-domaine.fr/api
```

### Étape 3.8 : Installer et builder le frontend

```bash
# Installer les dépendances
npm ci

# Builder pour la production
npm run build

# Vérifier que le dossier dist/ a été créé
ls -la dist/
```

---

## ⚙️ PHASE 4 : Configuration PM2

### Étape 4.1 : Installer PM2 globalement

```bash
npm install -g pm2
```

### Étape 4.2 : Copier ecosystem.config.js à la racine

```bash
# Copier le fichier ecosystem.config.js vers la racine du projet
cp /home/deploy/ecommerce-sainte-famille/ecosystem.config.js /home/deploy/

# Ou éditer directement
nano /home/deploy/ecommerce-sainte-famille/ecosystem.config.js
```

### Étape 4.3 : Démarrer l'application avec PM2

```bash
cd /home/deploy/ecommerce-sainte-famille

# Démarrer l'application
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs sainte-famille-api
```

### Étape 4.4 : Configurer PM2 au démarrage

```bash
# Générer le script de démarrage automatique
pm2 startup

# Exécuter la commande suggérée (commence par sudo)
# Exemple : sudo env PATH=$PATH:/home/deploy/.nvm/versions/node/v22.x.x/bin ...

# Sauvegarder la liste des apps
pm2 save
```

---

## 🌐 PHASE 5 : Configuration Nginx et SSL

### Étape 5.1 : Configurer le DNS de votre domaine

**Sur votre interface OVH (ou votre registrar) :**
- Créer un enregistrement A : `@` → `VOTRE_IP_VPS`
- Créer un enregistrement A : `www` → `VOTRE_IP_VPS`
- Attendre la propagation DNS (5-30 min)

### Étape 5.2 : Copier la configuration Nginx

```bash
# Copier le fichier de config
sudo cp /home/deploy/ecommerce-sainte-famille/nginx-sainte-famille.conf /etc/nginx/sites-available/sainte-famille

# Éditer et remplacer 'votre-domaine.fr' par votre vrai domaine
sudo nano /etc/nginx/sites-available/sainte-famille

# Chercher toutes les occurrences de 'votre-domaine.fr' et remplacer
```

### Étape 5.3 : Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/sainte-famille /etc/nginx/sites-enabled/

# Désactiver le site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Si OK, recharger Nginx
sudo systemctl reload nginx
```

### Étape 5.4 : Obtenir le certificat SSL

```bash
# Obtenir le certificat SSL avec Certbot
sudo certbot --nginx -d votre-domaine.fr -d www.votre-domaine.fr

# Suivre les instructions :
# - Entrer votre email
# - Accepter les conditions
# - Choisir de rediriger HTTP vers HTTPS (recommandé)

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

### Étape 5.5 : Tester le site

```bash
# Ouvrir dans un navigateur :
# https://votre-domaine.fr

# Vous devriez voir votre application Vue.js
# Tester l'API : https://votre-domaine.fr/api
```

---

## 📊 PHASE 6 : Backups et Monitoring

### Étape 6.1 : Configurer les backups automatiques

```bash
# Copier le script de backup
cp /home/deploy/ecommerce-sainte-famille/backup.sh /home/deploy/

# Rendre exécutable
chmod +x /home/deploy/backup.sh

# Éditer pour ajouter le mot de passe DB
nano /home/deploy/backup.sh

# Ajouter au début du fichier (après les variables) :
# export DB_PASSWORD="VOTRE_MOT_DE_PASSE_DB"
```

### Étape 6.2 : Créer un cron pour les backups quotidiens

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne (backup tous les jours à 2h du matin) :
0 2 * * * /home/deploy/backup.sh >> /home/deploy/logs/backup.log 2>&1

# Sauvegarder et quitter
```

### Étape 6.3 : Tester le backup manuellement

```bash
# Exécuter le script
/home/deploy/backup.sh

# Vérifier que les backups sont créés
ls -lh /home/deploy/backups/database/
ls -lh /home/deploy/backups/uploads/
```

### Étape 6.4 : Monitoring avec PM2

```bash
# Voir le monitoring en temps réel
pm2 monit

# Voir les logs en direct
pm2 logs

# Voir les métriques
pm2 describe sainte-famille-api
```

---

## 🔄 PHASE 7 : Déploiements Futurs

### Pour les prochaines mises à jour :

```bash
# Se connecter au VPS
ssh deploy@VOTRE_IP_VPS

# Naviguer vers le projet
cd /home/deploy/ecommerce-sainte-famille

# Utiliser le script de déploiement
./deploy.sh
```

---

## 🆘 Commandes Utiles

### Gestion PM2
```bash
pm2 status                    # Voir le statut
pm2 logs                      # Voir les logs
pm2 restart sainte-famille-api # Redémarrer l'app
pm2 stop sainte-famille-api   # Arrêter l'app
pm2 delete sainte-famille-api # Supprimer l'app
```

### Gestion Nginx
```bash
sudo systemctl status nginx   # Statut
sudo systemctl reload nginx   # Recharger la config
sudo systemctl restart nginx  # Redémarrer
sudo nginx -t                 # Tester la config
```

### Gestion PostgreSQL
```bash
sudo -u postgres psql         # Se connecter
sudo systemctl status postgresql # Statut
```

### Logs
```bash
# Logs Nginx
sudo tail -f /var/log/nginx/sainte-famille-access.log
sudo tail -f /var/log/nginx/sainte-famille-error.log

# Logs PM2
pm2 logs sainte-famille-api

# Logs système
sudo journalctl -u nginx -f
```

---

## ✅ Checklist Finale

- [ ] Application accessible via HTTPS
- [ ] SSL actif (cadenas vert)
- [ ] API backend répond sur /api
- [ ] Connexion à la base de données OK
- [ ] Envoi d'emails fonctionne (tester)
- [ ] Uploads de fichiers fonctionnent
- [ ] PM2 démarre au boot
- [ ] Backups quotidiens configurés
- [ ] Firewall actif
- [ ] Connexion root SSH désactivée

---

## 🐛 Dépannage

### L'application ne démarre pas
```bash
pm2 logs sainte-famille-api
# Vérifier les erreurs dans les logs
```

### Erreur de connexion à la base de données
```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Tester la connexion
psql -U sainte_famille_user -d sainte_famille_prod -h localhost
```

### Nginx 502 Bad Gateway
```bash
# Vérifier que l'app PM2 tourne
pm2 status

# Vérifier que le port 3333 écoute
sudo netstat -tulpn | grep 3333
```

### SSL ne fonctionne pas
```bash
# Vérifier que le domaine pointe vers le VPS
ping votre-domaine.fr

# Réessayer Certbot
sudo certbot --nginx -d votre-domaine.fr
```

---

## 📞 Support

En cas de problème, vérifiez :
1. Les logs PM2 : `pm2 logs`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. Le statut des services : `sudo systemctl status nginx postgresql`

Bon déploiement ! 🚀
