import translations from "./translations.js"
import {writable, derived} from "svelte/store";

const localeKey = "momsen.loocale"

function initialLocale() {
  const params = new URLSearchParams(location.search)
  const fromUrl = params.get("lang")?.replace(/-.*/, '')
  if (fromUrl && translations[fromUrl]) {
    console.debug('locale from url', fromUrl)
    return fromUrl
  }

  const saved = localStorage.getItem(localeKey)
  if (saved && translations[saved]) {
    console.debug('saved locale', saved)
    return saved
  }

  for (const tag of navigator.languages) {
    const lang = tag.replace(/-.*/, '')
    if (lang && translations[lang]) {
      console.debug('navigator.language', tag, lang)
      return lang
    }
  }

  console.debug('default locale')
  return "sv"
}

export const locale = writable(initialLocale())
export const locales = Object.keys(translations)

let initialized = false

locale.subscribe((lang) => {
  console.log('setting language', lang)
  document.documentElement.lang = lang
  if (initialized) {
    localStorage.setItem(localeKey, lang)
  }
  initialized = true
})

function translate(locale, key, vars) {
  if (!key) throw new Error("no key provided to $t()")
  if (!locale) throw new Error(`no translation for key "${key}"`)

  // Grab the translation from the translations object.
  let text = translations[locale][key]
  if (!text) {
    const msg = `translation "${key}" not found`
    text = translations.sv[key]
    if (!text) throw new Error(msg)
    console.error(msg)
  }

  // Replace any passed in variables in the translation string.
  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g")
    text = text.replace(regex, vars[k])
  })

  return text
}

export const t = derived(locale,
  ($locale) => (key, vars = {}) => translate($locale, key, vars))
