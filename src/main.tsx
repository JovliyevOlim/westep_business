import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import App from './App.tsx'
import "./styles/index.css"

const qc = new QueryClient();


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={qc}>
            <Router>
                <App/>
            </Router>
        </QueryClientProvider>
    </StrictMode>
)

