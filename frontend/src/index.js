import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './context/AuthContext';
import { CodeProvider } from './context/CodeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <CodeProvider>
            <App />
        </CodeProvider>
    </AuthContextProvider>
);
reportWebVitals();
