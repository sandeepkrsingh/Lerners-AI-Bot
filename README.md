# Learner Assistance Autobot

An intelligent AI-powered learning assistant chatbot built with Next.js, featuring user authentication, real-time chat functionality, and an admin panel for monitoring all conversations.

## Features

- 🤖 **AI-Powered Chatbot** - Intelligent responses to learner questions (placeholder ready for AI integration)
- 🔐 **User Authentication** - Secure login and signup with NextAuth.js
- 💬 **Chat History** - All conversations are saved and accessible
- 👨‍💼 **Admin Panel** - Monitor all users and chat conversations
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS and UMI icons
- 📱 **Responsive** - Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Icons**: @iconify/react (UMI icons)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ANTI
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
Copy `.env.local.example` to `.env.local` and update the values:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/learner-autobot
NEXTAUTH_SECRET=your-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Creating an Admin User

To create an admin user, you can either:
1. Register normally and manually update the role in MongoDB
2. Use MongoDB Compass or mongosh to update a user:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure

```
ANTI/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # Chat endpoints
│   │   └── admin/        # Admin endpoints
│   ├── admin/            # Admin panel page
│   ├── chat/             # Chat interface page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── providers.tsx     # Session provider
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   └── db.ts             # MongoDB connection
├── models/
│   ├── User.ts           # User model
│   └── Chat.ts           # Chat model
└── middleware.ts         # Route protection
```

## Features in Detail

### Landing Page
- Hero section with call-to-action
- Features showcase
- How it works section
- Responsive footer

### Authentication
- Email/password based signup and login
- Password hashing with bcryptjs
- Session management with NextAuth.js
- Role-based access control (user/admin)

### Chat Interface
- Real-time messaging experience
- Auto-scroll to latest messages
- Message history stored in database
- Placeholder for AI integration

### Admin Panel
- View all registered users
- Monitor all chat conversations
- Search and filter functionality
- View chat details in modal
- Statistics dashboard

## AI Integration

The chatbot currently uses a placeholder AI function. To integrate a real AI service:

1. Install your preferred AI SDK (e.g., OpenAI, Google Gemini)
```bash
npm install openai
# or
npm install @google/generative-ai
```

2. Update `app/api/chat/[id]/route.ts` and replace the `generateAIResponse` function

Example for OpenAI:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAIResponse(userMessage: string, history: any[]): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful learning assistant." },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userMessage }
    ],
  });
  
  return completion.choices[0].message.content || "Sorry, I couldn't generate a response.";
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

Make sure to:
1. Set all environment variables
2. Use MongoDB Atlas for production database
3. Generate a strong `NEXTAUTH_SECRET`

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
