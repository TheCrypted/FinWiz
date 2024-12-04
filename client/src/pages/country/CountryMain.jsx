import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from '../../components/NavBar.jsx';
import Home from '../Home.jsx';
import IMFView from './IMFView.jsx';
import EducationView from './EducationView.jsx';
import StockView from './StockView.jsx';
import SimilarView from './SimilarView.jsx';

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export const CountryMain = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imfview" element={<IMFView />} />
          <Route path="/educationview" element={<EducationView />} />
          <Route path="/stockview" element={<StockView />} />
          <Route path="/similarview" element={<SimilarView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default CountryMain;