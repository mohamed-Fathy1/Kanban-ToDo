import './App.css'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth={false}
          disableGutters
          sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
        >
          <Header />
          <Board />
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
