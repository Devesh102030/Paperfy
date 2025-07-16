<p align="center">
  <img src="./public/icon-removebg-preview.png" alt="Paperfy Logo" width="60" style="margin-right: 10px;">
</p>

<h1 align="center">PAPERFY</h1>
<p align="center"><em>Transforming Research into Instant Insights</em></p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Devesh102030/Paperfy?color=blue" alt="last commit">
  <img src="https://img.shields.io/github/languages/top/Devesh102030/Paperfy?color=yellow" alt="Top Language">
  <img src="https://img.shields.io/github/languages/count/Devesh102030/Paperfy?color=green" alt="Languages Count">
</p>

---

### 🛠 Built with the tools and technologies:

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cohere_API-000000?style=for-the-badge&logo=cohere&logoColor=white"/>
  <img src="https://img.shields.io/badge/UploadThing-F582AE?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/LangChain-000000?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge"/>
</p>

---

## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Paperfy** is an AI-powered research assistant that allows users to:
- Upload academic PDFs
- Instantly get AI-generated summaries
- Chat with the paper (ask questions, clarify ideas)
- Take and organize notes
- View recent uploads and paper history

---

## Tech Stack

| Category     | Tech Stack |
|--------------|------------|
| **Frontend** | React, Next.js, Tailwind CSS |
| **Backend**  | Node.js, Next.js API Routes |
| **Database** | PostgreSQL with Prisma ORM |
| **AI/LLM**   | Gemini API (Google), Cohere (Embeddings) |
| **Storage**  | UploadThing |
| **Caching/Jobs** | Redis (as a worker or cache layer) |
| **Dev Tools**| TypeScript, Docker |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL
- Redis (used for background jobs or caching)
- Gemini API Key (for AI responses)
- Cohere API Key (for text embeddings)
- UploadThing API (or similar for PDF uploads)
- .env file with all required keys (see `.env.example`)

### 🛠 Installation

Follow these steps to set up the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/Devesh102030/Paperfy
cd paperfy

# 2. Install dependencies
npm install

# 3. Set up your environment variables
cp .env.example .env
# Then fill in the .env with your keys and DB credentials

# 4. Set up the database with Prisma
npx prisma generate
npx prisma db push

# 5. Run Redis (if not already running)
# Example using Docker (optional):
docker run -p 6379:6379 redis

# 6. Start the development server
npm run dev

# App will be available at:
# http://localhost:3000

