import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { routes } from './router/routes'

const router = createBrowserRouter(routes)

function App() {
    console.log('MODE:', import.meta.env.MODE)
    console.log('API:', import.meta.env.VITE_API_ENDPOINT)

    return <RouterProvider router={router} />
}

export default App
