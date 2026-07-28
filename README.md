
<h1 align="center">
  BotX 🤖
</h1>

<p align="center">
  <strong>A Full-Stack, Cloud-Native AI Chatbot with a Neobrutalist UI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Database-MongoDB-success?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-NVIDIA_NIM-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA NIM" />
  <img src="https://img.shields.io/badge/Cloud-AWS_EKS-FF9900?style=for-the-badge&logo=amazonaws" alt="AWS K8s" />
  <img src="https://img.shields.io/badge/CI%2FCD-Jenkins-D24939?style=for-the-badge&logo=jenkins" alt="Jenkins" />
</p>

---

## Overview

**BotX** is an end-to-end, highly scalable AI chatbot application. It features a striking Neobrutalism user interface on the frontend and a robust microservices architecture on the backend. The AI generation is powered by the OpenAI Node SDK configured to interface with **NVIDIA NIM (Cloud Functions)**.

This project was built to demonstrate modern DevOps and Cloud-Native practices, featuring a fully automated CI/CD pipeline using **Jenkins**, containerization via **Docker**, and orchestration on **AWS Elastic Kubernetes Service (EKS)**.

## Architecture Flow

1. **User Interface (Vercel):** Users interact with the React frontend.
2. **Proxy Rewrite:** Vercel securely proxies `/api` requests to bypass Mixed Content restrictions (HTTPS -> HTTP).
3. **AWS Load Balancer:** An internet-facing AWS Classic/Application Load Balancer receives the traffic on Port 80.
4. **Kubernetes (AWS EKS):** The LB routes traffic to Pods running the Node.js backend on Port 3000.
5. **Database & AI:** The backend asynchronously logs data to **MongoDB Atlas** and streams responses from the **NVIDIA NIM API**.

---

## Technology Stack

### Frontend
* **Framework:** React.js
* **Styling:** Tailwind CSS (Custom Neobrutalism design)
* **Networking:** Axios
* **Hosting:** Vercel

### Backend
* **Runtime:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **AI Integration:** OpenAI Node.js SDK (configured for NVIDIA endpoints)

### Infrastructure & DevOps
* **Containerization:** Docker, Amazon Elastic Container Registry (ECR)
* **Orchestration:** Kubernetes (AWS EKS)
* **CI/CD:** Jenkins
* **Networking:** AWS VPC (Public/Private Subnets), AWS Load Balancers

---

## Getting Started (Local Development)

### Prerequisites
* Node.js (v18+)
* Docker (optional, for local container testing)
* MongoDB Atlas Cluster URI
* NVIDIA NIM API Key (or OpenAI API Key)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend folder:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/botx
   OPENAI_API_KEY=sk-proj-... # Your NVIDIA NIM or OpenAI Key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the API endpoint in `Bot.jsx` for local testing (`http://localhost:3000/bot/v1/message`).
4. Start the React app:
   ```bash
   npm run dev
   ```

---

## ☁️ Cloud Deployment Guide (AWS EKS & Vercel)

### 1. Kubernetes Secrets
Do not hardcode API keys or Database URIs in your deployment YAMLs. Inject them securely into EKS:
```bash
kubectl create secret generic app-secrets   --from-literal=OPENAI_API_KEY="your-api-key"   --from-literal=MONGO_URI="your-mongodb-uri"
```

### 2. Kubernetes Deployment & Service
Apply the backend configuration to provision the Pods and the AWS Internet-Facing Load Balancer:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```
*(Ensure your `service.yaml` includes the annotation: `service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"`)*

### 3. Frontend Vercel Proxy Setup
To connect a secure Vercel frontend (`https://`) to an unsecure AWS Load Balancer (`http://`), use a `vercel.json` file in the root of your frontend repository:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://<YOUR_AWS_LOAD_BALANCER_URL>/:path*"
    }
  ]
}
```
Update all API calls in React to hit the relative `/api` path (e.g., `axios.post("/api/bot/v1/message")`). Push to GitHub, and Vercel will auto-deploy.

---

## 🐛 Troubleshooting
 
* **500 Internal Server Error (MongoDB / OPEN_AI_api):** Make sure the api keys are  correctly injected from Kubernetes Secrets into your pod environments.
* **503 ResourceExhausted:** NVIDIA NIM free tier limits reached. Wait for a few seconds or if u want u can add a retry loop in your Node.js controller with a 2-3 second delay.

---

<p align="center">
  <i>Built with passion and deployed to the cloud. ☁️</i>
</p>
