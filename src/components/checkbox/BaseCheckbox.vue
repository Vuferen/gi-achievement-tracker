<template>
	<label class="wrapper flex items-center">
		<input class="checkbox" type="checkbox" @click="$emit('clicked')" :checked="checked" />
		<span class="checkmark">
			<CheckboxTick class="checkbox-tick"></CheckboxTick>
		</span>
	</label>
</template>

<script>
	import CheckboxTick from "@/components/checkbox/CheckboxTick";
	export default {
		components: {
			CheckboxTick,
		},
		props: {
			checked: Boolean,
		},
	};
</script>

<style lang="scss" scoped>
	/* Customize the label (the wrapper) */
	.wrapper {
		display: block;
		position: relative;
		/* padding-left: 35px; */
		/* margin-bottom: 6px; */
		width: 20px;
		height: 20px;
		cursor: pointer;
		font-size: 22px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		font-size: 16px;
	}
	/* Hide the browser's default checkbox */
	.wrapper input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}
	/* Create a custom checkbox */
	.checkmark {
		position: absolute;
		top: 0;
		left: 0;
		height: 16px;
		width: 16px;
		border-radius: 2px;
		background-color: transparent;
		border: 2px solid var(--color-background-a4);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.checkbox-tick {
		height: 18px;
		width: 18px;
		padding: 0 0 1px 1px;
		display: none;
		fill: var(--color-background);
		stroke: white;
	}
	/* On mouse-over, add a grey background color */
	.wrapper:hover input ~ .checkmark {
		// background-color: var(--color-background-a3);
		border-color: var(--color-accent);
	}
	/* When the checkbox is checked, add a blue background */
	.wrapper input:checked ~ .checkmark {
		background-color: var(--color-accent);
		border-color: var(--color-accent);
	}
	/* Create the checkmark/indicator (hidden when not checked) */
	/* .checkmark:after {
		content: "";
		position: absolute;
		display: none;
	} */
	/* Show the checkmark when checked */
	.wrapper input:checked ~ .checkmark .checkbox-tick {
		display: block;
	}
	/* Style the checkmark/indicator */
	.wrapper .checkmark:after {
		left: 7px;
		top: 0px;
		width: 7px;
		height: 15px;
		border: solid white;
		border-width: 0 3px 3px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
</style>
