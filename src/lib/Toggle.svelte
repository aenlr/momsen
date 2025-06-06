<script>
  let {id, label, enabled, onclick} = $props();
</script>

<div class="flex items-center">
  <label for={id} class="mr-3 text-sm" id={id + '-lbl'}>
    <span class="font-medium text-gray-900">{label}</span>
  </label>
  <button type="button"
          class={[enabled ? 'bg-blue-500' : 'bg-gray-200', "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"]}
          role="switch" aria-checked={enabled}
          id={id} aria-labelledby={id + '-lbl'}
          {onclick}
  >
    <span aria-hidden="true"
          class={[enabled ? 'translate-x-5' : 'translate-x-0', "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"]}></span>
  </button>
</div>
