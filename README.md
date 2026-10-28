# Task Tracker

A modern, feature-rich task management application built with React and Vite. Organize your work, maintain focus, and track productivity with an intuitive kanban-style board and integrated Pomodoro timer.

## Features

### Task Management
- **Kanban Board**: Organize tasks across three stages—Yet to Start, Working On, and Done
- **Priority Levels**: Assign tasks one of three priority levels (Urgent, Pressing, Lenient) with visual indicators
- **Drag & Drop**: Reorder tasks within columns using drag-and-drop functionality
- **Due Dates**: Set and track due dates for tasks with visual urgency indicators
- **Subtasks & Links**: Add subtasks to break down work and include reference links.

### Focus Mode
- **Daily Focus Selection**: Pick up to 3 tasks each day to focus on
- **Focused Workspace**: Dedicated modal view showing only selected tasks
- **Task Completion**: Mark tasks as done directly from focus mode
- **Daily Reset**: Focus selection resets each day

### Pomodoro Timer
- **Floating Timer**: Persistent Pomodoro timer that stays visible while working
- **Session Tracking**: Configurable work and break durations
- **Context Integration**: Timer state persists across page navigation

### Archive & Organization
- **Archive Completed Tasks**: Move tasks out of sight when they're no longer active
- **Archive Drawer**: View and restore archived tasks anytime
- **Persistent Storage**: All data is saved to browser localStorage

### Data Management
- **JSON Export**: Export your tasks as JSON for backup or external use
- **Customizable Backdrops**: Choose from multiple background themes

## Getting Started

### Prerequisites
- Node.ts (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com/auraluvsu/iris.git
cd iris
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot module reloading:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

Create an optimized build:
```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

Preview the built app locally:
```bash
npm run preview
```

## Usage

### Accessing the App
1. Open the application in your browser
3. You'll be taken to the Tasks page

### Managing Tasks

**Creating a Task:**
- Click the "+" button in the header to open the task creation modal
- Enter the task title and optional description
- Set a priority level and due date if needed
- Save the task

**Editing a Task:**
- Click on any task card to open the editing modal
- Modify title, description, priority, due date, subtasks, or links
- Save changes or delete the task

**Moving Tasks:**
- Drag task cards between columns (Yet to Start → Working On → Done)
- Reorder cards within the same column by dragging
- Click the Archive icon to move completed tasks to the archive

**Archiving Tasks:**
- Click the Archive icon on a task to move it to the archive
- Access archived tasks via the Archive button in the top right
- Click a task in the archive to restore it

### Using Focus Mode

1. Click the **Focus** button in the top bar
2. In the selection screen, choose up to 3 tasks to focus on
3. View your selected tasks in a dedicated workspace
4. Use the Pomodoro timer to track work sessions
5. Mark tasks as complete directly from focus mode
6. Close focus mode to return to the full task board

Your daily focus selection is saved and persists until the next day.

### Using the Pomodoro Timer

- The floating timer is always visible in the bottom right
- Click to start/pause the timer
- Standard Pomodoro intervals are configurable
- Notifications alert you when a session ends (if your browser supports it)

### Viewing Due Dates

- Tasks with due dates show a visual indicator
- Color coding indicates urgency:
  - **Red**: Urgent (due soon or overdue)
  - **Yellow**: Pressing (due within a few days)
  - **Gray**: Lenient (due further in the future)

### Customizing the Theme

- Click the **Palette** icon in the top bar
- Select from available background themes
- Your selection is saved automatically

### Exporting Tasks

- Click the **Link** icon in the top bar
- Your tasks are exported as JSON and available for download
- Useful for backup or importing into other tools

## Project Structure

```
task-tracker/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── CardModal.tsx    # Task creation/editing modal
│   │   ├── FocusMode.tsx    # Focus mode workspace
│   │   ├── PomodoroTimer.tsx # Pomodoro timer component
│   │   ├── ArchiveDrawer.tsx # Archive management
│   │   ├── Topbar.tsx       # Navigation and controls
│   │   └── BackdropPicker.tsx # Theme selection
│   ├── pages/               # Page-level components
│   │   ├── TasksPage.tsx    # Main kanban board
│   │   └── ListsPage.tsx    # Additional lists view
│   ├── utils/
│   │   ├── pomodoroContext.tsx # Pomodoro state management
│   │   ├── dueDate.ts       # Due date utilities
│   │   └── exportData.ts    # Data export functionality
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts          # Vite configuration
├── eslint.config.ts        # ESLint rules
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Tech Stack

- **React 19**: Modern UI library with hooks
- **Vite 8**: Lightning-fast build tool and dev server
- **dnd-kit**: Headless, unstyled drag-and-drop utilities
- **Lucide React**: Lightweight icon library
- **CSS Variables**: Dynamic theming support
- **Local Storage**: Client-side data persistence

## Code Quality

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

The project uses ESLint with React-specific rules and hooks validation.

## Security

- Session-based authentication stored in sessionStorage
- All data stored locally in browser (no server required)
- Note that any links provided will be fetched from https://api.allorigins.win/geturl= to generate titles

## Browser Compatibility

- Modern browsers with ES6+ support
- Local Storage support required
- Drag-and-drop API support for full functionality

## Performance Considerations

- **React Fast Refresh** enabled in development for instant updates
- **Vite's Module Federation** for efficient bundling
- **Local Storage** for instant persistence without network calls

## Tips & Best Practices

1. **Set Daily Focus**: Use Focus Mode each morning to pick your top 3 priorities
2. **Use Pomodoro**: The integrated timer helps maintain productive work sessions
3. **Archive Regularly**: Move completed tasks to archive to reduce clutter
4. **Check Due Dates**: Review due date indicators to stay on track
5. **Export Backups**: Periodically export your tasks as JSON for backup

## Troubleshooting

**Data not persisting?**
- Check browser's Local Storage settings (not disabled or full)
- Some browsers restrict Local Storage in private/incognito mode
- Try exporting data before clearing browser cache

**Drag and drop not working?**
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for any error messages

## Future Enhancements

Potential features for future versions:
- Cloud sync across devices
- Recurring tasks and templates
- Team collaboration features
- Mobile app version
- Calendar view for tasks
- Time tracking and analytics

## License

This project is licensed under the included LICENSE file.

## Support

For issues or feature requests, please create an issue in the project repository.

---

Built with ❤️ for productivity and focus.
