<template>
	<div class="titleBar">
		<div class="title">
			<AppIcon></AppIcon>
			<span>Genshin Achievement Tracker</span>
		</div>
		<div class="controls">
			<ChromeMinimize @click="minimize()"></ChromeMinimize>
			<ChromeMaximize @click="maximize()" v-if="!isMaximized"></ChromeMaximize>
			<ChromeRestore @click="maximize()" v-else></ChromeRestore>
			<ChromeClose @click="close()"></ChromeClose>
		</div>
	</div>
</template>

<script>
	import ChromeClose from "@/components/codiconIcons/ChromeClose.vue";
	import ChromeMaximize from "@/components/codiconIcons/ChromeMaximize.vue";
	import ChromeRestore from "@/components/codiconIcons/ChromeRestore.vue";
	import ChromeMinimize from "@/components/codiconIcons/ChromeMinimize.vue";
	import AppIcon from "@/components/AppIcon.vue";

	export default {
		components: {
			ChromeClose,
			ChromeMaximize,
			ChromeRestore,
			ChromeMinimize,
			AppIcon,
		},
		data() {
			return {
				isMaximized: false,
			};
		},
		methods: {
			minimize() {
				window.ipc.send("APP_MINIMIZE", {});
			},
			maximize() {
				window.ipc.send("APP_MAXIMIZE", {});
			},
			close() {
				window.ipc.send("APP_CLOSE", {});
			},
		},
		mounted() {
			window.ipc.on("APP_MAXIMIZE", (payload) => {
				if (payload == "maximized") {
					this.isMaximized = true;
				} else {
					this.isMaximized = false;
				}
				// console.log(payload); //change icon depending on "maximized" or "minimized"
			});
		},
	};
</script>

<style lang="scss">
	.titleBar {
		z-index: 100;
		position: fixed;
		-webkit-app-region: drag;
		height: 30px;
		width: 100%;
		background-color: var(--color-titleBar);
		display: flex;
		justify-content: space-between;
		.title {
			// margin-left: 5%;
			padding-left: 15px;
			height: 100%;
			display: flex;
			align-items: center;
			font-size: 12px;
			color: var(--text-color-a2);
			svg {
				height: 20px;
				width: 20px;
				margin-right: 10px;
			}
		}
		.controls {
			color: white;
			display: flex;
			align-items: center;
			-webkit-app-region: no-drag;
			pointer-events: all;
			cursor: pointer;
			svg {
				fill: var(--text-color-a2);
				height: 16px;
				width: 16px;
				padding: 10px 15px;
			}
		}
	}
</style>
