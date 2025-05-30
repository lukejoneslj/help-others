# Kindness Network 💙

An anonymous community platform for sharing acts of service and kindness. Share your stories and be inspired by others - all while staying completely anonymous.

## Features

- 🔒 **Completely Anonymous** - No sign-ups, no authentication required
- 💝 **Beautiful UI** - Clean, modern interface built with shadcn/ui
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Minimal Tech Stack** - Simple and lightweight
- 🌟 **Inspirational** - Read and share stories of kindness

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS with custom gradients

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd acts-of-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database with sample data** (optional)
   ```bash
   node scripts/seed.js
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Viewing Acts of Kindness
- Browse through the beautiful card-based feed
- Each post shows the content and how long ago it was shared
- All posts are completely anonymous with randomly generated avatars

### Sharing Your Story
1. Click the "Share Kindness" button
2. Write about your act of kindness or service
3. Submit anonymously - no personal information required
4. Your story will appear in the feed for others to read and be inspired

## Database Schema

The application uses a simple SQLite database with one table:

```sql
CREATE TABLE acts_of_service (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
src/
├── app/
│   ├── api/acts/route.ts    # API endpoints for CRUD operations
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/ui/           # shadcn/ui components
├── lib/
│   ├── database.ts          # Database connection and queries
│   ├── time.ts              # Time formatting utilities
│   └── utils.ts             # General utilities
└── scripts/
    └── seed.js              # Database seeding script
```

## API Endpoints

- `GET /api/acts` - Retrieve all acts of kindness
- `POST /api/acts` - Create a new act of kindness

## Development

### Adding New Components

The project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Database Management

The SQLite database file (`acts-of-service.db`) is created automatically when you first run the application. To reset the database, simply delete the file and restart the server.

### Customization

- **Colors**: Modify the color scheme in `src/app/globals.css`
- **UI Components**: Customize shadcn/ui components in `src/components/ui/`
- **Styling**: Update Tailwind classes throughout the components

## Contributing

This project welcomes contributions! Here are some ways you can help:

- 🐛 Report bugs or issues
- 💡 Suggest new features
- 🎨 Improve the UI/UX
- 📖 Improve documentation
- ⚡ Optimize performance

## License

This project is open source and available under the [MIT License](LICENSE).

## Inspiration

> "No act of kindness, no matter how small, is ever wasted." - Aesop

This platform was created to celebrate and encourage acts of kindness in our communities. Every small gesture matters, and by sharing our stories, we can inspire others to spread kindness too.

---

**Made with 💙 for spreading kindness in the world.**
