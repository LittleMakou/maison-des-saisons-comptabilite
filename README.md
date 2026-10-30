# La Maison des Saisons — socle V1.1

Application de gestion financière multi-entreprises en cours de développement.

## Stack prévue
- React + Vite pour l'interface web
- Supabase Auth, PostgreSQL et Storage pour les données centralisées
- Tauri 2 prévu pour les applications macOS et Windows

## Fonctionnalités du socle
- Modèle de données multi-entreprises avec rôles et séparation RLS
- Gestion des justificatifs fournisseurs avec validation humaine prévue
- Calcul exact de trésorerie en centimes entiers
- Comptes bancaires, suivi de TVA, réserves et identité visuelle par entreprise

## Installation locale
```bash
npm install
cp .env.example .env.local
npm run dev
```
Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env.local` après création du projet Supabase.

## Base de données
Sur un projet Supabase neuf et dédié :
1. Exécuter `supabase/schema.sql`.
2. Exécuter ensuite `supabase/migrations/002_treasury_branding.sql`.

Ne jamais intégrer la clé `service_role` au frontend. Vérifier les politiques RLS et les sauvegardes avant toute donnée comptable réelle.

## Tests
```bash
npm test
npm run build
```
Les tests unitaires du moteur de trésorerie sont inclus. Le build doit être confirmé dans un environnement où les dépendances npm sont installées.

## Publication continue
Le dépôt est destiné à être connecté à Netlify sur la branche `main`, avec commande `npm run build` et répertoire de publication `dist`. Les secrets Supabase se configurent dans les variables d'environnement du site Netlify, jamais dans Git.

## Périmètre et limites
Ce dépôt est un socle technique, pas encore un logiciel comptable final ni une application desktop distribuable. L'interface hors ligne, la synchronisation, les mises à jour Tauri, l'OCR et le moteur complet de TVA restent à développer et valider.