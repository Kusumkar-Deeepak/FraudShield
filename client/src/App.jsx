import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ScanResults from "./pages/ScanResults";
import History from "./pages/History";
import AdvisorVerify from "./pages/AdvisorVerify";
import About from "./pages/About";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan/:scanId" element={<ScanResults />} />
        <Route path="/history" element={<History />} />
        <Route path="/verify" element={<AdvisorVerify />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default App;
