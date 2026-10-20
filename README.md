# ➗ Produit en croix — calculer une note sur 20 🎓

> 😊 **Pas besoin d'être informaticien :** si vous voulez simplement calculer une note, utilisez la version en ligne ci-dessous. Le téléchargement hors ligne et la partie développement sont là uniquement si vous en avez besoin.

Cette petite application transforme une note en **note sur 20** grâce au produit en croix : vous indiquez les points obtenus et le total de points de l'épreuve, et elle calcule l'équivalent sur 20 pour vous. ✨

---

## 🌐 Le plus simple : utiliser l'application en ligne

👉 **[▶️ Ouvrir la démo en ligne](https://christophemarc.github.io/produit_en_croix/version-locale/index.html)**

- ✅ Rien à installer
- 🌍 Il suffit d'un navigateur et d'une connexion Internet
- 🚀 C'est la méthode la plus rapide pour un usage ponctuel

> 📴 **Vous préférez travailler sans Internet ?** Suivez les étapes **1** et **2** ci-dessous pour installer la version hors ligne sur votre ordinateur.
> 🛠️ **Vous voulez modifier le programme ?** Rendez-vous directement à la section **6**.

---

## 1. 📥 Récupérer le projet sur votre ordinateur (clonage GitHub)

Cette étape sert à copier le projet sur votre Bureau. Choisissez les instructions correspondant à votre système :

### 🪟 Sous Windows

1. Ouvrez le menu **Démarrer**, tapez `PowerShell`, puis ouvrez **Windows PowerShell** ou **Terminal**.
2. Copiez-collez les deux lignes suivantes, puis appuyez sur Entrée après chacune :

   ```powershell
   Set-Location "$HOME\Desktop"
   git clone https://github.com/christophemarc/produit_en_croix.git
   ```

Le dossier `Produit_en_croix` sera créé sur votre Bureau. 🎉

> **Si la commande `git` n'est pas reconnue :** Git n'est probablement pas installé. Vous pouvez l'installer depuis [git-scm.com/downloads](https://git-scm.com/downloads), puis recommencer. Autre possibilité, sans installer Git : utilisez l'alternative **Download ZIP** présentée juste après les instructions Linux. 📦

### 🐧 Sous Linux (la plupart des distributions avec un bureau graphique)

1. Ouvrez l'application **Terminal**.
2. Copiez-collez ces deux lignes :

   ```bash
   cd "$(xdg-user-dir DESKTOP)"
   git clone https://github.com/christophemarc/produit_en_croix.git
   ```

Le dossier `produit_en_croix` sera créé sur le Bureau. `xdg-user-dir DESKTOP` retrouve automatiquement le dossier du Bureau, même s'il porte un nom localisé, par exemple `Bureau`. 🎉

> **Si `xdg-user-dir` n'existe pas :** essayez `cd ~/Desktop` ou `cd ~/Bureau`, selon le nom du dossier présent dans votre dossier personnel. Si `git` n'est pas installé, installez-le à l'aide du gestionnaire de logiciels de votre distribution, ou utilisez l'option **Code → Download ZIP** présentée ci-dessous. 📦

### 📦 Alternative sans Git : télécharger le fichier ZIP

Si vous ne voulez pas installer Git, c'est la méthode la plus simple :

1. Ouvrez la page du projet : [github.com/christophemarc/Produit_en_croix](https://github.com/christophemarc/produit_en_croix)
2. Cliquez sur le bouton vert **Code**.
3. Cliquez sur **Download ZIP**.
4. Décompressez l'archive téléchargée et placez le dossier obtenu sur votre Bureau.

**À retenir :** 💡 le clonage se fait une seule fois. Il faut une connexion Internet pour récupérer le projet ; après cela, la version locale fonctionne sans Internet.

---

## 2. 🚀 Ouvrir l'application hors ligne

1. Ouvrez le dossier `produit_en_croix` créé sur votre Bureau.
2. Ouvrez le sous-dossier `version-locale`.
3. Faites un **double-clic sur `index.html`**. 🖱️

Le fichier s'ouvre dans votre navigateur habituel (par exemple Firefox, Chrome ou Edge). Il fonctionne localement, sans connexion et sans installation supplémentaire. Vous pouvez aussi copier ce fichier `index.html` à un autre endroit ou sur une clé USB. 💾

> ⚠️ **Important :** choisissez `version-locale/index.html`. Le fichier `index.html` situé à la racine du projet sert au développement ; l'ouvrir directement par double-clic n'est pas la bonne méthode pour utiliser l'application.

---

## 3. 👀 À quoi ressemble l'application ?

![Capture d'écran de l'application Produit en croix, avec la saisie des points, la note calculée sur 20 et la calculatrice intégrée](capture-application.png)

La capture montre les principales zones :

- 🎯 **Barème :** indiquez les points obtenus et le total de points de l'épreuve.
- ⭐ **Résultat :** l'application calcule l'équivalent sur 20 et présente le résultat arrondi selon les options choisies.
- 🧮 **Calculatrice :** effectuez des opérations au clavier ou avec les boutons affichés à droite.
- 🔢 **Arrondi et classement :** ajustez la règle d'arrondi et utilisez les commandes de classement proposées par l'application.

💡 Par exemple, sur la capture, **27 points sur 43** correspondent à **12,56/20** avant arrondi, soit **12,5/20** avec l'arrondi au demi-point le plus proche.

---

## 4. ✍️ Utiliser l'application

1. Saisissez le nombre de points obtenus.
2. Saisissez le total possible pour l'épreuve.
3. Lisez la note calculée sur 20. ⭐
4. Vérifiez ou modifiez, si nécessaire, la règle et le sens de l'arrondi dans la zone **Arrondi automatique**.

La calculatrice intégrée accepte les chiffres et les opérations au clavier. ⌨️ Les principaux raccourcis sont rappelés dans le panneau **Raccourcis clavier** de l'application. La touche `Échap` permet notamment d'effacer la saisie de la calculatrice ; la touche `C` sert à copier et classer la note, selon le fonctionnement affiché dans l'application.

---

## 5. ❓ Utilisation hors ligne : questions fréquentes

### Dois-je installer un logiciel ? 🧑‍💻

Non, pas pour utiliser la version locale. Un navigateur Web courant suffit. Git est nécessaire uniquement pour cloner le dépôt ; il n'est pas nécessaire au lancement quotidien de l'application.

### Dois-je garder le dossier complet ? 📁

Pour lancer l'application après le clonage, vous pouvez ouvrir `version-locale/index.html`. Ce fichier autonome peut être copié seul ailleurs. Garder le dépôt complet est toutefois utile si vous souhaitez récupérer des mises à jour ou modifier le programme.

### Que faire si une page blanche apparaît ? 😕

Vérifiez que vous avez ouvert `version-locale/index.html`, et non le fichier `index.html` à la racine du dépôt.

### Comment récupérer une mise à jour plus tard ? 🔄

Reconnectez-vous à Internet, ouvrez un terminal dans le dossier `produit_en_croix`, puis lancez :

```bash
git pull
```

Ouvrez ensuite à nouveau le fichier `version-locale/index.html`. Si le dépôt a été téléchargé avec **Download ZIP**, téléchargez et décompressez la nouvelle archive pour récupérer les derniers fichiers.

> 🔁 **Si vous aviez cloné le projet avant le renommage du dépôt**, mettez à jour son adresse une seule fois, avant le `git pull` :
>
> ```bash
> git remote set-url origin https://github.com/christophemarc/produit_en_croix.git
> ```

---

## 6. 🛠️ Pour les personnes qui souhaitent modifier le programme

Cette section est facultative : **elle n'est pas nécessaire pour utiliser l'application hors ligne**. 😊

Le projet utilise React, TypeScript et Vite. Pour lancer la version de développement, il faut installer [Node.js](https://nodejs.org/) et npm. Le projet utilise Vite 7, qui demande Node.js `20.19+` ou `22.12+` ; privilégiez une version LTS encore maintenue. Voir la [documentation officielle de Vite](https://vite.dev/guide/).

Depuis un terminal ouvert dans le dossier du projet :

```bash
npm install       # télécharge et installe les dépendances du projet
npm run dev       # lance le site de développement
npm run build     # construit la version destinée à la publication en ligne
npm run build:local # régénère la version autonome hors ligne
```

Après `npm run dev`, le terminal indique l'adresse locale à ouvrir dans le navigateur (habituellement `http://localhost:5173`). Ces commandes sont réservées au développement et nécessitent généralement Internet au moins lors de l'installation des dépendances.

### 🌐 (Re)mettre la démo en ligne avec GitHub Pages

Le dépôt ayant été renommé, la démo se trouve désormais à cette adresse : **https://christophemarc.github.io/produit_en_croix/**

Si la page ne s'affiche plus après le renommage :

1. Dans le dépôt GitHub, ouvrez **Settings → Pages** et vérifiez que la publication est toujours activée, avec la même source qu'auparavant (*GitHub Actions* si un workflow existe, ou la branche utilisée avant le renommage).
2. Vérifiez que l'ancien nom `Produit_en_croix_en_ligne` n'apparaît plus dans la configuration de publication : si une option `base` est définie dans `vite.config.ts` (ou dans la commande de build), elle doit valoir `'/Produit_en_croix/'`, en respectant les majuscules.
3. Déclenchez une nouvelle publication : envoyez un commit sur GitHub, ou relancez le workflow depuis l'onglet **Actions**.
4. Attendez quelques minutes, puis ouvrez la nouvelle adresse et rechargez la page avec `Ctrl + F5`. 🔄

> ⚠️ Une application Vite doit être **construite** (`npm run build`) avant d'être publiée : si aucun déploiement n'est configuré dans GitHub Pages, préférez *GitHub Actions* plutôt que la racine du code source.

---

## 7. 🗂️ Repères dans les fichiers du projet

| Fichier ou dossier | À quoi sert-il ? |
| --- | --- |
| `version-locale/index.html` | Version prête à l'emploi, autonome et utilisable hors ligne. |
| `version-locale/LISEZ-MOI.txt` | Instructions courtes pour la version locale. |
| `index.html` | Point d'entrée du projet de développement ; ne pas utiliser pour lancer la version hors ligne par double-clic. |
| `src/` | Code source de l'application. |
| `public/images/` | Images utilisées par le projet source. |
| `scripts/build-local.mjs` | Script qui prépare le fichier autonome hors ligne. |
| `docs/capture-application.png` | Capture d'écran affichée dans ce README. |

---

## 💬 Signaler un problème ou proposer une amélioration

Vous pouvez utiliser l'onglet **Issues** du dépôt GitHub : 👉 [github.com/christophemarc/produit_en_croix/issues](https://github.com/christophemarc/produit_en_croix/issues)

Merci pour vos retours ! 🙏
