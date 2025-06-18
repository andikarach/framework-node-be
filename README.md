# 🧠 API Generator

This is an automatic generator system to speed up API development. By simply listing the entities, you can instantly generate:

- Controller
- Router
- Model
- API Doc
- Index Route

---

## 🏗️ Struktur Utama

- `/generator`
  - `entities.json` – List Entity / Module / Menu
  - `generate-controller.js`
  - `generate-docs.js`
  - `generate-routes.js`
- `/controllers` – controller
- `/moodels` - model
- `/routes` – router & indexRoutes.js
- `/docs` – dokumentasi OpenAPI per entity

---

## ✅ How to use

### 1. Define Entity

Change file `generator/entities.json`:

```json
[
  "category",
  "menu",
  "product",
  "product-detail",
  "role"
]

```

Use kebab-case for names that consist of two or more words.

### 2. Run Generator

npm run generator

This will:

- Generate controller files in the controllers/ directory
- Generate model files in the models/ directory
- Generate API documentation files in the docs/ directory
- Generate API router files in the routes/ directory
- Generate indexRoutes.js based on all router files

### 3. Use indexRoutes in app.js
const indexRoutes = require('./routes/indexRoutes');
app.use('/api', indexRoutes);

This registers all the routers and combines them in routes/indexRoutes.js.

## 🔄  Add new Entity ?

### 1. Add it to entities.json

### 2. Re-run npm run generator

### 3. Done — all necessary files will be automatically generated


## 🧹  Reset File Generator
For each entity in entities.json, the cleanup will delete it — except for `indexRoutes`, which is generated and will not be cleaned up.

controllers/<Entity>Controller.js
models/<Entity>Models.js
routes/<entity>Router.js
docs/<Entity>Docs.js

### 1. Jalankan Cleanup

npm run generate-clear


```
WARNING !!!

Please do not push the generated files back to the origin repository after using them in your project.
```