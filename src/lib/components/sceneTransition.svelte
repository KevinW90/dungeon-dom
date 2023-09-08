<script>
  import { fade } from "svelte/transition";

</script>

<div class="screen-transition" in:fade out:fade/>

<style>
  .screen-transition {
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  
    background-color: white;
  
  }

</style>