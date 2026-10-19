# Produit en croix — barème de note sur 20

Application de calcul de note par produit en croix : saisie des points obtenus
et du total de l'épreuve, note ramenée au barème choisi (20 par défaut),
arrondi automatique au 0,5, avec calculette pilotée au clavier.

## ⚡ Utilisation hors ligne (le plus simple)

Ouvrez par double-clic le fichier :

```
version-locale/index.html
```

C'est un **fichier unique et autonome** (code, styles, images et polices
intégrés) : il fonctionne dans Chrome, Edge ou Firefox **sans connexion
internet et sans installation**. Il peut être copié seul sur le Bureau
Windows ou une clé USB. Voir `version-locale/LISEZ-MOI.txt`.

## ⚠️ Pourquoi l'`index.html` de la racine affiche une page blanche en double-clic ?

Le fichier `index.html` à la racine n'est **pas** l'application prête à
l'emploi : c'est le **point d'entrée du code source** (projet React + Vite +
TypeScript). Il charge `/src/main.tsx`, qu'un navigateur ne sait pas exécuter
directement — le code doit d'abord être compilé par Vite.

C'est pour cela qu'une **deuxième version**, déjà compilée et autonome, est
fournie dans le dossier `version-locale/`. (Si vous ouvrez quand même le
fichier racine par double-clic, un message vous renverra vers la bonne
version.)

## 🌐 Version en ligne / développement

Prérequis : [Node.js](https://nodejs.org/) (version 18 ou plus récente).

```bash
npm install       # installe les dépendances (une seule fois)
npm run dev       # lance l'application en développement → http://localhost:5173
npm run build     # compile la version en ligne dans le dossier dist/
```

La version en ligne (celle publiée sur le site) charge ses polices depuis
Google Fonts ; elle suppose donc une connexion internet.

## 🔁 Régénérer la version locale après une modification du code

```bash
npm run build:local
```

Cette commande recompile l'application puis, via `scripts/build-local.mjs` :

1. retire les liens Google Fonts et intègre les polices (Fraunces, Archivo,
   JetBrains Mono — paquets `@fontsource-variable/*`) en base64 ;
2. intègre les images de `public/images/` en base64 ;
3. vérifie qu'il ne subsiste **aucune** référence externe ;
4. écrit le résultat dans `version-locale/index.html`.

## 📁 Structure

| Chemin | Rôle |
| --- | --- |
| `index.html` | Point d'entrée **source** (Vite) — ne pas ouvrir en double-clic |
| `src/` | Code source React/TypeScript |
| `public/images/` | Images de fond (papier, bureau) |
| `dist/` | Version en ligne compilée (`npm run build`, non versionnée) |
| `version-locale/index.html` | **Version hors ligne autonome, prête à l'emploi** |
| `scripts/build-local.mjs` | Génère la version locale (`npm run build:local`) |
