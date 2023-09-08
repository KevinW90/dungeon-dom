<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import KeyPressListener from "../input/KeyPressListener";

  const dispatch = createEventDispatcher();

  let actionListener: any;
  onMount(() => {
    actionListener = new KeyPressListener('Enter', () => {
      dispatch('done');
    })
    
  });
  
  onDestroy(() => {
    actionListener.unbind();
  })

  // $: console.log('text message props', messageProps)
</script>

  <div class="textMessage">
    <p class="textMessage_p">
      <slot />
    </p>
    <button class="textMessage_button" on:click={() => dispatch('done')}>Next</button>
  </div>

<style>
  .textMessage {
    width: 100%;

    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    position: absolute;
    /* top: 0; */
    left: 0;
    right: 0;
    bottom: 0;

    padding: 2rem;
    background-color: #fff;
  }

  .textMessage_p {
    font-size: 2rem;
  }

  .textMessage_button {
    height: fit-content;
    align-self: end;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
  }
</style>