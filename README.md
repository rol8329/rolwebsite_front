This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Blog Dashboard - Full Stack Media-Rich Blogging Platform

A modern, full-stack blogging platform with rich media support, built with Django REST Framework and Next.js. Features a professional 3-column dashboard for content management, advanced media galleries, and comprehensive filtering capabilities.

## 🚀 Features

### Content Management
- **Rich Blog Posts**: Create and manage blog posts with title, content, and timestamps
- **Multi-Media Support**: Upload and manage images, videos, audio files, and documents
- **Advanced Search**: Real-time search across post titles and content
- **Smart Filtering**: Filter by date range, media presence, categories, and custom criteria
- **Multiple Sort Options**: Sort by newest, oldest, popularity, or trending

### Media Experience
- **Image Galleries**: Full-screen modal galleries with navigation and thumbnails
- **Video Players**: Inline video previews with full-screen modal playback
- **Audio Players**: Integrated audio controls with download options
- **File Management**: Upload and download various file types with preview icons

### Dashboard Analytics
- **Live Statistics**: Real-time post and media counts
- **Activity Insights**: Track publishing patterns and popular content
- **Performance Metrics**: View engagement and content analytics
- **Recent Activity**: Monitor latest posts and updates

### User Experience
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **3-Column Layout**: Tools/Filters | Posts Feed | Statistics
- **Mobile Panels**: Slide-out panels for mobile navigation
- **Keyboard Shortcuts**: ESC to close modals, arrow keys for gallery navigation

## 🛠 Tech Stack

### Backend
- **Django 5.2**: Python web framework
- **Django REST Framework**: API development
- **SQLite**: Database (easily upgradeable to PostgreSQL)
- **JWT Authentication**: Secure token-based auth
- **CORS Support**: Cross-origin resource sharing
- **Media Handling**: File upload and serving

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **React Query**: Server state management and caching
- **Lucide React**: Modern icon library
- **CSS-in-JS**: Styled components approach

### Key Libraries
- **uuid6**: Unique identifier generation
- **django-cors-headers**: CORS handling
- **rest-framework-simplejwt**: JWT tokens
- **TanStack Query**: React Query implementation

## 📁 Project Structure

```
├── Backend (Django)
│   ├── blog/                   # Blog app
│   │   ├── models.py          # BasePost, ImagePost, VideoPost, etc.
│   │   ├── api/
│   │   │   ├── serializers.py # DRF serializers
│   │   │   ├── views.py       # API endpoints
│   │   │   └── urls.py        # API routing
│   │   └── migrations/
│   ├── account/               # Authentication app
│   ├── media/                 # Uploaded files
│   └── settings.py           # Django configuration
│
├── Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   └── blog/
│   │   │       ├── page.tsx   # Main dashboard
│   │   │       └── card/      # PostCard component
│   │   ├── components/
│   │   │   ├── blogspot/      # 3-column layout components
│   │   │   │   ├── Left.tsx   # Tools & Filters
│   │   │   │   ├── Middle.tsx # Posts Feed
│   │   │   │   └── Right.tsx  # Statistics
│   │   │   ├── blog/          # Blog-specific components
│   │   │   │   ├── ImageGallery.tsx
│   │   │   │   ├── MediaPreviews.tsx
│   │   │   │   └── PostCard.tsx
│   │   │   └── create/        # Content creation forms
│   │   ├── hooks/             # React Query hooks
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Helper functions
│   │   └── config/            # Configuration files
│   └── next.config.ts         # Next.js configuration
```

## 🔌 API Endpoints

### Blog Posts
- `GET /blog-api/posts/` - List all posts
- `POST /blog-api/posts/` - Create new post
- `GET /blog-api/posts/{uuid}/` - Get specific post
- `PUT/PATCH /blog-api/posts/{uuid}/` - Update post
- `DELETE /blog-api/posts/{uuid}/` - Delete post
- `GET /blog-api/posts/global/` - Get posts with all media

### Media Management
- `GET/POST /blog-api/posts/{uuid}/images/` - Image management
- `GET/POST /blog-api/posts/{uuid}/videos/` - Video management
- `GET/POST /blog-api/posts/{uuid}/audios/` - Audio management
- `GET/POST /blog-api/posts/{uuid}/files/` - File management

### Individual Media
- `GET/PUT/DELETE /blog-api/images/{uuid}/` - Image operations
- `GET/PUT/DELETE /blog-api/videos/{uuid}/` - Video operations
- `GET/PUT/DELETE /blog-api/audios/{uuid}/` - Audio operations
- `GET/PUT/DELETE /blog-api/files/{uuid}/` - File operations

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt uuid6
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend  # Adjust path as needed
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://127.0.0.1:8000`
   - Django Admin: `http://127.0.0.1:8000/admin`

## 🎯 Key Concepts

### Data Models
- **BasePost**: Core blog post with title, content, timestamps
- **MediaPosts**: ImagePost, VideoPost, AudioPost, FilePost linked to BasePost
- **UUID Primary Keys**: All models use UUID6 for unique identification

### State Management
- **React Query**: Handles API calls, caching, and synchronization
- **Optimistic Updates**: UI updates immediately with background sync
- **Cache Invalidation**: Smart cache updates when content changes

### Media Handling
- **Django Media Serving**: Backend serves uploaded files
- **Next.js Image Optimization**: Frontend optimizes image delivery
- **File Type Detection**: Automatic categorization of uploaded media

### Authentication
- **JWT Tokens**: Secure authentication with refresh tokens
- **Permission-Based**: Different access levels for read/write operations
- **CORS Configuration**: Secure cross-origin requests

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Media Settings
- **Upload Path**: `/media/` directory
- **File Size Limits**: 10MB for images, 50MB for other files
- **Supported Formats**: JPEG, PNG, GIF, WebP, MP4, WebM, MP3, WAV, PDF

## 🎨 Customization

### Styling
- Modify CSS-in-JS styles in component files
- Update color scheme in shared style objects
- Customize responsive breakpoints in layout components

### Features
- Add new media types by extending models and serializers
- Implement additional filtering options in Left.tsx
- Create custom statistics in Right.tsx
- Add new post types or metadata fields

## 📱 Mobile Support

The application is fully responsive with:
- **Mobile-First Design**: Optimized for touch interfaces
- **Slide-Out Panels**: Access filters and statistics on mobile
- **Touch Gestures**: Swipe navigation in image galleries
- **Adaptive Layouts**: Automatic layout switching based on screen size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions and support:
- Check the GitHub Issues for common problems
- Review the Django and Next.js documentation
- Ensure all dependencies are correctly installed
- Verify API endpoints are accessible

---

**Built with ❤️ using Django REST Framework and Next.js**