import { atomWithStorage } from 'jotai/utils'

interface userData {
    login: boolean
    email: string
}

export const userDataAtom = atomWithStorage<userData>('userData', { login: false, email: `` })