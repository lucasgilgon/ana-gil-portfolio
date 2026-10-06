import ErrorBoundary from "./components/ErrorBoundary"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { MotionConfig } from "framer-motion"
import App from "./App"
import "./styles.css"

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MotionConfig reducedMotion="user">
                <ErrorBoundary><App /></ErrorBoundary>
            </MotionConfig>
        </BrowserRouter>
    </React.StrictMode>
)
