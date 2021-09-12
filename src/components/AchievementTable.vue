<template>
	<input type="search" placeholder="Search" class="search-in-table" v-model="filters.name.value" />
	<!-- <div class="table-wrapper"> -->
	<VTable :data="this.achievements" :filters="filters" class="achievement-table">
		<template #head>
			<tr>
				<VTh sortKey="completed" class="completed"></VTh>
				<VTh sortKey="name" class="achievement">Achievement</VTh>
				<VTh sortKey="category" class="category">Category</VTh>
				<VTh sortKey="description" class="description">Description</VTh>
				<VTh sortKey="requirements" class="requirements">Requirements</VTh>
				<VTh sortKey="primogems" class="primogems">Primogems</VTh>
			</tr>
		</template>
		<template #body="{rows}">
			<tr v-for="achievement in rows" :key="achievement.id">
				<td>
					<BaseCheckbox
						class="checkbox-base"
						:id="achievement.name"
						:checked="achievement.completed"
						@clicked="
							achievement.completed = !achievement.completed;
							$emit('achievementsChanged');
						"
					></BaseCheckbox>
					<!-- <input
						type="checkbox"
						name=""
						:id="achievement.name"
						:checked="achievement.completed"
						@click="
							achievement.completed = !achievement.completed;
							$emit('achievementsChanged');
						"
					/> -->
				</td>
				<td>{{ achievement.name }}</td>
				<td>{{ achievement.category }}</td>
				<td>{{ achievement.description }}</td>
				<td>{{ achievement.requirements }}</td>
				<td>{{ achievement.primogems }}</td>
			</tr>
		</template>
	</VTable>
	<!-- </div> -->
</template>

<script>
	import BaseCheckbox from "@/components/checkbox/BaseCheckbox";
	// import achievements from "@/assets/genshin-achievements";
	export default {
		components: {
			BaseCheckbox,
		},
		props: {
			achievements: Array,
		},
		emits: ["achievementsChanged"],
		data() {
			return {
				filters: {
					name: { value: "", keys: ["name", "category", "description", "requirements"] },
				},
			};
		},
	};
</script>

<style lang="scss">
	input[type="search"] {
		width: clamp(100px, 250px, 300px);
		height: 37px;
		padding: 0px 20px;
		border-radius: 20px;
		background-color: var(--color-background-a3);
		border: 1px solid var(--color-background-a3);
		color: var(--text-color-a1);
		box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
		&:focus {
			border: 1px solid var(--color-accent);
			outline: none;
		}
		&::placeholder {
			color: var(--text-color-a2);
		}
	}

	.achievement-table {
		text-align: left;
		// border-collapse: collapse;
		// height: 70vh;
		// margin-bottom: 25px;
		width: 100%;
		background-color: var(--color-background-a4);
		box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.1), 0px 0px 3px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		border-spacing: 0;
		// background-color: var(--color-background-a4);
		// display: block;

		thead {
			// display: inline-block;
			// width: 100%;
			div {
				//Sorting svg
				display: flex;
				min-width: 1.5em;
			}
			th {
				background-color: var(--table-head);
				height: 38px;
				padding: 0 20px 0 0;
				justify-self: center;
				cursor: pointer;
				// position: sticky; //needed for head to stay at top
				// top: 0; //needed for head to stay at top
				&:first-child {
					border-top-left-radius: 5px;
				}

				&:last-child {
					border-top-right-radius: 5px;
				}
			}
			svg {
				justify-self: center;
				// align-self: center;
				padding-left: 2px;
			}
			.completed {
				padding-left: 15px;
				div {
					justify-content: center;
					width: fit-content;
					min-width: 20px;
				}
			}
			.achievement {
				// min-width: 200px;
				width: clamp(200px, 300px, 400px);
			}
			.category {
				width: 130px;
			}
			.primogems {
				min-width: 110px;
			}
		}

		tr {
			background-color: var(--table-background-color);
			&:nth-of-type(2n) {
				background-color: var(--table-row-2n);
			}
			&:last-child {
				td:first-child {
					border-bottom-left-radius: 5px;
				}
				td:last-child {
					border-bottom-right-radius: 5px;
				}
			}
		}
		.checkbox-base {
			width: 20px;
			height: 20px;
			margin-left: 14px;
		}
		td {
			padding-right: 20px;
			padding-top: 5px;
			padding-bottom: 5px;
			color: var(--text-color-a1);
		}
	}
</style>
