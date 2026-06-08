import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//bg
import './assets/bg/static.jpg'


import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
