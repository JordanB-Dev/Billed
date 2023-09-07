## Comment lancer l'application en local ?

### étape 1 - Lancer le backend :

### Utilisez une version de node compatible

Si vous utilisez une version récente de node sur votre ordinateur, il se peut qu'il y ai des erreurs lors de l'installation de certaines dépendances. Pour cela il est important de vous assurer que vous ayez une version de node compatible par exemple node v16 ou v18.

Voici quelques indications pour gérer les version de node sur votre ordinateur:

#### Sur Windows

- Installer NVM pour windows (https://github.com/coreybutler/nvm-windows/tags)
- changer la version de node pour une version compatible (par exemple 18.16.1) pous cela suivre les instruction de NVM pour windows :
  - `nvm install 18.16.1`
  - `nvm use 18.16.1`
- Ouvrir Powershell en mode administrateur
- Entrer la commande « Set-ExecutionPolicy RemoteSigned » pour pouvoir gérer l’execution de scripts dans powershell
- Fermer toutes les instances de terminal
- entrer la commande `npm install -g win-node-env` pour installer la gestion des variables d’environnement node pour window

#### Sur Mac

- Installer NVM (Node Version Manager) - https://github.com/nvm-sh/nvm
- changer la version de node pour une version compatible (par exemple 18.16.1) pous cela suivre les instruction de NVM:
  - `nvm install 18.16.1`
  - `nvm use 18.16.1`

### Acceder au repertoire du projet :

```
cd back
```

### Installer les dépendances du projet :

```
npm install
```

### Lancer l'API :

```
npm run run:dev
```

### Accéder à l'API :

L'api est accessible sur le port `5678` en local, c'est à dire `http://localhost:5678`

## Utilisateurs par défaut:

### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```

================ EN ====================

## How to run the API locally :

### Clone the projet:

```
git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

### Go to the project directory :

```
cd Billed-app-FR-Back
```

### Install project dependancies :

```
npm install
```

### Run the API :

```
npm run:dev
```

### Access to the PAI :

The API is locally available on port `5678`, go to `http://localhost:5678`

### administrateur :

```
utilisateur : admin@company.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@company.tld
mot de passe : employee
```

### étape 2 - Lancer le frontend :

Allez au repo cloné :

```
$ cd front
```

Installez les packages npm (décrits dans `package.json`) :

```
$ npm install
```

Installez live-server pour lancer un serveur local :

```
$ npm install -g live-server
```

Lancez l'application :

```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`

## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```
