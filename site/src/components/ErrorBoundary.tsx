import * as React from 'react'
export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
    state = { failed: false }
    static getDerivedStateFromError() { return { failed: true } }
    render() {
        if (this.state.failed) return <main style={{ padding: 32 }}><h1>No se pudo abrir el archivo</h1><p>Recarga la página para volver a intentarlo.</p><button className="ag-button" onClick={() => window.location.reload()}>Recargar</button><p><a href="/">Volver al inicio</a></p></main>
        return this.props.children
    }
}
