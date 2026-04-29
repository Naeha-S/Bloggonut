# BLOGGONUT - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** April 29, 2026  
**Status:** In Development  
**Author:** Bloggonut Team

---

## Executive Summary

**Bloggonut** is a premium, curated blogging platform designed for professionals and creators in technology, design, AI, startups, and lifestyle domains. It reimagines the traditional blogging experience by presenting content like a magazine spread rather than a chronological feed, emphasizing quality storytelling and thoughtful curation over volume and virality.

The platform combines elegant design, intuitive user experience, and robust content management to create a sanctuary for meaningful ideas and long-form thinking in the digital age.

---

## 1. Product Vision & Strategy

### 1.1 Vision Statement
To create the premium digital magazine for the modern professional—a sanctuary where thoughtful ideas, beautiful design, and human connection converge.

### 1.2 Mission Statement
Empowering creators to share knowledge and stories while enabling audiences to discover quality content within focused communities of interest.

### 1.3 Core Values
- **Quality Over Quantity**: Curated content takes precedence over algorithmic volume
- **Beautiful Simplicity**: Elegant, purposeful design that gets out of the way
- **Thoughtful Curation**: Magazine-style editorial approach rather than pure algorithmic feeds
- **Community Connection**: Fostered discussions and meaningful interactions
- **Accessibility**: Inclusive design that works for everyone
- **Sustainable Pace**: Encouraging focused, sustainable creative work

---

## 2. Target Audience

### 2.1 Primary Users

#### Content Creators
- **Tech Writers & Engineers**: Technical bloggers, software architects, system designers
- **Design Professionals**: UI/UX designers, creative directors, design systems builders
- **AI Researchers & Practitioners**: ML engineers, AI product specialists, prompt engineers
- **Startup Founders & Builders**: Entrepreneurs, product managers, growth specialists
- **Lifestyle Writers**: Remote workers, digital minimalists, creative practitioners

#### Content Consumers
- **Professionals in Tech/Design**: Seeking curated insights and best practices
- **Career-focused Readers**: Learning from industry leaders and peers
- **Creative Practitioners**: Finding inspiration and sustainable approaches
- **Continuous Learners**: Interested in specific topics and emerging trends

### 2.2 User Demographics
- Age: 25-45 (primary), 18-60 (secondary)
- Profession: Technology, Design, Entrepreneurship, Creative fields
- Technical Literacy: High (comfortable with digital platforms)
- Education Level: College-educated, often advanced degrees
- Motivation: Professional development, knowledge sharing, community

---

## 3. Core Features & Functionality

### 3.1 Authentication & User Management

#### Sign Up / Registration
- **Email-based registration** via Supabase Auth
- User provides: email, password, display name
- Email verification required
- Single Sign-On (SSO) via Google/GitHub (planned)
- Secure token storage in localStorage

#### Login / Authentication
- Email and password authentication
- Remember login functionality
- Persistent sessions with JWT tokens
- Password reset via email link

#### User Profile
- Display name (publicly visible)
- User profile avatar/image
- Bio/about section (planned)
- List of authored posts
- List of saved bookmarks
- Social links (planned)

### 3.2 Post Management

#### Create Post
- **Form Fields**:
  - Title (required, max 200 characters)
  - Description/Excerpt (optional, max 300 characters)
  - Content (required, rich text editor or markdown)
  - Category/Topic selection (required)
    - Technology
    - Design
    - Development
    - AI
    - Startup
    - Lifestyle
  - Tags (optional, comma-separated, max 10)
  - Featured image/cover (optional, URL-based)
- **Default author**: Current logged-in user
- **Created timestamp**: Auto-generated
- **Validation**: Title and content are mandatory
- **Error handling**: User-friendly error messages
- **Redirect**: Navigate to home on successful post creation

#### Read Posts
- **Home Feed**:
  - Featured/spotlight posts (first 4 posts)
  - Magazine-style layout with varying card sizes
  - Staggered animation on load
  - Post previews with title, excerpt, category, author
  - Related content suggestions (planned)

- **Post Detail View**:
  - Full post content
  - Author information
  - Category and tags display
  - Comments section
  - Related posts (planned)
  - Publish/modified timestamps
  - Like count and engagement metrics

- **Topic/Category Pages**:
  - All posts filtered by selected topic
  - Topic header with description and banner image
  - Topic image from Unsplash
  - All six main topics browsable

- **Explore Page**:
  - Discovery interface for all posts
  - Browse all content
  - Search functionality (planned)
  - Advanced filters (planned)

- **Trending Page**:
  - Posts ranked by engagement (likes, comments, views)
  - Time-based trends (past week, month)
  - Featured trending content
  - Algorithmic ranking (planned)

#### Update Post
- **Editable fields**: Title, description, content, category, tags, image
- **Author-only**: Only post creator can edit
- **Timestamp update**: Modified timestamp recorded
- **Validation**: Same as create
- **Successful update**: Redirect to post detail view

#### Delete Post
- **Author-only**: Only post creator can delete
- **Confirmation prompt**: Prevent accidental deletion
- **Cascade deletion**: All associated comments deleted
- **Redirect**: Navigate to home after deletion

### 3.3 Comments System

#### Create Comment
- **Posting a comment**:
  - Text content (required, max 2000 characters)
  - Authentication required
  - Author auto-populated from user
  - Timestamp auto-generated
  - Comment threaded under specific post

- **UI Integration**:
  - Comments section below post content
  - Real-time comment display (refresh)
  - Comment count in post metadata
  - Comment form with clear submission

#### View Comments
- **Comments display**:
  - All comments for a post listed chronologically
  - Author name displayed
  - Comment timestamp
  - Comment content
  - Like functionality (planned)
  - Reply functionality (planned - threaded comments)

#### Delete Comment
- **Authorization**:
  - Only comment author can delete
  - Only post author can delete comments on their post
- **Confirmation**: Prevent accidental deletion
- **Cascade**: Deletes comment and updates comment count

### 3.4 Bookmarks / Save Functionality

#### Save Post
- **One-click save**: Bookmark icon in post preview/detail
- **Authenticated action**: Requires user login
- **Visual feedback**: Toggle state on bookmark button
- **Persistent storage**: Saved in user's bookmark collection

#### View Bookmarks
- **Bookmarks page**:
  - Dedicated page for saved posts (/bookmarks)
  - Display all saved posts in card format
  - Sort options: Date saved, Alphabetical (planned)
  - Empty state messaging
  - Remove from bookmarks option

#### Remove Bookmark
- **Quick removal**: Click bookmark again or remove button
- **Confirmation**: User feedback on removal
- **Instant update**: UI reflects change immediately

---

## 4. User Flows

### 4.1 First-Time User Flow
1. Land on Home page → See featured content + feed
2. Click to explore posts → Post detail view
3. Attempt to interact (comment/save) → Redirect to Auth page
4. Sign up via email → Verification email
5. Confirm email → Account created
6. Redirected to home → Now authenticated

### 4.2 Content Creator Flow
1. Log in → Navigate to "Create Post" (/create-post)
2. Fill out post form (title, content, category, tags)
3. Select optional cover image
4. Preview post (planned)
5. Submit → Post published
6. Receive confirmation → Redirect to post detail/home
7. Can edit or delete post from detail view

### 4.3 Content Consumer Flow
1. Log in → Browse home feed
2. Explore topics → Topic page with filtered posts
3. Read post detail → View comments, interact
4. Save post → Added to bookmarks
5. Leave comment → Participate in discussion
6. Visit bookmarks → Review saved collection

### 4.4 Discovery Flow
1. Home → Magazine-style spotlight posts
2. Topic pages → Browse by category
3. Trending → See popular content
4. Explore → All posts, advanced discovery (planned)
5. Search (planned) → Find specific topics/authors

---

## 5. Technical Specifications

### 5.1 Architecture Overview

```
Frontend (React + Vite)
├── Pages (Home, Auth, CreatePost, PostDetail, etc.)
├── Components (PostCard, CommentsSection, Navbar, Sidebar, etc.)
├── Routing (React Router v7)
├── Styling (Tailwind CSS v4 + custom design system)
├── Animation (Framer Motion)
└── Icons (Lucide React)

Backend (Node.js + Express)
├── Routes (auth, posts, comments)
├── Controllers (business logic)
├── Middleware (authentication)
└── Config (Supabase connection)

Database & Auth (Supabase)
├── PostgreSQL (posts, comments tables)
├── Supabase Auth (user authentication)
└── Row-level security (RLS policies)
```

### 5.2 Frontend Stack
- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.4
- **Styling**: Tailwind CSS 4.2.2 + custom utilities
- **Routing**: React Router DOM 7.14.0
- **Animation**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.7.0
- **Validation**: Zod (planned for frontend forms)
- **State Management**: React hooks (Context API planned for scaling)

### 5.3 Backend Stack
- **Runtime**: Node.js (ES Modules)
- **Server**: Express 5.2.1
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (JWT tokens)
- **CORS**: Enabled for frontend origin
- **Validation**: Zod 4.3.6
- **Environment**: dotenv 17.4.2

### 5.4 API Endpoints

#### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

#### Posts
```
GET    /api/posts              # Get all posts
GET    /api/posts/:id          # Get single post
POST   /api/posts              # Create post (authenticated)
PUT    /api/posts/:id          # Update post (authenticated, author-only)
DELETE /api/posts/:id          # Delete post (authenticated, author-only)
```

#### Comments
```
GET    /api/comments/:postId   # Get comments for post
POST   /api/comments/:postId   # Create comment (authenticated)
DELETE /api/comments/:id       # Delete comment (authenticated, author-only)
```

#### Health Check
```
GET /health                     # Server status
```

### 5.5 Database Schema

#### Users Table
- Managed by Supabase Auth
- Fields: id, email, password (encrypted), created_at, etc.

#### Posts Table
```sql
id (UUID, PK)
created_at (timestamp)
title (text, required)
description (text, optional)
content (text, required)
category (text)
tags (text array)
image (text, URL)
author_id (UUID, FK → auth.users)
author (text, denormalized for display)
```

#### Comments Table
```sql
id (UUID, PK)
created_at (timestamp)
post_id (UUID, FK → posts)
user_id (UUID, FK → auth.users)
content (text)
author (text, denormalized)
```

### 5.6 Authentication Flow
1. User enters credentials → Supabase Auth validates
2. JWT token returned → Stored in localStorage as `bms_token`
3. Protected requests → Include token in Authorization header
4. Middleware validates token → Authorizes request
5. Token refresh (planned) → Automatic refresh when expired

---

## 6. Design System

### 6.1 Visual Identity

#### Color Palette (Warm Earthy Premium)

**Primary Colors**
- Background: `#F5E6D3` (soft warm beige)
- Primary: `#E4C59E` (light warm beige accent)

**Secondary Colors**
- Secondary: `#AF8260` (muted caramel)
- Secondary Dark: `#9A6E50` (deeper caramel)

**Accent Colors**
- Accent: `#803D3B` (deep terracotta - actions)
- Accent Light: `#A85A58` (lighter terracotta - hover)
- Accent Dark: `#6B2E2D` (darker terracotta - active)

**Surface & Text**
- Surface: `#FFFCF8` (off-white)
- Text Main: `#322C2B` (dark espresso)
- Text Muted: `#6B5D5A` (warm gray)
- Border: `#D9CBBE` (warm cream)

#### Typography
- **Display Font**: Playfair Display (serif, 600-700 weight)
- **Body Font**: Inter (light 300-400, medium for headings)
- **Secondary**: Fraunces (serif, optional accent)

#### Design Elements
- **Border Radius**: 16px-28px (3xl = 24px)
- **Shadows**: 
  - Soft: `0 4px 20px rgba(50, 44, 43, 0.06)`
  - Medium: `0 8px 32px rgba(50, 44, 43, 0.1)`
  - Large: `0 16px 48px rgba(50, 44, 43, 0.12)`
- **Spacing**: Generous, breathing room
- **Animations**: 0.3s transitions, cubic-bezier(0.4, 0, 0.2, 1)

### 6.2 Component Specifications

#### Buttons
- Primary: Accent background, primary-light text
- Secondary: Surface-secondary background, accent border
- Padding: Generous, rounded-2xl
- Hover: Lift effect (-4px), shadow increase
- Transitions: Smooth color transitions

#### Cards
- Border-radius: rounded-3xl
- Border: 2px border
- Shadow: Soft shadows, floating effect
- Hover: Lift (-4px) with enhanced shadow
- Padding: 6-8 units

#### Post Cards
- Hero image with overlay gradient
- Title, excerpt, author, category visible
- Tags as badges
- Engagement metrics (likes, comments)
- Hover state with lift animation
- Bookmark button overlay

#### Navigation
- Navbar: Soft gradient background, backdrop blur
- Sidebar: Fixed navigation, categories list
- Sticky positioning on desktop
- Responsive collapse on mobile

### 6.3 Responsive Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`
- XL Desktop: `> 1280px`

---

## 7. User Experience Specifications

### 7.1 Page Structure

#### Home Page (`/`)
- **Header**: Logo, navigation, user menu
- **Hero Section**: Featured posts (first 4), magazine-style grid
- **Main Feed**: Grid of posts with varying sizes (responsive)
- **Sidebar**: Topics list, trending tags (planned)
- **Footer**: Links, about, social (planned)

#### Post Detail Page (`/posts/:id`)
- **Header**: Navigation, read time (planned)
- **Post Content**: Full article, formatted text
- **Metadata**: Author, category, tags, published date
- **Comments Section**: All comments + form to add new
- **Related Posts**: Suggestions (planned)
- **Actions**: Share, bookmark, edit (if author)

#### Auth Page (`/auth`)
- **Dual tabs**: Sign Up / Log In
- **Form validation**: Real-time, clear error messages
- **Loading states**: Spinner during submission
- **Redirect**: Home on successful auth

#### Create/Edit Post Page (`/create-post`, `/posts/:id/edit`)
- **Form layout**: Vertical stack, generous spacing
- **Field labels**: Clear, required indicator
- **Text inputs**: Title, image URL
- **Rich editor**: Content field (planned: markdown/WYSIWYG)
- **Dropdown**: Category selection
- **Tags input**: Comma-separated
- **Actions**: Save, Preview (planned), Cancel
- **Error display**: Below relevant fields

#### Topic Page (`/topics/:slug`)
- **Header**: Topic title, description, banner image
- **Post grid**: All posts in category
- **Filters**: Sort options (planned)
- **Breadcrumb**: Navigation context

#### Bookmarks Page (`/bookmarks`)
- **Header**: "My Bookmarks" title
- **Empty state**: Messaging if no bookmarks
- **Post grid**: All saved posts
- **Actions**: Remove bookmark, view post

#### Trending Page (`/trending`)
- **Time filter**: Past week, month, all time (planned)
- **Post list**: Ranked by engagement
- **Engagement badges**: Like count, comment count
- **Featured section**: Top trending (planned)

#### Explore Page (`/explore`)
- **Browse interface**: All posts
- **Discovery tools**: Search (planned), filters (planned)
- **Category shortcuts**: Quick topic links

### 7.2 Loading States
- **Skeleton loaders**: Card placeholders while fetching
- **Spinner animations**: Rotation animation on fetch
- **Empty states**: Clear messaging when no content
- **Error states**: User-friendly error messages with retry

### 7.3 Animations & Transitions
- **Page load**: Staggered fadeInUp (80ms delays)
- **Card hover**: Lift (-4px), shadow increase
- **Button interactions**: Smooth color transitions
- **Icon animations**: Subtle scale on hover
- **Scroll animations**: Fade-in on scroll (planned)

### 7.4 Accessibility
- **Color contrast**: WCAG AA standard (dark text on light)
- **Semantic HTML**: Proper heading hierarchy
- **ARIA labels**: For icon buttons, interactive elements
- **Focus states**: Visible focus rings
- **Keyboard navigation**: Tab order, skip links (planned)
- **Alt text**: For images
- **Form labels**: Associated with inputs

---

## 8. Content Strategy

### 8.1 Topics & Categories

Six main topic pillars:

1. **Technology**
   - Systems, performance, APIs, future-facing web work
   - Target audience: Software engineers, architects

2. **Design**
   - Typography, motion, accessibility, editorial layouts
   - Target audience: Designers, UX specialists

3. **Development**
   - React, tooling, testing, long-lived codebases
   - Target audience: Frontend/backend developers

4. **AI**
   - Models, prompting, product thinking, practical automation
   - Target audience: ML engineers, AI practitioners

5. **Startup**
   - Founders, launch habits, landing pages, momentum
   - Target audience: Entrepreneurs, product builders

6. **Lifestyle**
   - Routines, focus, creative practice, sustainable work
   - Target audience: Remote workers, creatives

### 8.2 Content Standards

#### Quality Guidelines
- Minimum 500 words (recommended 1000-3000)
- Well-structured with clear headings
- Proper grammar and spelling
- Fact-checked and cited (where applicable)
- Actionable insights or storytelling
- Original perspective

#### Moderation
- Comment moderation (planned)
- Flag inappropriate content (planned)
- Community guidelines enforcement (planned)
- Author verification (planned)

### 8.3 SEO & Discovery
- URL slugs from titles
- Meta descriptions from excerpt
- Open Graph tags for sharing
- Structured data (Schema.org) (planned)
- Sitemap generation (planned)
- Search engine indexing ready

---

## 9. Analytics & Metrics

### 9.1 Key Performance Indicators (KPIs)

#### Engagement Metrics
- **Post views**: Pageviews per post
- **Comments per post**: Discussion depth
- **Average read time**: Content consumption (planned)
- **Bookmarks**: Content value indicator
- **Shares**: Content reach (planned)

#### User Metrics
- **Active users**: Monthly/daily active users
- **New creator rate**: Posts created per month
- **User retention**: Return visitor rate
- **Topic popularity**: Views per category
- **Author engagement**: Posts published, comments received

#### Content Metrics
- **Posts published**: Growth of content library
- **Average post length**: Content depth
- **Most engaging authors**: Top contributors
- **Most popular topics**: Category distribution
- **Comment rate**: Discussion participation

### 9.2 Analytics Implementation
- View tracking (planned): Page view counters
- Engagement tracking (planned): Like/comment events
- User behavior (planned): Time on page, scroll depth
- Conversion tracking (planned): Account creation, post creation
- Event analytics (planned): Custom events for key actions

---

## 10. Security & Privacy

### 10.1 Authentication & Authorization

#### Password Security
- Hashed and salted by Supabase Auth
- Minimum 8 characters (planned requirement)
- Password reset via email verification

#### Token Management
- JWT tokens issued on login
- Tokens stored in browser localStorage
- Authorization header: `Bearer {token}`
- Token expiration (planned): Refresh token rotation
- HTTPS enforcement (production)

#### Role-Based Access Control
- User-only features: Create post, comment, bookmark
- Author-only features: Edit own posts, delete own comments
- Admin features: Moderation, content flags (planned)

### 10.2 Data Privacy

#### User Data
- Email required for account creation
- Minimal data collection (no tracking)
- Profile data: name, bio (optional)
- Privacy policy (planned)

#### Post & Comment Data
- Public read access (RLS policies)
- User delete on account deletion (cascade)
- Comment deletion available to author
- Audit logs (planned)

### 10.3 API Security
- CORS configured for frontend origin
- Rate limiting (planned): Prevent abuse
- Input validation: Zod schemas (planned)
- SQL injection prevention: Parameterized queries (Supabase)
- XSS protection: React automatic escaping

### 10.4 Data Backup & Recovery
- Supabase automated backups
- User data recovery (planned)
- Delete account functionality (planned)
- Data export (planned)

---

## 11. Infrastructure & Deployment

### 11.1 Hosting & Deployment

#### Frontend
- **Build**: Vite optimized production build
- **Hosting**: Vercel / Netlify (planned)
- **CDN**: Global edge distribution
- **Environment variables**: API_URL, feature flags
- **CI/CD**: GitHub Actions (planned)

#### Backend
- **Runtime**: Node.js on cloud platform
- **Hosting**: Render / Railway / Vercel (planned)
- **Environment variables**: Supabase keys, secrets
- **Monitoring**: Error tracking, uptime (planned)
- **Scaling**: Automatic scaling (planned)

#### Database
- **Supabase PostgreSQL**: Managed service
- **Backups**: Automatic daily backups
- **Read replicas** (planned): For scaling reads
- **Connection pooling**: Optimized queries

### 11.2 Development Environment

#### Local Setup
- Node.js and npm/yarn
- Frontend dev server: `npm run dev`
- Backend dev server: `node server.js`
- Supabase local (planned): Docker setup
- Environment files: `.env.local`

#### Dependencies
- Frontend: React, Vite, Tailwind, Framer Motion
- Backend: Express, Supabase client, Zod
- Dev tools: ESLint, Prettier (planned)

---

## 12. Roadmap & Future Enhancements

### Phase 1: MVP (Current - In Development)
- ✅ User authentication (signup/login)
- ✅ Post CRUD operations
- ✅ Comments on posts
- ✅ Topic/category filtering
- ✅ Bookmark functionality
- ✅ Home feed with spotlight posts
- ✅ Trending and Explore pages
- ⏳ Post edit/delete functionality

### Phase 2: Refinement (Months 2-3)
- [ ] Post preview feature
- [ ] Markdown editor for posts
- [ ] Search functionality
- [ ] Advanced filters & sorting
- [ ] Related posts recommendations
- [ ] Comment likes/upvotes
- [ ] User profiles / author pages
- [ ] Social sharing (Twitter, LinkedIn)
- [ ] Analytics dashboard
- [ ] Email notifications (planned)

### Phase 3: Community (Months 4-6)
- [ ] Follow creators
- [ ] Comment threading/replies
- [ ] Content moderation tools
- [ ] Community guidelines
- [ ] Reported content handling
- [ ] Admin dashboard
- [ ] Featured/promoted posts
- [ ] Newsletter functionality
- [ ] Reading lists / collections (planned)

### Phase 4: Monetization (Months 7+)
- [ ] Subscriptions (premium content)
- [ ] Creator revenue sharing
- [ ] Sponsorship opportunities
- [ ] Ads (optional, respectful)
- [ ] API for third parties
- [ ] White-label solutions

### Phase 5: Expansion (Year 2+)
- [ ] Mobile native apps (iOS/Android)
- [ ] Offline reading capability
- [ ] Content recommendations (ML)
- [ ] Writer tools & analytics
- [ ] Integration with platforms (Zapier, etc.)
- [ ] Community podcasts (planned)
- [ ] Video content support

---

## 13. Success Criteria

### Short-term (3 months)
- [ ] 50+ published posts
- [ ] 100+ registered users
- [ ] 5+ active content creators
- [ ] 1000+ monthly page views
- [ ] 80%+ mobile responsiveness score
- [ ] Zero critical bugs in production

### Medium-term (6 months)
- [ ] 500+ posts published
- [ ] 1000+ registered users
- [ ] 50+ active creators
- [ ] 50K+ monthly page views
- [ ] 4.5+ star rating (if applicable)
- [ ] 90%+ feature completion
- [ ] <2s average page load time

### Long-term (12 months)
- [ ] 2000+ posts published
- [ ] 10K+ registered users
- [ ] 300+ active creators
- [ ] 500K+ monthly page views
- [ ] Sustainable revenue model
- [ ] Strong community engagement
- [ ] Industry recognition

---

## 14. Risks & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Database performance degradation | Medium | High | Query optimization, indexing, caching |
| Authentication token issues | Low | High | Token refresh strategy, error handling |
| Frontend build/deployment issues | Medium | Medium | Automated testing, CI/CD pipeline |
| CORS/API security vulnerabilities | Low | High | Security audits, rate limiting, input validation |
| Data loss | Low | Critical | Automated backups, disaster recovery plan |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Low content creation adoption | Medium | High | Community outreach, creator incentives |
| Content quality degradation | Medium | Medium | Moderation, community guidelines |
| Competing platforms | High | Medium | Differentiation, community moat |
| Feature creep / scope | High | Medium | Prioritization, phased roadmap |
| Server costs escalation | Medium | Medium | Optimization, caching, CDN |

---

## 15. Compliance & Legal

### Regulations & Standards
- **GDPR**: EU user data protection (Privacy policy needed)
- **CCPA**: California privacy rights (Privacy policy needed)
- **Accessibility (WCAG 2.1 AA)**: Web accessibility standards
- **Terms of Service**: User agreements (needed)
- **Content licensing**: Author rights management (needed)

### Liability & IP
- **User-generated content**: Clear ownership terms
- **Copyright**: Original content encouraged, citations required
- **Abuse reporting**: Mechanism for flagging violations
- **Account termination**: Policy for rule violations

---

## 16. Appendix

### A. Glossary

| Term | Definition |
|------|-----------|
| **Post** | A blog article or content piece created by a user |
| **Topic/Category** | One of six content categories (Tech, Design, Dev, AI, Startup, Lifestyle) |
| **Comments** | User discussions on individual posts |
| **Bookmarks** | Saved posts for later reading |
| **JWT Token** | JSON Web Token for authentication |
| **RLS** | Row-Level Security policies in Supabase |
| **Slug** | URL-friendly identifier for posts/topics |
| **Meta** | Post metadata (author, date, category, tags) |

### B. File Structure Reference

```
Bloggonut/
├── backend/
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, validation
│   ├── routes/               # API endpoints
│   ├── config/               # Supabase config
│   ├── package.json
│   ├── server.js
│   └── schema.sql            # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Route pages
│   │   ├── components/       # Reusable components
│   │   ├── data/             # Constants (topics.js)
│   │   ├── assets/           # Images, icons
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── PRD.md                    # This document
```

### C. Related Documentation
- Design System: [bloggonut-design-system.md](/memories/repo/bloggonut-design-system.md)
- Database Schema: `backend/schema.sql`
- API Routes: `backend/routes/`
- Component Library: `frontend/src/components/`

### D. Key Contacts & Stakeholders
- Product Owner: Bloggonut Team
- Tech Lead: (To be assigned)
- Design Lead: (To be assigned)
- Community Manager: (To be assigned)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Apr 29, 2026 | AI Assistant | Initial comprehensive PRD |
| - | - | - | - |

---

**Last Updated:** April 29, 2026  
**Next Review Date:** May 29, 2026

---

*This PRD is a living document and will be updated as the product evolves. All stakeholders should review changes and provide feedback.*
