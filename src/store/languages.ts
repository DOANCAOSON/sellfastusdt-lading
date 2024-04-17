import { atom } from 'nanostores'

export type DispatchLanguage = (
  content?: Record<string, string> | any,
  code?: string,
  setting?: Record<string, string> | any
) => void

export const languageAtom = atom<{
  setting?: Record<string, string> | any
  content?: Record<string, string> | any
  code?: string
} | null>({ code: '', content: {}, setting: {} })

export const setLanguage = (lang: Language) => {
  languageAtom.set({ code: lang?.code, content: lang?.content, setting: lang?.setting })
}
