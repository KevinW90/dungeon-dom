<script lang="ts">
  import { onMount } from 'svelte';
  import Game from './lib/Game';
  import TextMessage from './lib/components/textMessage.svelte';
  import TypeWriterEffect from './lib/components/typeWriterEffect.svelte';
  import { fade } from 'svelte/transition';
  import SceneTransition from './lib/components/sceneTransition.svelte';
  import { utils } from './lib/utils';
  import game from './lib/stores';
  import Hero from './lib/components/hero.svelte';

  let showMessage = false;
  let message: any;
  let onComplete: any;
  // track if the typeWriterEffect is done
  let typeWriterDone = false;
  // scene transition
  let sceneTransition = false;


  function handleShowTextMessage(e: any) {
    message = e.detail.message;
    onComplete = e.detail.onComplete;
    showMessage = true;
  }

  function handleTextMessageDone() {
    // check to see if the type writer effect is done playing
    if (typeWriterDone) {
      // if yes, then complete the event
      showMessage = false;
      onComplete();
    } else {
      // if no, then set the type writer effect to done
      typeWriterDone = true;
    }
  }

  function handleSceneTransition(e: any) {
    console.log(e)
    sceneTransition = true;
  }

  function handleSceneTransitionEnd() {
    sceneTransition = false;
  }

  function handleBattle(e: any) {
    console.log('battle', e)
    e.detail.onComplete();
  }

  onMount(() => {
    const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
    const canvasContainer = document.querySelector('.canvas-container') as HTMLDivElement;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // aspect ratio scaling
    const aspectRatio = canvas.width / canvas.height;
    if (screenWidth/screenHeight > aspectRatio) {
      canvasContainer.style.width = `${screenWidth/4}px`;
      canvasContainer.style.height = `${(screenWidth / aspectRatio) / 4}px`;
      canvas.width = screenWidth / 4;
      canvas.height = (screenWidth / aspectRatio) / 4;
    } else {
      canvasContainer.style.width = `${(screenHeight * aspectRatio) / 4}px`;
      canvasContainer.style.height = `${screenHeight / 4}px`;
      canvas.width = (screenHeight * aspectRatio) / 4;
      canvas.height = screenHeight / 4;
    }

    let numCols = Math.ceil(canvas.width / 24);
    let numRows = Math.ceil(canvas.height / 24);



    game.set(new Game({
      center: { r: utils.withGrid((numRows - 1) / 2), c: utils.withGrid((numCols - 1) / 2) },
      element: document.querySelector('.game-container'),
    }));

    // text message listener
    document.addEventListener('textMessage', handleShowTextMessage);
    // scene transition listener
    document.addEventListener('sceneTransition', handleSceneTransition)
    // scene transition end listener
    document.addEventListener('sceneTransitionEnd', handleSceneTransitionEnd)
    // battle listener
    document.addEventListener('battle', handleBattle)
    
  });

</script>

<div class="game-container">
  <Hero />
  {#if sceneTransition}
    <SceneTransition />
  {/if}
  <div class="canvas-container">
    <canvas id="game-canvas" width="360" height="216"></canvas>
  </div>
  {#if showMessage}
    <TextMessage on:done={handleTextMessageDone}>
      <TypeWriterEffect {message} on:effectDone={() => typeWriterDone = true} on:mount={() => typeWriterDone = false}/>
    </TextMessage>
  {/if}
</div>

<style>
  .game-container {
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    position: relative;

  }

 .canvas-container {
  /* width: 360px; */
  /* height: 216px; */
  /* width: 100vw; */
  /* height: 100vh; */

  scale: 4;
 }

 .game-container canvas {
  image-rendering: pixelated;
 }

 
</style>