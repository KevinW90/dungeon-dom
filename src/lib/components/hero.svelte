<script lang="ts">
  import game from "../stores";

</script>

<div class="hero-info">
  {$game?.hero.stats.hp}
</div>

<style>
  .hero-info {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;

    width: 100px;
    height: 50px;

    background-color: pink;
  }
</style>