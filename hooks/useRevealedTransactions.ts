import { create } from 'zustand'

interface RevealedTransactionsState {
  revealedTransactions: Set<string>
  revealTransaction: (transactionId: string) => void
  isRevealed: (transactionId: string) => boolean
}

export const useRevealedTransactions = create<RevealedTransactionsState>((set, get) => ({
  revealedTransactions: new Set<string>(),
  revealTransaction: (transactionId: string) => {
    set((state) => ({
      revealedTransactions: new Set([...state.revealedTransactions, transactionId])
    }))
  },
  isRevealed: (transactionId: string) => {
    return get().revealedTransactions.has(transactionId)
  }
}))