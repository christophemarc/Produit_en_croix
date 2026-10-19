# Produit en croix — calculer une note sur 20

Cette petite application permet de convertir les points obtenus à une épreuve en une note sur 20. Elle comprend aussi une calculatrice et des options d'arrondi.

**Vous n'avez pas besoin de savoir programmer pour utiliser l'application hors ligne.** La méthode la plus simple est expliquée ci-dessous.

## 1. Copier le projet sur le Bureau

Le dépôt contient une version prête à l'emploi qui fonctionne **sans connexion Internet, une fois téléchargée**. Le téléchargement initial nécessite toutefois une connexion.

### Sous Windows (PowerShell)

1. Ouvrez le menu **Démarrer**, tapez `PowerShell`, puis ouvrez **Windows PowerShell** ou **Terminal**.
2. Copiez-collez les deux lignes suivantes, puis appuyez sur Entrée après chacune :

   ```powershell
   Set-Location "$HOME\Desktop"
   git clone https://github.com/christophemarc/Produit_en_croix_en_ligne.git
   ```

Le dossier `Produit_en_croix_en_ligne` sera créé sur votre Bureau.

> **Si la commande `git` n'est pas reconnue :** Git n'est probablement pas installé. Vous pouvez l'installer depuis [git-scm.com/downloads](https://git-scm.com/downloads), puis recommencer. Autre possibilité, sans installer Git : ouvrez la page du dépôt sur GitHub, cliquez sur **Code**, puis sur **Download ZIP** ; téléchargez et décompressez l'archive sur le Bureau.

### Sous Linux (la plupart des distributions avec un bureau graphique)

1. Ouvrez l'application **Terminal**.
2. Copiez-collez ces deux lignes :

   ```bash
   cd "$(xdg-user-dir DESKTOP)"
   git clone https://github.com/christophemarc/Produit_en_croix_en_ligne.git
   ```

Le dossier `Produit_en_croix_en_ligne` sera créé sur le Bureau. `xdg-user-dir DESKTOP` retrouve automatiquement le dossier du Bureau, même s'il porte un nom localisé, par exemple `Bureau`.

> **Si `xdg-user-dir` n'existe pas :** essayez `cd ~/Desktop` ou `cd ~/Bureau`, selon le nom du dossier présent dans votre dossier personnel. Si `git` n'est pas installé, installez-le à l'aide du gestionnaire de logiciels de votre distribution, ou utilisez l'option **Code → Download ZIP** sur GitHub.

**À retenir :** le clonage se fait une seule fois. Il faut une connexion Internet pour récupérer le projet ; après cela, la version locale fonctionne sans Internet.

## 2. Ouvrir l'application hors ligne

1. Ouvrez le dossier `Produit_en_croix_en_ligne` créé sur votre Bureau.
2. Ouvrez le sous-dossier `version-locale`.
3. Faites un **double-clic sur `index.html`**.

Le fichier s'ouvre dans votre navigateur habituel (par exemple Firefox, Chrome ou Edge). Il fonctionne localement, sans connexion et sans installation supplémentaire. Vous pouvez aussi copier ce fichier `index.html` à un autre endroit ou sur une clé USB.

> **Important :** choisissez `version-locale/index.html`. Le fichier `index.html` situé à la racine du projet sert au développement ; l'ouvrir directement par double-clic n'est pas la bonne méthode pour utiliser l'application.

## 3. À quoi ressemble l'application ?

![Capture d'écran de l'application Produit en croix, avec la saisie des points, la note calculée sur 20 et la calculatrice intégrée](capture-application.png)

La capture montre les principales zones :

- **Barème :** indiquez les points obtenus et le total de points de l'épreuve.
- **Résultat :** l'application calcule l'équivalent sur 20 et présente le résultat arrondi selon les options choisies.
- **Calculatrice :** effectuez des opérations au clavier ou avec les boutons affichés à droite.
- **Arrondi et classement :** ajustez la règle d'arrondi et utilisez les commandes de classement proposées par l'application.

Par exemple, sur la capture, **27 points sur 43** correspondent à **12,56/20** avant arrondi, soit **12,5/20** avec l'arrondi au demi-point le plus proche.

## 4. Utiliser l'application

1. Saisissez le nombre de points obtenus.
2. Saisissez le total possible pour l'épreuve.
3. Lisez la note calculée sur 20.
4. Vérifiez ou modifiez, si nécessaire, la règle et le sens de l'arrondi dans la zone **Arrondi automatique**.

La calculatrice intégrée accepte les chiffres et les opérations au clavier. Les principaux raccourcis sont rappelés dans le panneau **Raccourcis clavier** de l'application. La touche `Échap` permet notamment d'effacer la saisie de la calculatrice ; la touche `C` sert à copier et classer la note, selon le fonctionnement affiché dans l'application.

## 5. Utilisation hors ligne : questions fréquentes

### Dois-je installer un logiciel ?

Non, pas pour utiliser la version locale. Un navigateur Web courant suffit. Git est nécessaire uniquement pour cloner le dépôt ; il n'est pas nécessaire au lancement quotidien de l'application.

### Dois-je garder le dossier complet ?

Pour lancer l'application après le clonage, vous pouvez ouvrir `version-locale/index.html`. Ce fichier autonome peut être copié seul ailleurs. Garder le dépôt complet est toutefois utile si vous souhaitez récupérer des mises à jour ou modifier le programme.

### Que faire si une page blanche apparaît ?

Vérifiez que vous avez ouvert `version-locale/index.html`, et non le fichier `index.html` à la racine du dépôt.

### Comment récupérer une mise à jour plus tard ?

Reconnectez-vous à Internet, ouvrez un terminal dans le dossier `Produit_en_croix_en_ligne`, puis lancez :

```bash
git pull
```

Ouvrez ensuite à nouveau le fichier `version-locale/index.html`. Si le dépôt a été téléchargé avec **Download ZIP**, téléchargez et décompressez la nouvelle archive pour récupérer les derniers fichiers.

## 6. Pour les personnes qui souhaitent modifier le programme

Cette section est facultative : **elle n'est pas nécessaire pour utiliser l'application hors ligne**.

Le projet utilise React, TypeScript et Vite. Pour lancer la version de développement, il faut installer [Node.js](https://nodejs.org/) et npm. Le projet utilise Vite 7, qui demande Node.js `20.19+` ou `22.12+` ; privilégiez une version LTS encore maintenue. Voir la [documentation officielle de Vite](https://vite.dev/guide/).

Depuis un terminal ouvert dans le dossier du projet :

```bash
npm install       # télécharge et installe les dépendances du projet
npm run dev       # lance le site de développement
npm run build     # construit la version destinée à la publication en ligne
npm run build:local # régénère la version autonome hors ligne
```

Après `npm run dev`, le terminal indique l'adresse locale à ouvrir dans le navigateur (habituellement `http://localhost:5173`). Ces commandes sont réservées au développement et nécessitent généralement Internet au moins lors de l'installation des dépendances.

## 7. Repères dans les fichiers du projet

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

Pour signaler un problème ou proposer une amélioration, vous pouvez utiliser l'onglet **Issues** du dépôt GitHub.
