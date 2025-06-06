<script>
  import {Pris} from "./lib/Pris.svelte.js";
  import Toggle from "./lib/Toggle.svelte";

  const pris = new Pris()
  let priskalkyl = false

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
  <div class="border border-gray-200 rounded p-2 focus-within:outline-blue-500 focus-within:outline-2">
    <select id="moms" bind:value={pris.moms} class="w-full outline-none sm:text-lg">
      <option value={12}>12% (livsmedel)</option>
      <option value={25}>25% (vanligast)</option>
      <option value={6}>6%</option>
    </select>
  </div>
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

<div class="max-w-xl mx-auto sm:mt-10">
  <main class="p-4">
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
</div>
