import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeadersFile from '../src/components/HeadersFile';
import TermCondition from '../src/components/TermCondition';
import Services from '../src/components/Services';
import Contact from '../src/components/Contact';
import Home2 from './components/Home2';



function App() {
  return (
    <Router>
      <div className="App">
        <HeadersFile />
        <main className=" mt-3">
          <Routes>
            <Route path="/" element={<Home2 />} />
            <Route path="/terms-and-conditions" element={<TermCondition />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
