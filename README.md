## Studio Board

! Project status : core application function v1 is complete. Currently working on styling, microinteractions, and layout adjustments.

A comprehensive project management dashboard designed for creative studios and agencies. Studio Board provides an intuitive interface for managing projects, tasks, deadlines, and client communications all in one place.

### Features

- **Dashboard Overview**: Get a bird's eye view of all active projects, upcoming deadlines, and recent activity
- **Project Management**: Create, organize, and track projects with detailed task management and progress monitoring
- **Task Board**: Kanban-style task management with drag-and-drop functionality
- **Calendar Integration**: Visual calendar view for deadlines, meetings, and project milestones
- **Client Portal**: Dedicated client access for project updates, file sharing, and communication
- **File Management**: Centralized file storage with version control and easy sharing capabilities
- **Team Collaboration**: Built-in chat, comments, and notification system for seamless team communication
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Styled Components with a comprehensive design system
- **State Management**: React hooks and context for efficient state handling
- **Testing**: Vitest for unit testing with comprehensive test coverage

### Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studio-board
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── projects/       # Project management components
│   ├── tasks/          # Task management components
│   ├── calendar/       # Calendar view components
│   ├── files/          # File management components
│   ├── chat/           # Communication components
│   ├── client/         # Client portal components
│   ├── settings/       # Settings and configuration
│   ├── layout/         # Layout and navigation
│   └── ui/             # Base UI components
├── pages/              # Main application pages
├── styles/             # Global styles and design tokens
├── utils/              # Utility functions and helpers
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
