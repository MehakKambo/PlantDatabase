import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FrontPage from "./pages/FrontPage";
import PlantPage from './pages/PlantPage';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/plant">
                        <Route index element={
                            <main>
                                <p>No plant provided in the URL.</p>
                            </main>
                        } />
                        <Route path=":scientificName" element={<PlantPage />} />
                    </Route>
                    <Route path="*" element={<FrontPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
