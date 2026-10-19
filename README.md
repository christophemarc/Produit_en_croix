# ➗ Produit en croix

> 🧮 Un calculateur de **produit en croix** (règle de trois) simple, rapide et gratuit, directement dans votre navigateur.

[![GitHub Pages](https://img.shields.io/badge/D%C3%A9mo-en%20ligne-brightgreen?logo=github)](https://christophemarc.github.io/Produit_en_croix/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#-technologies)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#-technologies)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#-technologies)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🔗 Démo en ligne

👉 **[https://christophemarc.github.io/Produit_en_croix/](https://christophemarc.github.io/Produit_en_croix/)**

Aucune installation, aucune inscription : il suffit d'ouvrir le lien ! 🚀

---

## 📖 Présentation

Le **produit en croix** (aussi appelé *règle de trois* ou *quatrième proportionnelle*) permet de retrouver une valeur manquante dans une proportion.

Ce projet propose une interface claire où il suffit de saisir **trois valeurs** pour obtenir **la quatrième** instantanément. ⚡

---

## ✨ Fonctionnalités

- 🔢 **Calcul instantané** de la valeur manquante
- 🎯 **N'importe quelle inconnue** : le champ laissé vide est calculé automatiquement
- 📐 **Décimales et nombres négatifs** pris en charge
- 🧾 **Détail du calcul** affiché pour comprendre la méthode
- 📱 **Responsive** : utilisable sur mobile, tablette et ordinateur
- 🛡️ **Gestion des erreurs** (division par zéro, champs non numériques…)
- 🌐 **100 % côté client** : aucune donnée n'est envoyée sur un serveur
- 🆓 **Gratuit et sans publicité**

---

## 🧮 Le principe

Si deux rapports sont égaux :

```
 a     c
--- = ---       ⇒       a × d = b × c
 b     d
```

On en déduit chaque inconnue :

| Inconnue | Formule |
|:--------:|:-------:|
| **a** | `a = (b × c) / d` |
| **b** | `b = (a × d) / c` |
| **c** | `c = (a × d) / b` |
| **d** | `d = (b × c) / a` |

### 💡 Exemple concret

> 3 cahiers coûtent 7,50 € — combien coûtent 5 cahiers ?

```
 3       5
----- = -----   ⇒   x = (5 × 7,50) / 3 = 12,50 €
7,50     x
```

---

## 🚀 Installation en local

### 📋 Prérequis

- 🌐 Un navigateur web moderne (Chrome, Firefox, Edge, Safari…)
- 🔧 [Git](https://git-scm.com/) (optionnel, pour le clonage)

### 📥 Cloner le dépôt

```bash
git clone https://github.com/christophemarc/Produit_en_croix.git
cd Produit_en_croix
```

> 💡 En SSH :
> ```bash
> git clone git@github.com:christophemarc/Produit_en_croix.git
> ```

### ▶️ Lancer le projet

Ouvrez simplement le fichier `index.html` dans votre navigateur :

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### 🖥️ (Optionnel) Avec un serveur local

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Puis rendez-vous sur 👉 `http://localhost:8000`

### 📦 Sans Git

Cliquez sur **Code → Download ZIP** depuis la page du dépôt, décompressez l'archive et ouvrez `index.html`. 🗂️

---

## 🕹️ Utilisation

1. 📝 Saisissez **trois** des quatre valeurs
2. ⬜ Laissez **vide** le champ à calculer
3. 🖱️ Cliquez sur **Calculer** (ou laissez le calcul se faire automatiquement)
4. ✅ Le résultat s'affiche avec le détail de l'opération
5. 🔄 Utilisez **Réinitialiser** pour recommencer

---

## 📁 Structure du projet

```
Produit_en_croix/
├── index.html      # 🏠 Page principale
├── style.css       # 🎨 Feuille de styles
├── script.js       # ⚙️ Logique de calcul
├── assets/         # 🖼️ Images, icônes, favicon
├── LICENSE         # 📄 Licence MIT
└── README.md       # 📘 Ce fichier
```

---

## 🛠️ Technologies

| Technologie | Rôle |
|:---|:---|
| 🧱 **HTML5** | Structure de la page |
| 🎨 **CSS3** | Mise en forme et responsive design |
| ⚡ **JavaScript (Vanilla)** | Calculs et interactions |
| 🚀 **GitHub Pages** | Hébergement de la démo |

Aucune dépendance, aucun framework, aucun build. 🪶

---

## 🗺️ Évolutions envisagées

- [ ] 🌙 Mode sombre
- [ ] 📊 Calcul de pourcentages et de variations
- [ ] 📜 Historique des calculs
- [ ] 📋 Copie du résultat en un clic
- [ ] 🌍 Version multilingue (FR / EN)
- [ ] 📲 Mode hors-ligne (PWA)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! 🙌

1. 🍴 Forkez le projet
2. 🌿 Créez votre branche : `git checkout -b feature/ma-super-fonctionnalite`
3. 💾 Committez : `git commit -m "Ajout de ma super fonctionnalité"`
4. 📤 Poussez : `git push origin feature/ma-super-fonctionnalite`
5. 🔀 Ouvrez une **Pull Request**

---

## 🐛 Signaler un bug / Suggérer une idée

Ouvrez une **issue** 👉 [https://github.com/christophemarc/Produit_en_croix/issues](https://github.com/christophemarc/Produit_en_croix/issues)

Merci d'indiquer :
- 🧾 La description du problème
- 🔁 Les étapes pour le reproduire
- 🌐 Votre navigateur et votre système d'exploitation

---

## ⚠️ Dépôt renommé

Ce dépôt s'appelle désormais **`Produit_en_croix`**.
Si vous aviez déjà cloné l'ancienne version, mettez à jour la remote :

```bash
git remote set-url origin https://github.com/christophemarc/Produit_en_croix.git
git remote -v
```

---

## 📄 Licence

Distribué sous licence **MIT** 📝 — voir le fichier [LICENSE](LICENSE) pour plus d'informations.

---

## 👤 Auteur

**Christophe Marc** — [@christophemarc](https://github.com/christophemarc)

---

⭐ Si ce projet vous est utile, n'hésitez pas à lui laisser une étoile sur GitHub !
