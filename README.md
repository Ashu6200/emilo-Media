# Setup — Run the project (Client + Server)

Minimal, step-by-step instructions to get the app running locally. Client and server are separate Node projects (each with its own package.json).

## 1) Prerequisites

- **Node.js 18+** and npm (or yarn/pnpm)
- **MongoDB** (local mongod or MongoDB Atlas connection string)
- **Storage** Cloudinary account if the app uses external media storage, otherwise local storage is used

## 2) Clone repository

```bash
git clone <REPO_URL>
cd <repo-folder>
```

## 3) Server — install, env, seed, run (development)

Open a terminal, go to server folder:

Open a terminal, go to client folder:
```bash
cd server
```
Install dependencies:
```bash
npm install --leagay-peer-deps
```
Create environment file:
```bash
cp .env.example .env
```
Edit server/.env and set at minimum:
```bash
ENV= "development"
PORT= "8088"
SERVER_URL= ""
MONGOODB_URL= 
ORIGIN= 
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY= 
CLOUDINARY_API_SECRET= Vba9Yl0-
```
```bash
npm run dev
```

## 4) Client — install, env, run (development)
Open a terminal, go to client folder:

Open a terminal, go to client folder:
```bash
cd client
```
Install dependencies:
```bash
npm install 
```
Create environment file:
```bash
cp .env.example .env
```
Edit client/.env and set at minimum:
```bash
VITE_API_URL=
```
Run the client (Vite):
```bash
npm run dev
```
## 5) Quick dev flow (two terminals)
Terminal A (server):
```bash
cd server
npm install
cp .env.example .env   # edit .env
npm run dev
```
Terminal B (server):
```bash
cd client
npm install
cp .env.example .env   # edit .env
npm run dev
```
