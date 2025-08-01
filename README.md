# 🚀 BattleWorld - AI-Powered Interview Platform

A cutting-edge interview platform that combines AI-powered assessments, real-time video conferencing, and comprehensive candidate management. Built with Next.js, Convex, and Stream for seamless hiring experiences.

![BattleWorld](https://img.shields.io/badge/BattleWorld-DOOM-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black)
![Convex](https://img.shields.io/badge/Convex-1.25.4-blue)
![Stream](https://img.shields.io/badge/Stream-Video-orange)

## 🌟 Features

### 🎯 Core Functionality
- **AI-Powered Interviews**: Conduct intelligent interviews with real-time assessment
- **Video Conferencing**: High-quality video calls powered by Stream
- **Real-time Chat**: Instant messaging between candidates and interviewers
- **Job Management**: Post, manage, and track job applications
- **Candidate Dashboard**: Comprehensive candidate profiles and tracking
- **Interview Scheduling**: Automated scheduling with email notifications
- **Resume Management**: Upload and review candidate resumes
- **Code Editor**: Built-in code editor for technical assessments

### 👥 User Roles
- **Candidates**: Apply for jobs, participate in interviews, manage profiles
- **Interviewers**: Post jobs, conduct interviews, review candidates
- **Admin**: Oversee all platform activities and manage users

### 🎨 UI/UX Features
- **Dark Theme**: Modern dark interface with green accent colors
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Framer Motion powered interactions
- **Real-time Updates**: Live data synchronization across all components

## 🛠 Tech Stack

### Frontend
- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components

### Backend & Database
- **Convex** - Backend-as-a-Service with real-time database
- **Clerk** - Authentication and user management
- **Stream** - Video calling and chat functionality

### Additional Libraries
- **Monaco Editor** - Code editor for technical assessments
- **React Three Fiber** - 3D graphics and animations
- **Nodemailer** - Email functionality
- **Date-fns** - Date manipulation
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
doom/
├── convex/                 # Backend functions and database schema
│   ├── _generated/        # Auto-generated Convex types
│   ├── applications.ts    # Application management
│   ├── auth.config.ts     # Authentication configuration
│   ├── chatPermissions.ts # Chat access control
│   ├── comments.ts        # Interview feedback
│   ├── dashboard.ts       # Dashboard analytics
│   ├── email.ts          # Email functionality
│   ├── interviews.ts     # Interview management
│   ├── jobs.ts           # Job posting and management
│   ├── resume.ts         # Resume handling
│   ├── schema.ts         # Database schema
│   ├── stream.ts         # Stream integration
│   └── users.ts          # User management
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (admin)/      # Admin dashboard routes
│   │   ├── (auth)/       # Authentication routes
│   │   ├── (home)/       # Landing page
│   │   ├── (root)/       # Root layout
│   │   ├── api/          # API routes
│   │   ├── applications/ # Application pages
│   │   ├── arena/        # Interview arena
│   │   ├── chat/         # Chat functionality
│   │   ├── jobs/         # Job listings
│   │   ├── meeting/      # Video meeting rooms
│   │   ├── profile/      # User profiles
│   │   ├── recordings/   # Interview recordings
│   │   └── schedule/     # Interview scheduling
│   ├── components/       # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   ├── chat/         # Chat components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── home/         # Home page components
│   │   ├── interview/    # Interview components
│   │   ├── jobs/         # Job-related components
│   │   ├── meeting/      # Meeting room components
│   │   ├── profile/      # Profile components
│   │   ├── resume/       # Resume components
│   │   ├── shared/       # Shared UI components
│   │   └── ui/           # Base UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   └── providers/        # Context providers
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Convex account
- Clerk account
- Stream account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doom
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Convex Backend
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   
   # Stream Video & Chat
   NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET_KEY=your_stream_secret_key
   
   # Email (Optional)
   EMAIL_SERVER_HOST=your_email_host
   EMAIL_SERVER_PORT=your_email_port
   EMAIL_SERVER_USER=your_email_user
   EMAIL_SERVER_PASSWORD=your_email_password
   ```

4. **Setup Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Clerk Authentication
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable and secret keys to `.env.local`

### Convex Backend
1. Create a Convex account at [convex.dev](https://convex.dev)
2. Create a new project
3. Run `npx convex dev` to deploy your functions
4. Copy your Convex URL to `.env.local`

### Stream Video & Chat
1. Create a Stream account at [getstream.io](https://getstream.io)
2. Create a new app for video calling
3. Copy your API key and secret to `.env.local`

## 📱 Usage

### For Candidates
1. **Sign up/Login** - Create an account or sign in
2. **Complete Profile** - Fill in your candidate profile with skills and experience
3. **Browse Jobs** - View available positions and apply
4. **Participate in Interviews** - Join scheduled interviews via video call
5. **Chat with Interviewers** - Communicate through the built-in chat system

### For Interviewers
1. **Access Dashboard** - View your command interface
2. **Post Jobs** - Create new job listings
3. **Review Applications** - Manage incoming applications
4. **Schedule Interviews** - Set up interview sessions
5. **Conduct Interviews** - Use the video meeting room with code editor
6. **Provide Feedback** - Leave comments and ratings

### For Admins
1. **Monitor Activity** - Track all platform usage
2. **Manage Users** - Oversee user accounts and permissions
3. **System Analytics** - View platform statistics and performance

## 🎯 Key Features Explained

### AI-Powered Interviews
- Real-time assessment during video calls
- Code editor integration for technical evaluations
- Automated scoring and feedback generation

### Real-time Collaboration
- Live video conferencing with screen sharing
- Instant messaging between participants
- Collaborative code editing

### Smart Job Management
- Automated application tracking
- Shortlisting and rejection workflows
- Email notifications for all parties

### Comprehensive Analytics
- Interview performance metrics
- Candidate evaluation tracking
- Platform usage statistics

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Convex](https://convex.dev/) for the real-time backend
- [Clerk](https://clerk.com/) for authentication
- [Stream](https://getstream.io/) for video and chat functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

---

**Built with ❤️ for the future of hiring**
