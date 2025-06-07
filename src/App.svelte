<script>
  import {Pris} from "./lib/Pris.svelte.js"
  import Toggle from "./lib/Toggle.svelte"
  import {onMount} from "svelte"
  import {locale, locales, t} from "./i18n/i18n.svelte.js"
  import translations from "./i18n/translations.js";

  const pris = new Pris()
  let priskalkyl = $state(false)
  let initialized = false

  $effect(() => {
    const state = {
      pris,
      priskalkyl
    }
    const json = JSON.stringify(state)
    if (initialized) {
      sessionStorage.setItem('state', json)
      localStorage.setItem('state', json)
    }
  })

  onMount(() => {
    initialized = true
    const json = sessionStorage.getItem('state') ?? localStorage.getItem('state')
    if (!json) {
      return
    }
    try {
      const state = JSON.parse(json)
      priskalkyl = state.priskalkyl ?? priskalkyl
      if (state.pris) {
        pris.fromJSON(state.pris)
      }
    } catch (e) {
      console.error('State initialization error')
    }
  })

  function onclick(event) {
    event.target.select()
  }

  const inputClasses = 'border border-gray-200 rounded py-2 px-4 font-bold text-2xl w-full focus-within:outline-blue-500 focus-within:outline-2'
</script>

{#snippet Label(id, text)}
  <label for={id} class="font-medium sm:text-lg text-gray-600">{text}</label>
{/snippet}

{#snippet Momssats()}
  {@render Label("moms", $t("moms.select.label"))}
  <select id="moms" bind:value={pris.moms}
          class="w-full sm:text-lg border border-gray-200 rounded px-4 py-2 focus:outline-blue-500 focus:outline-2">
    <option value={25}>{$t('moms.option.25')}</option>
    <option value={12}>{$t('moms.option.12')}</option>
    <option value={6}>{$t('moms.option.6')}</option>
  </select>
{/snippet}

{#snippet InklusiveMoms()}
  {@render Label("inkl", $t("inkl.input.label"))}
  <input id="inkl" type="text" inputmode="numeric" bind:value={pris.inkl.text} class={[inputClasses, 'no-arrows']}
         {onclick} onfocus={() => pris.fokus = 'inkl'} onblur={pris.inkl.commit}>
{/snippet}

{#snippet ExklusiveMoms()}
  {@render Label("exkl", $t("exkl.input.label"))}
  <input id="exkl" type="text" inputmode="numeric" bind:value={pris.exkl.text} class={[inputClasses, 'no-arrows']}
         {onclick}
         onfocus={() => pris.fokus = 'exkl'} onblur={pris.exkl.commit}>
{/snippet}

<div class="max-w-xl mx-auto sm:mt-10 p-4">
  <main>
    <div class="flex items-center mb-2">
      <h1 class="font-medium text-3xl text-center mr-auto">Momsen</h1>
      <Toggle id="kalkylator" enabled={priskalkyl} onclick={() => priskalkyl = !priskalkyl}
              label={$t('priskalkyl.toggle.label')}/>
    </div>
    <div class="grid grid-cols-[max-content_1fr] gap-4 items-center">
      {#if priskalkyl}
        {@render Label("inkop", $t("inkop.input.label"))}
        <input id="inkop" type="text" inputmode="numeric" bind:value={pris.inkop.text} min="0"
               class={[inputClasses, 'no-arrows']} {onclick} onblur={pris.inkop.commit}>
        {@render InklusiveMoms()}

        {@render Label("vinst", $t("vinst.input.label"))}
        <input id="vinst" type="text" inputmode="numeric" bind:value={pris.vinst.text} class={[inputClasses]} step="0.5"
               {onclick} onblur={pris.vinst.commit}>

        {@render Label("marginal", $t("marginal.input.label"))}
        <input id="marginal" type="text" inputmode="numeric" bind:value={pris.marginal.text} class={inputClasses}
               {onclick} onblur={pris.marginal.commit}>

        {@render Momssats()}

      {:else}
        {@render InklusiveMoms()}
        {@render ExklusiveMoms()}
        {@render Momssats()}
      {/if}
    </div>
  </main>

  <footer class="pt-4">
    <nav>
      <ul class="flex items-center space-x-2 text-xs">
        <li>
          <span class="hidden sm:inline">{$t('footer.verktyg.label') + ' '}</span><a href="https://mitang.se"
                                                                                     class="underline">Mitang AB</a>
        </li>
        <li>
          <a href="https://github.com/aenlr/momsen" class="underline">Github</a>
        </li>
        <li>
          <a
            href="https://skatteverket.se/foretagochorganisationer/moms/saljavarorochtjanster/momssatspavarorochtjanster.4.58d555751259e4d66168000409.html"
            class="underline"
            target="_blank"
          >{$t('footer.momslank.text')}</a>
        </li>

        <li class="ml-auto flex items-center justify-end gap-1">
          {#each locales as lang}
            <button type="button" class="text-lg rounded-full shadow flex items-center p-1 aspect-square"
                    title={translations[lang].name} onclick={() => $locale = lang}>{translations[lang].flag}</button>
          {/each}
        </li>
      </ul>
    </nav>

  </footer>
</div>

<style>
  select {
    background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) no-repeat 95% 50%;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
  }
</style>
