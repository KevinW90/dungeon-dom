<script lang="ts">
  import game from "../stores";

</script>

<div class="hero-info">
  <div class="hero-info__hp">
    <div class="hero-info__hp__inner" style="width: {($game?.hero.stats.hp / $game?.hero.stats.maxHp) * 100}%;">
      {$game?.hero.stats.hp}
    </div>
  </div>
</div>

<style>
  .hero-info {
    position: absolute;
    bottom: 0;
    z-index: 99;

    width: 100%;
    height: fit-content;

    padding: 2rem;
    border-radius: 1rem;

    background-color: none;
    
    display: flex;
    justify-content: center;
  }

  .hero-info__hp {
    position: relative;
    width: 7rem;
    height: 25px;
    border-radius: .5rem;
    background-color: grey;
  }
  
  .hero-info__hp__inner {
    position: absolute;
    left: 0;
    top: 0;
    /* z-index: -1; */
    height: 100%;
    background-color: red;
    border-radius: .5rem;
  }
</style>