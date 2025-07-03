import { useState, useEffect } from "react"

const TOAST_LIMIT = 1

let count = 0
function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const notificarStore = {
  state: {
    notificacoes: [],
  },
  listeners: [],
  
  getState: () => notificarStore.state,
  
  setState: (nextState) => {
    if (typeof nextState === 'function') {
      notificarStore.state = nextState(notificarStore.state)
    } else {
      notificarStore.state = { ...notificarStore.state, ...nextState }
    }
    
    notificarStore.listeners.forEach(listener => listener(notificarStore.state))
  },
  
  subscribe: (listener) => {
    notificarStore.listeners.push(listener)
    return () => {
      notificarStore.listeners = notificarStore.listeners.filter(l => l !== listener)
    }
  }
}

export const notificar = ({ ...props }) => {
  const id = generateId()

  const update = (props) =>
    notificarStore.setState((state) => ({
      ...state,
      notificacoes: state.notificacoes.map((t) =>
        t.id === id ? { ...t, ...props } : t
      ),
    }))

  const dismiss = () => notificarStore.setState((state) => ({
    ...state,
    notificacoes: state.notificacoes.filter((t) => t.id !== id),
  }))

  notificarStore.setState((state) => ({
    ...state,
    notificacoes: [
      { ...props, id, dismiss },
      ...state.notificacoes,
    ].slice(0, TOAST_LIMIT),
  }))

  return {
    id,
    dismiss,
    update,
  }
}

export function useNotificacao() {
  const [state, setState] = useState(notificarStore.getState())
  
  useEffect(() => {
    const unsubscribe = notificarStore.subscribe((state) => {
      setState(state)
    })
    
    return unsubscribe
  }, [])
  
  useEffect(() => {
    const timeouts = []

    state.notificacoes.forEach((toast) => {
      if (toast.duration === Infinity) {
        return
      }

      const timeout = setTimeout(() => {
        toast.dismiss()
      }, toast.duration || 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [state.notificacoes])

  return {
    notificar,
    notificacoes: state.notificacoes,
  }
}
