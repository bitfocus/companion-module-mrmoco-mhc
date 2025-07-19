const { Regex } = require("@companion-module/base")
const { flat } = require("./upgrades")

module.exports = function (self) {

	const ROBOT_OPTION = {
		id: 'robot',
		type: 'textinput',
		label: 'Robot Name',
		tooltip: "Robot name given in MHC Network Setup (eg: ARC-UHD)",
		default: "Unknown",
		regex: "/^[A-Za-z].+$/",
		required: true
	}

	self.setActionDefinitions({
		recall_preset: {
			name: 'Recall Preset',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID',
					default: 0,
					min: 0,
					max: 100,
				},
				{
					id: 'num',
					type: 'number',
					label: 'Preset ID',
					default: 0,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot}/preset/${event.options.num}`
				self.sendCam(url)
			},
		},
		recall_move: {
			name: 'Recall Move',
			options: [
				{
					id: 'robot',
					type: 'number',
					label: 'Robot ID',
					default: 0,
					min: 0,
					max: 100,
				},
				{
					id: 'num',
					type: 'number',
					label: 'Move ID',
					default: 0,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				const url = `/v1/robots/${event.options.robot}/moves/${event.options.num}/begin`
				self.sendCam(url, 'POST')
			},
		},
		stop_robot: {
			name: 'Stop Robot',
			options: [ ROBOT_OPTION ],
			callback: async (event) => {
				const idx = await self.getRobotIndex(event.options.robot)
				const url = `/v1/robots/${idx}/stop`
				self.sendCam(url, 'PUT')
			}
		},
		stop_all: {
			name: 'Stop All Robots',
			callback: async (event) => {
				self.sendCam('/v1/robots/stop')
			},
		},
		set_move_option: {
			name: 'Set Move Option',
			callback: async (event) => {
				const url = `/v1/robots/0/moves/settings`
				options = {
					oneClickStart: true
				}
				self.sendCam(url, 'PATCH', options)
			}
		},
		set_move_option_v2: {
			name: 'Set Move Options (V2)',
			options: [
				ROBOT_OPTION,
				{
					type: 'dropdown',
					label: 'One Click Start',
					id: 'oneClickStart',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
					],
					default: '1',
				},
				{
					type: 'dropdown',
					label: 'Loop',
					id: 'loop',
					choices: [
						{ id: false, label: 'Off' },
						{ id: true, label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				var url = '/v1/robots/0/moves/settings'
				if(event.options.robot) {
					const idx = await self.getRobotIndex(event.options.robot)
					url = `/v1/robots/${idx}/moves/settings`
				}
				options = {
					oneClickStart: event.options.oneClickStart,
					loop: event.options.loop
				}
				self.sendCam(url, 'PATCH', options)
			}
		},
		enable_robot: {
			name: 'Robot Enable/Disable',
			options: [
				ROBOT_OPTION,
				{
					type: 'dropdown',
					label: 'Enabled On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				const to_enable = event.options.bol === '1'
				// do not throw disconnected error when enabling
				const idx = await self.getRobotIndex(event.options.robot, false, !to_enable)
				const url = `/v1/robots/${idx}/configuration`
				data = {
					enable: to_enable
				}
				self.sendCam(url, 'PATCH', data)
			}
		},
		set_input: {
			name: 'Set Pan Bar Input On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'Input Number',
					id: 'input',
					choices: [
						{ id: 1, label: 'Input 1' },
						{ id: 2, label: 'Input 2' },
					],
					default: '1',
				},
				{
					type: 'dropdown',
					label: 'Enabled On/Off',
					id: 'state',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {

				const idx = await self.getRobotIndex('Pan-Bars (cartoni)', true)
				const url = `/v1/devices/${idx}/inputs`

				payload = {
					index: event.options.input,
					state: event.options.state === '1'
				}

				self.sendCam(url, 'PATCH', payload)
			}
		},
		manage_tracking: {
			name: 'Robot Tracking On/Off',
			options: [
				ROBOT_OPTION,
				{
					type: 'dropdown',
					label: 'Enabled On/Off',
					id: 'state',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '1',
				}
			],
			callback: async (event) => {
				const idx = await self.getRobotIndex(event.options.robot)
				const url = `/v1/robots/${idx}/tracking`
				options = {
					TrackingEnabled: event.options.state === '1'
				}
				self.sendCam(url, 'PATCH', options)
			}
		},
		recall_preset_v2: {
			name: 'Recall Preset (V2)',
			options: [
				ROBOT_OPTION,
				{
					id: 'num',
					type: 'number',
					label: 'Preset Index (1-100)',
					default: 1,
					min: 1,
					max: 100,
				},
			],
			callback: async (event) => {
				const idx = await self.getRobotIndex(event.options.robot)
				const url = `/v1/robots/${idx}/preset/${event.options.num -1}/tracking`
				self.sendCam(url)
			},
		},
		recall_move_v2: {
			name: 'Recall Move (V2)',
			options: [
				ROBOT_OPTION,
				{
					id: 'num',
					type: 'number',
					label: 'Move ID (1-100)',
					default: 1,
					min: 1,
					max: 100,
				},
			],
			callback: async (event) => {
				const idx = await self.getRobotIndex(event.options.robot)
				const url = `/v1/robots/${idx}/moves/${event.options.num - 1}/begin`
				self.sendCam(url, 'POST')
			},
		},
		set_preset_options: {
			name: 'Set Preset Options',
			options: [
				ROBOT_OPTION,
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Recall Style',
					default: "Goto",
					choices: [
						{ id: 'Goto', label: 'Goto' },
						{ id: 'Cut', label: 'Cut' },
					],
				},
			],
			callback: async (event) => {
				const idx = await self.getRobotIndex(event.options.robot)
				const url = `/v1/robots/${idx}/presetSettings`
				options = {
					movementMode: event.options.mode,
				}
				self.sendCam(url, 'PATCH', options)
			},
		},
	})
}
