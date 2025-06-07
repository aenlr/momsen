import translations from "./translations"
import {writable, derived} from "svelte/store";

export const locale = writable("sv")
export const locales = Object.keys(translations)

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
