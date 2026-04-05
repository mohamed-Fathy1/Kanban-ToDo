import { create } from "zustand"

type Store = {
    searchQuery: string
    setSearchQuery: (q: string) => void
}

const useStore = create<Store>((set) => ({
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}))

export default useStore
