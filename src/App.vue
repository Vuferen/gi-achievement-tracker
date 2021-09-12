<template>
	<div class="window" :data-theme="theme">
		<WindowTitleBar></WindowTitleBar>
		<div class="app">
			<ThemeToggleSwitch></ThemeToggleSwitch>
			<AchievementTable :achievements="this.achievements" @achievementsChanged="writeFile('achievements', this.achievements)" />
			<div class="spacer"></div>
		</div>
	</div>
</template>

<script>
	import AchievementTable from "@/components/AchievementTable";
	import ThemeToggleSwitch from "@/components/ThemeToggleSwitch";
	import WindowTitleBar from "@/components/WindowTitleBar";
	// eslint-disable-next-line no-unused-vars
	import { provide, reactive, readonly, ref } from "vue";

	export default {
		name: "App",
		components: {
			AchievementTable,
			ThemeToggleSwitch,
			WindowTitleBar,
		},
		setup() {
			let theme = ref("light");
			function toggleTheme() {
				theme.value = theme.value == "light" ? "dark" : "light";
			}

			provide("theme", theme);
			provide("toggleTheme", toggleTheme);
			return { theme };
		},
		data() {
			return {
				achievements: [],
				achievementsUpToDate: [],
				loaded: 0,
				nextId: 0,
				// theme: "light",
			};
		},
		// provide() {
		// 	return {
		// 		theme: this.theme,
		// 		toggleTheme: this.toggleTheme,
		// 	};
		// },
		methods: {
			readFile(fileName) {
				// ask backend to read file
				const payload = { fileName };
				window.ipc.send("READ_FILE", payload);
			},
			writeFile(fileName, newData) {
				// ask backend to write file
				const data = [];
				newData.forEach((achievement) => {
					//remove proxy
					data.push(Object.assign({}, achievement));
				});
				const payload = { fileName, data };
				// console.log(payload);
				window.ipc.send("WRITE_FILE", payload);
			},
			getAchievementsUpToDate() {
				window.ipc.send("GET_ACHIEVEMENTS", {});
			},
			getTheme() {
				window.ipc.send("THEME", {});
			},
		},
		mounted() {
			// Get latest achievements from wiki
			window.ipc.on("GET_ACHIEVEMENTS", (payload) => {
				// this.achievementsUpToDate = payload.content;
				let content = [].concat(...payload.content); // flatten array
				let filtered = content.filter((item) => item !== null); //remove nulls
				filtered.map((item) => (item.completed = false));
				this.achievementsUpToDate = filtered;
				this.loaded++;
			});
			this.getAchievementsUpToDate();

			// Get saved achievements
			window.ipc.on("READ_FILE", (payload) => {
				this.achievements = payload.content;
				this.loaded++;
				this.nextId = payload.content.length;
			});
			this.readFile("achievements");

			window.ipc.on("THEME", (payload) => {
				this.theme = payload;
			});
			this.getTheme();

			// Handle errors
			window.ipc.on("ERROR", (payload) => {
				console.log(payload);
			});
		},
		watch: {
			loaded: function() {
				if (this.loaded === 2) {
					let changed = false;
					if (this.achievements == null || this.achievements.length == 0) {
						this.achievementsUpToDate.forEach((achievement) => {
							// if (
							// 	achievement.name == "QUEST CLEAR" ||
							// 	achievement.name == "Hero-in-Training" ||
							// 	achievement.name == "Purveyor of Punishment"
							// ) {
							// 	if (
							// 		achievement.description == "Complete 20 Bounties." ||
							// 		achievement.description == "Complete 20 Requests." ||
							// 		achievement.description == "Deal over 20,000 CRIT DMG."
							// 	) {
							// 		achievement.name = achievement.name + " 2";
							// 	} else if (
							// 		achievement.description == "Complete 30 Bounties." ||
							// 		achievement.description == "Complete 30 Requests." ||
							// 		achievement.description == "Deal over 50,000 CRIT DMG."
							// 	) {
							// 		achievement.name = achievement.name + " 3";
							// 	}
							// }
							achievement.id = this.nextId++;
							this.achievements.push(achievement);
						});

						changed = true;
					} else {
						this.achievementsUpToDate.forEach((achievement) => {
							if (!this.achievements.find((achievementSaved) => achievementSaved.name === achievement.name)) {
								achievement.id = this.nextId++;
								this.achievements.push(achievement);
								changed = true;
							}
						});
					}
					if (changed) {
						// console.log(this.achievements);
						this.writeFile("achievements", this.achievements);
					}
				}
			},
		},
	};
</script>

<style lang="scss">
	@font-face {
		font-family: Assistant;
		src: url("assets/fonts/Assistant-Regular.ttf");
		font-weight: regular;
	}
	@font-face {
		font-family: Assistant;
		src: url("assets/fonts/Assistant-Bold.ttf");
		font-weight: bold;
	}
	.window {
		font-family: "Assistant", Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: var(--app-background-color);
		color: var(--text-color);
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.app {
		margin-top: 30px;
		padding: 25px 5% 0px 5%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 20px;
		height: auto;
		// max-height: 90vh;
		overflow-y: scroll;
		/* width */
		&::-webkit-scrollbar {
			width: 15px;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			background-color: transparent;
			// background: var(--color-background-a1);
			// margin-top: 38px;
			// border-radius: 0 0 5px;
			// margin-left: 15px;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			// border-radius: 15px;
			background: var(--color-background-a3);
			&:hover {
				background: var(--color-background-a4);
			}
		}
	}
	body {
		margin: 0;
		overflow-y: hidden;
	}
	.theme-switch {
		order: 2;
		justify-self: end;
	}
	.search-in-table {
		order: 1;
	}
	.achievement-table {
		order: 3;
		grid-column: 1 / 3;
	}
	.spacer {
		order: 4;
		height: 50px;
	}
</style>
