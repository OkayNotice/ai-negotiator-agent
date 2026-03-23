# 🤝 ANCI: Conversational Commerce Engine

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Groq](https://img.shields.io/badge/AI-Llama_3.3_70B-orange?style=for-the-badge)

ANCI is an Enterprise-grade B2B SaaS platform that allows merchants to integrate an AI negotiator into their e-commerce stores. 

Instead of losing sales to fixed prices, ANCI empowers an AI agent to dynamically haggle with customers in real-time, optimizing for the highest possible profit margin while respecting strictly enforced mathematical guardrails.

## ✨ Core Features

* **🧠 Strict Mathematical Guardrails:** The AI is strictly programmed to never hallucinate or reveal the hidden floor price. It gradually steps down from the ceiling price and rejects lowball offers with firm counter-offers.
* **🛡️ Just-In-Time Vault Architecture:** Merchants **do not** need to sync their product databases with ANCI. They simply ping the API to create a secure, temporary session vault at the moment of negotiation.
* **🔐 Secure Multi-Tenant API:** Includes a full Developer Portal where B2B clients can register, generate secure `anci_live_` API keys, and track their API credit usage.
* **🛒 Checkout Handoff:** The embeddable Chat Widget uses `postMessage` events to broadcast the final negotiated price back to the merchant's host website (e.g., Shopify, custom React app) to finalize checkout.
* **📊 Real-Time Dashboard:** Logged-in merchants can view their live negotiation history, active deals, and closed-won prices.

## 🏗️ Architecture Flow

1. **The Click:** A user clicks "Negotiate" on the Merchant's website.
2. **The Handshake:** The Merchant's backend silently calls `POST /api/sessions/create` with their secret API key, floor price, and ceiling price.
3. **The Vault:** ANCI securely locks the prices in Firebase and returns a random `sessionId`.
4. **The Haggle:** The frontend Chat Widget uses *only* the `sessionId` to negotiate. The secret floor price never touches the client's browser.
5. **The Handoff:** Upon agreement, the widget emits an `ANCI_DEAL_CLOSED` event, and the merchant updates their cart with the new price.

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js 18+
* A Firebase Project (with Firestore and Authentication enabled)
* A Groq API Key

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/ai-negotiator-agent.git](https://github.com/YOUR_GITHUB_USERNAME/ai-negotiator-agent.git)
cd ai-negotiator-agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# AI Provider
GROQ_API_KEY=your_groq_api_key

# Firebase Admin (Backend/Database)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"

# Firebase Client (Frontend Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_public_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser to see the live storefront and chat widget.

## 📂 Project Structure

* `/src/app/page.tsx`: The main landing page and interactive demo.
* `/src/app/developer`: The B2B Merchant Dashboard (Auth, API Key generation, Negotiation History).
* `/src/app/docs`: Comprehensive API documentation for integrating the widget.
* `/src/app/api/negotiate`: The AI Brain (Llama 3.3 via Groq) and mathematical guardrails.
* `/src/app/api/sessions`: Endpoints for the Just-In-Time vault architecture.
* `/src/components/ChatWidget.tsx`: The embeddable frontend negotiation UI.

## 🔒 Security Notes
* Never expose your `anci_live_` API key in frontend code. It is for Server-to-Server communication only.
* Ensure your `FIREBASE_PRIVATE_KEY` formatting is correct in Vercel (use literal newlines or handle string replacement in your config).

## 📄 License
MIT License. See the `LICENSE` file for more information.
