import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@providers/ThemeProvider.jsx'
import { AuthProvider } from '@providers/AuthProvider.jsx'
import { notificationStore } from '@/stores/notificationStore.js'
import { accountStore } from '@/stores/accountStore.js'

notificationStore.init()
accountStore.init()

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeProvider>
            <AuthProvider>
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
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>,
)
