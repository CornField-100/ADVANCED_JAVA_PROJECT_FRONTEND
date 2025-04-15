import { BrowserRouter as Router, Routes, Route, } from "react-router-dom"

//Pages
import CreateProduct from './pages/CreateProduct'
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import NotFoundPage from "./pages/NotFoundPage"
import SignUpPage from "./pages/SignUpPage"

//Components
import NavBar from "./components/NavBar"
import FooterComp from "./components/FooterComp"

const App = () => {
  return (
    <>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <FooterComp />
        </Router>
      </>
  )
}

export default App
