import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { SignIn } from "./pages/auth/SignIn.jsx";
import { SignUp } from "./pages/auth/SignUp.jsx";
import { Home } from "./pages/Home.jsx";
import { Portfolio } from "./pages/portfolio/Portfolio.jsx";
import { Country } from "./pages/macro/Country.jsx";
import { CountryRanking } from './pages/ranking/CountryRanking.jsx';
import { IMFView } from './pages/country/IMFView.jsx';
import { EducationView } from './pages/country/EducationView.jsx';
import { StockView } from './pages/country/StockView.jsx';
import { SimilarView } from './pages/country/SimilarView.jsx';
import { CountryMain } from './pages/country/CountryMain.jsx';


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/country" element={<Country />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/ranking" element={<CountryRanking />} />
            <Route path="/imfview/:country_name" element={<IMFView />} />
            <Route path="/educationview/:country_name" element={<EducationView />} />
            <Route path="/stockview" element={<StockView />} />
            <Route path="/similarview" element={<SimilarView />} />
            <Route path="/countrymain" element={<CountryMain />} />
        </>
    ),
    { basename: import.meta.env.BASE_URL }
);

function App() {

    return (
        <RouterProvider router={router} />
    );
}
export default App
