import * as React from 'react'

/** Confines keyboard focus to an open dialog and restores its trigger on close. */
export function useModalFocus(ref: React.RefObject<HTMLElement>, open: boolean) {
    React.useEffect(() => {
        const dialog = ref.current
        if (!open || !dialog) return
        const previous = document.activeElement as HTMLElement | null
        const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button,input,textarea,select,[tabindex]')).filter(el => !el.hasAttribute('disabled') && el.tabIndex >= 0 && el.getClientRects().length > 0)
        const first = () => (focusable()[0] ?? dialog).focus()
        const key = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return
            const elements = focusable()
            const active = document.activeElement
            if (!elements.length) { event.preventDefault(); dialog.focus(); return }
            if (!dialog.contains(active) || (event.shiftKey && active === elements[0]) || (!event.shiftKey && active === elements[elements.length - 1])) {
                event.preventDefault(); (event.shiftKey ? elements[elements.length - 1] : elements[0]).focus()
            }
        }
        const focus = (event: FocusEvent) => { if (!dialog.contains(event.target as Node)) first() }
        first()
        document.addEventListener('keydown', key, true)
        document.addEventListener('focusin', focus)
        return () => {
            document.removeEventListener('keydown', key, true)
            document.removeEventListener('focusin', focus)
            if (previous?.isConnected) previous.focus()
        }
    }, [open, ref])
}
