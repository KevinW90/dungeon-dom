<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import KeyPressListener from "../input/KeyPressListener";
  const dispatch = createEventDispatcher();
  
  export let message = '';
  export let speed = 40;
  let currentText = '';
  let currentIndex = 0;
  let isDone = false;

  async function type() {
    while (currentIndex < message.length) {
      if (isDone) {
        currentText = message;
        break;
      }
      currentText += message[currentIndex];
      currentIndex++;
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    dispatch('effectDone');
  }

  let actionListener: any;
  onMount(() => {
    // resets the type writer effect in App
    dispatch('mount');

    actionListener = new KeyPressListener('Enter', () => {
      isDone = true;
    })
    
  });
  
  onDestroy(() => {
    actionListener.unbind();
  })
  
  type();
</script>

<span>{currentText}</span>