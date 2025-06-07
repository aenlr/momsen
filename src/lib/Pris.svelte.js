let separator = $state(1.5.toLocaleString().includes(',') ? ',' : '.')

export function formatDecimals(value, decimals) {
  return value.toFixed(decimals).replace('.', separator)
}

class Pristext {
  #text = $state('')
  #prev = $state('')
  #value = $state(0)
  #update
  #valid = true
  #decimaler = 0

  constructor(value, decimaler, update) {
    this.#value = value
    this.#decimaler = decimaler
    this.#text = formatDecimals(value, decimaler)
    this.#prev = this.#text
    this.#update = update
  }

  get valid() {
    return this.#valid
  }

  get value() {
    return this.#value
  }

  set value(value) {
    if (value !== this.#value) {
      this.#valid = true
      this.#value = value
      this.commit()
    } else if (!this.#valid) {
      this.#valid = true
      this.#text = this.#prev
    }
  }

  get text() {
    return this.#text
  }

  set text(value) {
    if (value === this.#text) {
      return
    }

    const prev = this.#text
    this.#text = value
    let n
    if (typeof value === 'string') {
      n = parseFloat(value.replace(',', '.'))
    } else if (typeof value === 'number') {
      n = value
    } else {
      this.#valid = false
      return
    }

    if (isNaN(n)) {
      this.#valid = false
      return
    }

    if (this.#valid) {
      this.#prev = prev
    }
    this.#valid = true
    this.#value = n
    this.#update(n)
  }

  commit = () => {
    if (!this.#valid) {
      this.#valid = true
      this.#value = 0
      this.#update(0)
    }
    this.#text = formatDecimals(this.#value, this.#decimaler)
    this.#prev = this.#text
  }

  toJSON() {
    if (this.#valid) {
      return this.value
    }

    return {
      value: this.#value,
      text: this.#text,
      prev: this.#prev
    }
  }

  fromJSON(json) {
    if (typeof json === 'number') {
      this.#value = json
      this.#valid = true
      this.commit()
      this.#prev = this.#text
    } else if (typeof json === 'string') {
      this.#text = json
      try {
        const n = parseFloat(json.replace(',', '.'))
        this.#valid = !isNaN(n)
        if (this.#valid) {
          this.#value = n
          this.#prev = json
        }
      } catch (e) {
        this.#valid = false
      }
    } else if (json && typeof json === 'object') {
      this.#value = json.value ?? this.#value
      this.#text = json.text ?? this.#text
      this.#prev = json.prev ?? this.#prev
      try {
        const n = parseFloat(this.#text.replace(',', '.'))
        this.#valid = !isNaN(n)
      } catch (e) {
        this.#valid = false
      }
    }
  }
}

export class Pris {
  #inkop = new Pristext(0, 2, () => this.#inkopAndrad())
  #moms = $state(12)
  #exkl = new Pristext(0, 2, () => this.#exklAndrad())
  #inkl = new Pristext(0, 2, () => this.#inklAndrad())
  #marginal = new Pristext(0, 2, () => this.#marginalAndrad())
  #vinst = new Pristext(0, 2, () => this.#vinstAndrad())
  fokus = $state('')

  inkopInkl = $derived(this.#inkop.value * (100 + this.#moms) / 100)

  _vinst() {
    return this.#exkl.value - this.#inkop.value
  }

  _marginal() {
    return this.#inkop.value > 0 ? 100 * (this.#exkl.value - this.#inkop.value) / this.#inkop.value : 0
  }

  _inkl() {
    return this.#exkl.value * (100 + this.#moms) / 100
  }

  _exkl() {
    return this.#inkl.value * 100 / (100 + this.#moms)
  }

  #vinstAndrad() {
    this.#exkl.value = this.#inkop.value + this.#vinst.value
    this.#inkl.value = this._inkl()
    this.#marginal.value = this._marginal()
  }

  #marginalAndrad() {
    this.#exkl.value = this.#inkop.value * (100 + this.#marginal.value) / 100
    this.#inkl.value = this._inkl()
    this.#vinst.value = this._vinst()
  }

  #exklAndrad() {
    this.fokus = 'exkl'
    this.#vinst.value = this._vinst()
    this.#inkl.value = this._inkl()
    this.#marginal.value = this._marginal()
  }

  #inklAndrad() {
    this.fokus = 'inkl'
    this.#exkl.value = this._exkl()
    this.#vinst.value = this._vinst()
    this.#marginal.value = this._marginal()
  }

  #inkopAndrad() {
    this.#vinst.value = this._vinst()
    this.#marginal.value = this._marginal()
  }

  get exkl() {
    return this.#exkl
  }

  get inkl() {
    return this.#inkl
  }

  get vinst() {
    return this.#vinst
  }

  get marginal() {
    return this.#marginal
  }

  get moms() {
    return this.#moms
  }

  set moms(value) {
    this.#moms = value
    if (this.fokus === 'exkl') {
      this.#inkl.value = this._inkl()
    } else {
      this.#exkl.value = this._exkl()
    }
  }

  get inkop() {
    return this.#inkop
  }

  toJSON() {
    return {
      inkl: this.#inkl,
      exkl: this.#exkl,
      moms: this.#moms,
      inkop: this.#inkop,
      marginal: this.#marginal,
      vinst: this.#vinst,
      fokus: this.fokus
    }
  }

  fromJSON(json) {
    if (typeof json === 'object') {
      this.#exkl.fromJSON(json.exkl)
      this.#inkl.fromJSON(json.inkl)
      this.#marginal.fromJSON(json.marginal)
      this.#vinst.fromJSON(json.vinst)
      this.#inkop.fromJSON(json.inkop)
      this.#moms = json.moms || this.#moms
      this.fokus = json.fokus || this.fokus
    }
  }
}
