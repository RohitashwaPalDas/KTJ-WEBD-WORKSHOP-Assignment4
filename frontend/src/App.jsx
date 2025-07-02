import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Article from "./pages/Article";
import AuthPage from "./pages/AuthPage";
import News from "./pages/News";
import SavedNews from "./pages/SavedNews";
import About from "./pages/About";
import Footer from "./components/Footer";
import { ToastContainer, Bounce } from "react-toastify";

function App() {
  return (
    <>
      <div className="pt-8">
      <Navbar />
      <div className="px-4 sm:px-8 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/article" element={<Article />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/saved" element={<SavedNews />}></Route>
        </Routes>
      </div>

      <Footer />
      
    </div>
    <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
    </>
    
    
  );
}

export default App;

// Footer
// saved News
