import './App.css'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { Board } from './components/Board'
import { Header } from './components/Header'


const tasks = [
  { "id": 1, "title": "API integration", "description": "Connect frontend to REST API endpoints", "column": "backlog" },
  { "id": 2, "title": "Unit tests", "description": "Write tests for utility functions and hooks", "column": "backlog" },
  { "id": 3, "title": "Performance audit", "description": "Lighthouse scores and bundle analysis", "column": "backlog" },
  { "id": 4, "title": "Authentication flow", "description": "Implement login, signup, and password reset screens", "column": "in_progress" },
  { "id": 5, "title": "File upload component", "description": "Drag and drop file upload with preview", "column": "in_progress" },
  { "id": 6, "title": "Dark mode support", "description": "Add theme toggle and CSS variable switching", "column": "review" },
  { "id": 7, "title": "Dashboard layout", "description": "Build responsive sidebar and main content area", "column": "review" },
  { "id": 8, "title": "Design system tokens", "description": "Set up color palette, typography, and spacing scales", "column": "done" },
  { "id": 9, "title": "Notification system", "description": "Toast notifications and in-app alerts", "column": "backlog" },
  { "id": 10, "title": "User settings page", "description": "Profile editing, preferences, and account management", "column": "backlog" },
  { "id": 11, "title": "Error boundary setup", "description": "Global error handling with fallback UI", "column": "in_progress" },
  { "id": 12, "title": "CI/CD pipeline", "description": "GitHub Actions for testing and deployment", "column": "done" }
]


function App() {


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        disableGutters
        sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
      >
        <Header />
        <Board tasks={tasks} />
      </Container>
    </ThemeProvider>
  )
}

export default App
