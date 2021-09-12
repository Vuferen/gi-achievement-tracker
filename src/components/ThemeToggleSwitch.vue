<template>
	<div class="theme-switch">
		<BaseSwitch
			:checked="checked"
			@clicked="toggleTheme"
			:svgLeft="require('@/assets/svg/Sun.svg')"
			:svgRight="require('@/assets/svg/Moon.svg')"
		></BaseSwitch>
	</div>
</template>

<script>
	import BaseSwitch from "@/components/BaseSwitch";
	// eslint-disable-next-line no-unused-vars
	import { inject } from "vue";

	export default {
		name: "ThemeToggleSwitch",
		components: {
			BaseSwitch,
		},
		setup() {
			const theme = inject("theme");
			const toggleTheme = inject("toggleTheme");

			return {
				theme,
				toggleTheme,
			};
		},
		computed: {
			checked() {
				return this.theme == "dark" ? true : false;
			},
		},
	};
</script>

<style lang="scss">
	.theme-switch {
		height: 37px;
		.slider {
			background-color: hsl(220, 12%, 17%);
			&::before {
				background-color: hsl(207, 78%, 44%);
			}
		}
		input:checked + .slider {
			background-color: hsl(207, 78%, 44%);
			&::before {
				background-color: hsl(220, 12%, 17%);
			}
		}
	}
</style>
