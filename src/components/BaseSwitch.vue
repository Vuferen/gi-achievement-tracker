<template>
	<label class="switch">
		<img class="icon left" v-if="svgLeft" :src="svgLeft" />
		<img class="icon right" v-if="svgRight" :src="svgRight" />
		<input type="checkbox" @click="$emit('clicked')" :checked="checked" />
		<span class="slider"></span>
	</label>
</template>

<script>
	export default {
		props: {
			checked: Boolean,
			svgLeft: String,
			svgRight: String,
		},
		// data() {
		// 	return {
		// 		checked: this.startChecked,
		// 	};
		// },
		// computed: {
		// 	checked() {
		// 		return this.startChecked;
		// 	},
		// },
	};
</script>

<style lang="scss">
	.switch {
		$width: 65px;
		$height: 37px;
		$border: 4px;
		$iconSize: 14px;
		position: relative;
		display: inline-block;
		width: $width;
		height: $height;
		input {
			display: none;
		}
		.slider {
			z-index: 2;
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background-color: var(--color-background-a3);
			transition: 0.4s;
			border-radius: $height;
			box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
			&::before {
				position: absolute;
				content: "";
				height: $height - $border * 2;
				width: $height - $border * 2;
				left: $border;
				bottom: $border;
				background-color: var(--color-background-a1);
				transition: 0.4s;
				border-radius: $height;
			}
		}
		input:checked + .slider {
			background-color: var(--color-accent);
			&::before {
				transform: translateX($width - $height);
			}
		}
		.icon {
			position: absolute;
			z-index: 5;
			height: $iconSize;
			width: $iconSize;
			top: $height/2 - $iconSize/2;
			&.left {
				left: $border + (($height - $border * 2)/2) - $iconSize/2;
			}
			&.right {
				right: $border + (($height - $border * 2)/2) - $iconSize/2;
			}
		}
	}
</style>
