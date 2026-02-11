# Calculateur Taille d'Impression

## Description

Application web interactive permettant aux photographes de déterminer la **taille maximale d'impression possible** en fonction du nombre de mégapixels de leur appareil photo et de la qualité d'impression souhaitée (mesurée en DPI).

## Stack Technique

- **Framework** : React 18 + TypeScript
- **UI** : Chakra UI 2.8
- **Build** : Vite 5
- **Animations** : Framer Motion

## Structure du Projet

```
src/
├── App.tsx          # Composant principal (toute la logique métier)
├── main.tsx         # Point d'entrée React
└── index.css        # Styles globaux
```

## Fonctionnalités

- Base de données de 20+ appareils photo (Canon, Sony, Nikon, Fujifilm, iPhones, Samsung)
- 4 niveaux de qualité d'impression (Excellente 300 DPI, Très bonne 200 DPI, Bonne 150 DPI, Acceptable 100 DPI)
- 8 formats d'impression standards (10x15 à 70x100 cm)
- Conversion mégapixels → pixels (ratio 3:2)
- Tableau de compatibilité format/qualité

## Commandes

```bash
npm install    # Installer les dépendances
npm run dev    # Lancer en développement (http://localhost:5173)
npm run build  # Build de production
npm run preview # Prévisualiser le build
```

## Formules Utilisées

- **Pixels totaux** : `megapixels × 1,000,000`
- **Dimensions pixels** : ratio 3:2 (width = √(pixels × 1.5), height = width / 1.5)
- **Dimension max impression** : `pixels / DPI × 2.54` (conversion pouces → cm)

## Charte Graphique

- Couleur primaire : `#FB9936` (orange)
- Couleur secondaire : `#212E40` (bleu foncé)
- Background clair : `#EFF7FB`

## Notes de Développement

- Application monolithique (tout dans App.tsx)
- Design responsive avec `useBreakpointValue`
- Pas de state management externe (useState uniquement)
- Base path Vite : `/calculateur-impression_A.P/`
