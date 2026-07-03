import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@providers/ThemeProvider.jsx'
import { notificationStore } from '@/stores/notificationStore.js'

notificationStore.init()

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeProvider>
            <App />
            <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                    style: {
                        fontFamily: 'Helvetica, Arial, sans-serif',
                    },
                }}
            />
        </ThemeProvider>
    </BrowserRouter>,
)
