# EcoLens - ClimateTech Intelligence Dashboard

> **Discover, track, and compare climate-tech funding globally**

*By Ethan Davey & Ariel Chen*

EcoLens is a comprehensive intelligence dashboard that makes climate-tech funding data clear, connected, and actionable. Our mission is to help startups quickly find the right investors and funding opportunities.

![EcoLens Banner](./attached_assets/earth-climate-image.png)

*The leaves lift away to show how EcoLens clears the fuzz from climate funding data, making your next investor easy to spot.*

---

## 🌍 The Problem We Solve

Climate tech founders face these critical challenges:

### 🔍 **Fragmented Data**
- No single source of truth in climate-tech funding
- Information scattered across news articles, databases, and LinkedIn
- Hours spent researching what should take minutes

### 📊 **Missing Industry Insights** 
- Can't see who's investing where, in what stage, or in what sector
- Geographic funding patterns are hard to identify
- Trend analysis requires manual work across multiple sources

### 🎯 **Missed Investor Matches**
- Startups struggle to find aligned investors quickly  
- Risk missing the best funding opportunities
- No easy way to compare investor preferences and activity

### 🗺️ **No Global Picture**
- Geographic funding hotspots are invisible
- Regional investment patterns unclear
- Can't identify emerging markets or opportunities

---

## ✨ Our Solution

**One platform to solve it all:**

🔍 **Search all climate funding events in one place**  
🎛️ **Filter by sector, stage, country, tags, date range**  
⚖️ **Compare any two investors side-by-side**  
🌍 **Explore global hotspots on an interactive map**

---

## 🚀 Key Features

### 🏷️ **Tag-Based Search**
- Find funding events by specific climate tech focus
- Advanced filtering with multiple criteria
- One-click "Clear All" filters for fast iteration

### ⚖️ **Investor Comparison** 
- See two investors' timelines, totals, and recent deals
- Direct side-by-side analysis
- Historical performance tracking

### 🗺️ **Interactive Global Map**
- Click on countries to see total funding and top investors
- Discover emerging funding hotspots
- Visualize geographic investment patterns

### 🎨 **Clean, Green-Themed UX**
- Simple and fast interface
- Intuitive navigation designed for founders
- Professional design that scales

---

## 🛠️ Technical Architecture

### **Frontend**
- **React** + **TypeScript** for type safety
- **Vite** for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **TanStack Query** for powerful data fetching and caching

### **Backend** 
- **Node.js/Express** with **TypeScript**
- **SQL** database with **Drizzle ORM** for type-safe queries
- **Supabase** for database hosting and real-time features
- **Data enrichment scripts** for automated data processing

### **Infrastructure**
- Modern, type-safe tech stack for speed and stability
- Normalized funding event data pipeline  
- Snappy, intuitive UX optimized for founder workflows

---

## 🎯 Demo Highlights

### 1. **Advanced Filtering**
Filter funding events by tags and multiple criteria simultaneously

### 2. **Investor Comparison**
Compare two investors' activity and performance in real-time

### 3. **Global Map Exploration** 
Discover funding hotspots and regional investment patterns

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn** 
- **Supabase** account and project

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd ClimateTech
npm install
```

### 2. Environment Setup
Create a `.env` file:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration  
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_DB_URL="https://[PROJECT-REF].supabase.co"

# API Keys
GOOGLE_API_KEY="your-google-api-key"
INTERNAL_PIPELINE_KEY="your-secret-pipeline-key"
```

### 3. Database & Launch
```bash
npm run db:push    # Push database schema
npm run dev        # Start development server
```

Visit `http://localhost:5001` - **EcoLens is ready!**

---

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:seed      # Seed with sample data

# Data Pipeline
npm run scrape       # Run data enrichment scripts
npm run check        # TypeScript type checking
```

---

## 🔧 Challenges & Learnings

Our journey building EcoLens taught us valuable lessons:

### 🐛 **UI Stability Improvements**
- Fixed filter clearing and dropdown issues
- Polished "More Filters" UX for better usability
- Implemented robust error handling

### 👨‍💻 **Developer Experience**
- Added typed URLSearchParams for better type safety
- Created shared schema for consistent data models
- Improved build and development workflows

### 🗺️ **Map Design Iteration**
- Iterated on map design for better clarity
- Optimized performance for large datasets
- Enhanced user interaction patterns

*Like any startup, we faced challenges — from filter crashes to map readability. Each hurdle made EcoLens faster, cleaner, and more intuitive.*

---

## 🔮 Next Steps

### 🗺️ **Map Upgrades**
- **GeoJSON** integration with **d3-geo** or **MapLibre**
- Enhanced geographic visualizations
- Better performance for global data

### 📈 **Advanced Analytics**
- Investment heatmaps and trend analysis
- Investor overlap detection
- Sector performance metrics

### 🎯 **Personalization**
- Saved views and custom dashboards
- Investor watchlists and alerts
- Personalized recommendations

### 🔍 **Data Quality**
- AI-driven tagging and categorization
- Automated deduplication systems
- Enhanced data validation pipelines

---

## 📁 Project Structure

```
EcoLens/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # shadcn/ui components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities & TanStack Query
├── server/                 # Express backend  
│   ├── controllers/        # Route handlers
│   ├── db/                 # Drizzle ORM & Supabase
│   └── scripts/            # Data enrichment
├── shared/                 # Shared TypeScript schemas
└── migrations/             # Database migrations
```

---

## 🌐 API Endpoints

### Funding Events
- `GET /api/events/search` - Search and filter funding events
- Query: `searchTerm`, `sector`, `stage`, `country`, `tags`, `dateRange`

### Investor Intelligence  
- `GET /api/investors/timeline` - Investor activity and comparisons
- Query: `page`, `pageSize`, `sortBy`, `sector`, `stage`

### Data Pipeline
- `POST /api/ingest-scraped-data` - Data enrichment endpoint (protected)

---

## 🤝 Contributing

We welcome contributions from the climate tech community!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`  
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use shadcn/ui components for consistency
- Write meaningful commit messages
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful, accessible components
- **TanStack Query** for powerful data management
- **Supabase** for seamless database hosting
- **Drizzle ORM** for type-safe database operations
- The climate tech community for inspiring this mission

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)  
- **Team**: Ethan Davey & Ariel Chen

---

**Made with 💚 for climate innovation**

*Helping founders go from "I need funding" to "I know exactly who to approach" — in seconds, not hours.*
