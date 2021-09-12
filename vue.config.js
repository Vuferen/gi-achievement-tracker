// module.exports = {
// 	pluginOptions: {
// 		electronBuilder: {
// 			nodeIntegration: true,
// 		},
// 	},
// };
// module.exports = {
// 	pluginOptions: {
// 		electronBuilder: {
// 			externals: ["nightmare"],
// 		},
// 	},
// };
module.exports = {
	chainWebpack: (config) => {
		config.plugin("html").tap((args) => {
			args[0].title = "Genshin Achievement Tracker";
			return args;
		});
	},
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				productName: "Genshin Achievement Tracker",
				appId: "org.genshinachievementtracker",
				win: {
					target: ["nsis"],
					icon: "public/AppIcon.ico",
					// requestedExecutionLevel: "requireAdministrator",
				},
				nsis: {
					installerIcon: "public/AppIcon.ico",
					uninstallerIcon: "public/AppIcon.ico",
					uninstallDisplayName: "CPU Monitor",
					// license: "license.txt",
					oneClick: false,
					allowToChangeInstallationDirectory: true,
				},
			},
		},
	},
};
