import './App.css'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { Board } from './components/Board'
import { Header } from './components/Header'


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
        <Board />
      </Container>
    </ThemeProvider>
  )
}

export default App
