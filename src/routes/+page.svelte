<script lang="ts">
	let player = {
		name: 'Player',
		hp: 10,
		maxHp: 10,
		atk: 3,
		def: 2
	};
</script>

<!-- display all the player's stats -->
<h1>{player.name}</h1>
<p>HP: {player.hp}/{player.maxHp}</p>
<p>ATK: {player.atk}</p>
<p>DEF: {player.def}</p>
