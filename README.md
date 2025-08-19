# 🌟 Digital Ecosystem Garden

A living world of AI-generated digital beings that interact, build, and evolve in real-time. Create unique creatures through donations and watch them develop personalities, relationships, and behaviors in a dynamic ecosystem.

![Digital Ecosystem Garden](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Digital+Ecosystem+Garden)

## ✨ Features

### 🤖 AI-Powered Creatures
- **Unique Generation**: Each being is created by GPT-4 with distinct personalities, appearances, and traits
- **Procedural Graphics**: Canvas-based sprites with dynamic features like glowing eyes, crystal spikes, and energy auras
- **Autonomous Behavior**: Creatures explore, build, socialize, and rest based on their AI-generated personalities

### 🎮 Interactive Ecosystem
- **Real-time Simulation**: 60fps canvas rendering with smooth animations
- **Behavioral AI**: State-based system where creatures make decisions based on personality traits
- **Social Dynamics**: Beings form relationships and interact with nearby creatures
- **Zoom & Pan**: Explore the ecosystem with mouse controls

### 💰 Donation-Based Economy
- **$1 Minimum**: Create a unique digital being
- **$2+ Donations**: Gain influence over ecosystem events
- **Stripe Integration**: Secure payment processing
- **Instant Creation**: Beings appear in the ecosystem after payment confirmation

### 🚀 Modern Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Appwrite (Database, Auth, Storage)
- **AI**: OpenAI GPT-4 for creature generation
- **Payments**: Stripe for secure donations
- **State**: Zustand + React Query for optimal performance
- **Real-time**: Appwrite Realtime for live updates

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Appwrite account (free at https://cloud.appwrite.io/)
- OpenAI API key with GPT-4 access
- Stripe account for payment processing

### 1. Clone and Install
```bash
git clone <repository-url>
cd digital-ecosystem-garden
npm install
```

### 2. Environment Configuration
```bash
cp .env.local .env.local
# Edit .env.local with your API keys (see detailed comments in the file)
```

### 3. Appwrite Setup
1. Create a new project at https://cloud.appwrite.io/
2. Create a database with these collections:
   - `entities` - stores digital beings
   - `structures` - ecosystem buildings (future feature)
   - `donations` - payment tracking
3. Copy the project ID, database ID, and collection IDs to your `.env.local`

### 4. Stripe Setup
1. Get API keys from https://dashboard.stripe.com/
2. Configure webhook endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Set webhook to listen for `checkout.session.completed` events
4. Copy webhook secret to `.env.local`

### 5. OpenAI Setup
1. Get API key from https://platform.openai.com/api-keys
2. Ensure GPT-4 access for best creature generation
3. Add key to `.env.local`

### 6. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your ecosystem!

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   ├── EcosystemCanvas.tsx      # Main canvas component
│   ├── DonationModal.tsx        # Payment interface
│   └── canvas/
│       └── EntityRenderer.ts    # Advanced sprite rendering
├── lib/
│   ├── appwrite.ts             # Database configuration
│   ├── ai-generator.ts         # OpenAI integration
│   ├── behavior-engine.ts      # Creature AI behaviors
│   └── stripe.ts               # Payment processing
├── hooks/
│   └── useEntities.ts          # React Query hooks
└── store/
    └── useEcosystemStore.ts    # Zustand state management
```

### API Routes
- `POST /api/create-checkout` - Create Stripe payment session
- `POST /api/webhook/stripe` - Handle payment confirmations

### Database Schema
```typescript
// Entities Collection
interface Entity {
  id: string;
  name: string;
  donorEmail: string;
  species: string;
  personality: {
    traits: string[];
    energy: number; // 0-100
  };
  appearance: {
    color: string;
    size: number; // 0.5-2.0
    shape: 'circle' | 'triangle' | 'hexagon' | 'diamond' | 'star';
    features: string[]; // e.g., ['glowing_eyes', 'crystal_spikes']
  };
  position: { x: number; y: number };
  status: 'exploring' | 'building' | 'socializing' | 'resting';
  relationships: string[]; // entity IDs
  createdAt: string;
  lastActive: string;
}
```

## 🎨 Visual Features

### Procedural Sprites
Each creature is rendered with:
- **Base Shapes**: Circle, triangle, hexagon, diamond, or star
- **Color Gradients**: Dynamic coloring based on personality
- **Special Features**: 
  - Glowing eyes with pulsing animation
  - Crystal spikes extending from the body
  - Energy auras with transparency effects
  - Particle trails that follow movement
  - Geometric patterns within the shape
  - Flowing tendrils with wave motion
  - Rotating symbols orbiting the creature

### Animation System
- **60fps Rendering**: Smooth real-time animations
- **Personality Effects**: 
  - Creative beings slowly rotate
  - Energetic beings vibrate
  - Social beings pulse in size
  - Curious beings have glowing auras
- **Movement AI**: Creatures move based on their current behavior state

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow the existing component patterns
- Add comments for complex AI/graphics logic
- Test payment flows with Stripe test mode

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Configure Stripe webhook URL with your production domain
4. Deploy!

### Environment Variables for Production
```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
# ... (copy all variables from .env.local with production values)
```

## 📈 Roadmap

### Phase 1: MVP (Current) ✅
- [x] AI creature generation with OpenAI
- [x] Procedural sprite rendering
- [x] Basic behavior simulation
- [x] Stripe donation system
- [x] Real-time ecosystem updates

### Phase 2: Enhanced Visuals 🎨
- [ ] Professional sprite assets
- [ ] Advanced particle effects
- [ ] WebGL shaders for premium effects
- [ ] Smooth animation transitions

### Phase 3: Advanced Features 🏗️
- [ ] Building construction system
- [ ] Ecosystem events and evolution
- [ ] Creature breeding/evolution
- [ ] Mobile companion app
- [ ] Admin dashboard for ecosystem management

### Phase 4: Community 👥
- [ ] User accounts and creature ownership
- [ ] Social features and leaderboards
- [ ] Custom creature naming
- [ ] Ecosystem influence voting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 creature generation
- **Appwrite** for backend infrastructure
- **Stripe** for secure payment processing
- **Next.js team** for the amazing framework
- **Zustand & React Query** for state management excellence

---

**Created with ❤️ by the Digital Ecosystem Garden team**

*Turn your donations into digital life - watch AI-generated beings explore, interact, and evolve in real-time!*
