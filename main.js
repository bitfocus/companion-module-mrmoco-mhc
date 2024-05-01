const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const got = require('got')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
// const UpdateFeedbacks = require('./feedbacks')
// const UpdateVariableDefinitions = require('./variables')


class ModuleInstance extends InstanceBase {

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		// this.updateFeedbacks() // export feedbacks
		// this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	async sendCam(str, method='PUT', body=null) {

		if (str) {

			const url = `https://${this.config.httpHost}:${this.config.httpPort}${str}`

			if (this.config.debug) {
				this.log('debug', `Sending : ${url}`)
			}

			try {
				const response = await got(
					url,
					{
						method: method,
						username:this.config.username,
						password:this.config.password,
						https: { rejectUnauthorized: false },
						json: body
					}
				)
				if(this.config.debug)
					this.log('debug', "Response: " + response.body);
			} catch (err) {
				this.log('error', "Error in REST call: " + err);
			}
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'httpHost',
				label: 'Server Host/IP',
				width: 8,
				regex: Regex.HOSTNAME,
			},
			{
				type: 'textinput',
				id: 'httpPort',
				label: 'Server Port',
				width: 4,
				regex: Regex.PORT,
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'User Name',
				width: 4,
				value: 'operator',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 4,
			},
			{
				type: 'checkbox',
				id: 'debug',
				label: 'Debug',
				width: 4,
				default: false,
			}
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
