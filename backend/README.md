# Taekwando API

## Base URL

```
http://localhost:3000
```

## Authentification

Les routes protégées nécessitent un header Clerk :

```
Authorization: Bearer <clerk_session_token>
```

---

## Health

| Méthode | URL       | Auth | Description                   |
| ------- | --------- | ---- | ----------------------------- |
| `GET`   | `/health` | ❌   | Vérifie que le serveur tourne |

---

## Users `/users`

| Méthode  | URL           | Auth | Body                                                | Description                                 |
| -------- | ------------- | ---- | --------------------------------------------------- | ------------------------------------------- |
| `POST`   | `/users/sync` | ✅   | `{ "displayName": "..." }`                          | Crée l'utilisateur s'il n'existe pas encore |
| `GET`    | `/users`      | ✅   | -                                                   | Récupère l'utilisateur connecté             |
| `PATCH`  | `/users`      | ✅   | `{ "displayName": "...", "level": 1, "goals": [] }` | Met à jour l'utilisateur                    |
| `DELETE` | `/users`      | ✅   | -                                                   | Supprime l'utilisateur                      |

> **Important** : appeler `POST /users/sync` en premier avant toute autre route users.

---

## Exercises `/exercises`

| Méthode | URL                | Auth | Description                       |
| ------- | ------------------ | ---- | --------------------------------- |
| `GET`   | `/exercises`       | ❌   | Récupère tous les exercices       |
| `GET`   | `/exercises/:slug` | ❌   | Récupère un exercice par son slug |

---

## Playlists `/playlists`

| Méthode  | URL                                    | Auth | Body                                                         | Description                                    |
| -------- | -------------------------------------- | ---- | ------------------------------------------------------------ | ---------------------------------------------- |
| `POST`   | `/playlists`                           | ✅   | `{ "name": "...", "description": "...", "isPublic": false }` | Crée une playlist                              |
| `GET`    | `/playlists`                           | ✅   | -                                                            | Récupère toutes les playlists de l'utilisateur |
| `GET`    | `/playlists/:id`                       | ✅   | -                                                            | Récupère une playlist par son id               |
| `PATCH`  | `/playlists/:id`                       | ✅   | `{ "name": "...", "isPublic": true }`                        | Met à jour une playlist                        |
| `DELETE` | `/playlists/:id`                       | ✅   | -                                                            | Supprime une playlist                          |
| `POST`   | `/playlists/:id/exercises`             | ✅   | `{ "exerciseId": "...", "order": 1 }`                        | Ajoute un exercice à la playlist               |
| `DELETE` | `/playlists/:id/exercises/:exerciseId` | ✅   | -                                                            | Retire un exercice de la playlist              |

---

## Sessions `/sessions`

| Méthode  | URL             | Auth | Body              | Description                                   |
| -------- | --------------- | ---- | ----------------- | --------------------------------------------- |
| `POST`   | `/sessions`     | ✅   | voir ci-dessous   | Crée une session                              |
| `GET`    | `/sessions`     | ✅   | -                 | Récupère toutes les sessions de l'utilisateur |
| `GET`    | `/sessions/:id` | ✅   | -                 | Récupère une session par son id               |
| `PATCH`  | `/sessions/:id` | ✅   | champs à modifier | Met à jour une session                        |
| `DELETE` | `/sessions/:id` | ✅   | -                 | Supprime une session                          |

### Body `POST /sessions`

```json
{
  "performedAt": "2026-03-09T10:00:00Z",
  "durationSec": 3600,
  "items": [
    {
      "exerciseId": "<id_exercise>",
      "completed": true,
      "repsDone": 10,
      "workSecDone": 60,
      "rpe": 7,
      "pain": {
        "hip": 0,
        "knee": 0,
        "lowerBack": 0
      }
    }
  ]
}
```

---

## Documentation Swagger

```
http://localhost:3000/api-docs
```
