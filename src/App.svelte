<script>
  import {Pris} from "./lib/Pris.svelte.js";
  import Toggle from "./lib/Toggle.svelte";
  import {onMount} from "svelte";

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
    }
  })

  onMount(() => {
    initialized = true
    const json = sessionStorage.getItem('state')
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

  const inputClasses = 'border border-gray-200 rounded p-4 font-bold text-2xl w-full focus-within:outline-blue-500 focus-within:outline-2'
</script>

{#snippet Label(id, text)}
  <label for={id} class="font-medium sm:text-xl">{text}</label>
{/snippet}

{#snippet Momssats()}
  {@render Label("moms", "Momssats")}
  <select id="moms" bind:value={pris.moms}
          class="w-full sm:text-lg border border-gray-200 rounded px-4 py-2 focus:outline-blue-500 focus:outline-2">
    <option value={12}>12% (livsmedel)</option>
    <option value={25}>25% (vanligast)</option>
    <option value={6}>6%</option>
  </select>
{/snippet}

{#snippet InklusiveMoms()}
  {@render Label("inkl", "Pris (inkl. moms)")}
  <input id="inkl" type="text" inputmode="numeric" bind:value={pris.inkl.text} class={[inputClasses, 'no-arrows']}
         {onclick} onfocus={() => pris.fokus = 'inkl'} onblur={pris.inkl.commit}>
{/snippet}

{#snippet ExklusiveMoms()}
  {@render Label("exkl", "Exklusive moms")}
  <input id="exkl" type="text" inputmode="numeric" bind:value={pris.exkl.text} class={[inputClasses, 'no-arrows']}
         {onclick}
         onfocus={() => pris.fokus = 'exkl'} onblur={pris.exkl.commit}>
{/snippet}

<div class="max-w-xl mx-auto sm:mt-10 p-4">
  <main class="">
    <div class="flex items-center">
      <h1 class="font-medium text-3xl text-center mb-2 mr-auto">Momsen</h1>
      <Toggle id="kalkylator" enabled={priskalkyl} onclick={() => priskalkyl = !priskalkyl} label="Priskalkyl"/>
    </div>
    <div class="grid grid-cols-[max-content_1fr] gap-4 items-center">
      {#if priskalkyl}
        {@render Label("inkop", "Inköp (exkl. moms)")}
        <input id="inkop" type="text" inputmode="numeric" bind:value={pris.inkop.text} min="0"
               class={[inputClasses, 'no-arrows']} {onclick}>

        {@render InklusiveMoms()}
        {@render ExklusiveMoms()}
        {@render Momssats()}

        {@render Label("vinst", "Vinst (kronor)")}
        <input id="vinst" type="text" inputmode="numeric" bind:value={pris.vinst.text} class={[inputClasses]} step="0.5"
               {onclick}>

        {@render Label("marginal", "Marginal (%)")}
        <input id="marginal" type="text" inputmode="numeric" bind:value={pris.marginal.text} class={inputClasses}
               {onclick}>
      {:else}
        {@render InklusiveMoms()}
        {@render ExklusiveMoms()}
        {@render Momssats()}
      {/if}
    </div>
  </main>

  <footer class="[@media(min-height:568px)]:fixed bottom-0 py-4">
    <nav>
      <ul class="flex items-center space-x-2 text-xs">
        <li>
          Ett verktyg från <a href="https://mitang.se" class="underline">Mitang AB</a>
        </li>
        <li>
          <a
            href="https://skatteverket.se/foretagochorganisationer/moms/saljavarorochtjanster/momssatspavarorochtjanster.4.58d555751259e4d66168000409.html"
            class="underline"
            target="_blank"
          >Momssatser
            på Skatteverket</a>
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
