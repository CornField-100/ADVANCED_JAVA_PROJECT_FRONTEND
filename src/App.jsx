import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom"
//Pages
import CreateProduct from './pages/CreateProduct'
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import NotFoundPage from "./pages/NotFoundPage"
import SignUpPage from "./pages/SignUpPage"

const App = () => {
  return (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
  )
}

export default App
