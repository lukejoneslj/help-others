# Help Others 🤝

An anonymous community platform for sharing acts of service and helping others. Share your stories and be inspired by others - all while staying completely anonymous.

## ✨ Features

- 📝 **Anonymous Sharing** - No accounts needed, just share your story
- 💝 **Hearts System** - Show appreciation for inspiring stories  
- 💬 **Comments** - Engage with stories anonymously
- 🌟 **Inspirational** - Read and share stories of helping others
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎨 **Beautiful UI** - Clean, modern design with smooth animations
- ⚡ **Real-time Updates** - See new stories and interactions instantly
- 🔒 **Privacy First** - No personal data collection, completely anonymous

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS with custom animations
- **Database**: SQLite with better-sqlite3
- **UI Components**: Custom components with Radix UI primitives
- **Markdown**: Rich text formatting support
- **TypeScript**: Full type safety

## 📱 Usage

### Sharing Your Story

1. Visit the homepage
2. Click the "Share" button (+ icon)
3. Write your story using the rich text editor
4. Format your text with **bold**, *italic*, headings, and lists
5. Click "Share Story" to publish anonymously

### Engaging with Stories

- **Hearts**: Click the heart button to show appreciation
- **Comments**: Click the comment button to add your thoughts
- **Formatting**: Use markdown in comments too!

### Viewing Acts of Service

- Stories are displayed in chronological order (newest first)
- Each story shows hearts and comment count
- Anonymous avatars and usernames are generated for each story
- Time stamps show relative time (e.g., "2 hours ago")

### Adding Comments

1. Click the "Share" button on any story
2. Write about how you helped someone or were helped
3. Use formatting to make your story engaging
4. Submit to share with the community

## 🛠️ Development

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Database Setup

The SQLite database is automatically created on first run. The schema includes:

- `acts_of_service` table for storing stories
- `comments` table for story comments
- Automatic migrations for schema updates

## 📊 API Endpoints

- `GET /api/acts` - Retrieve all acts of service
- `POST /api/acts` - Create a new act of service
- `GET /api/acts/[id]/comments` - Get comments for a specific act
- `POST /api/acts/[id]/comments` - Add a comment to an act
- `POST /api/acts/[id]/like` - Like/unlike an act

### Request/Response Examples

```javascript
// Create a new act
POST /api/acts
{
  "content": "Today I helped my neighbor carry groceries up three flights of stairs..."
}

// Add a comment
POST /api/acts/1/comments
{
  "content": "This is so heartwarming! Thank you for sharing."
}

// Like an act
POST /api/acts/1/like
{
  "hearts": 5
}
```

## 🎨 Customization

### Styling

The app uses Tailwind CSS with custom color schemes:
- Primary: Blue gradient (blue-600 to indigo-600)
- Backgrounds: Subtle gradients and backdrop blur effects
- Cards: Clean white backgrounds with subtle shadows

### Database

SQLite database with the following tables:
- `acts_of_service`: id, content, hearts, created_at
- `comments`: id, act_id, content, created_at

## 📄 License

This project is open source and available under the MIT License.

## 💝 Inspiration

> "No act of service, no matter how small, is ever wasted." - Inspired by Aesop

This platform was created to celebrate and encourage acts of helping others in our communities. Every small gesture matters, and by sharing our stories, we can inspire others to help people too.

## 🌟 Contributing

We welcome contributions! Feel free to submit issues, feature requests, or pull requests.

**Made with 💙 for spreading helpfulness and community support in the world.**
