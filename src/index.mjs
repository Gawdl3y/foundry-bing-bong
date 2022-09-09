import * as log from './logger.mjs';
import SoundPlayerTypeCollection from './players/collection.mjs';
import {default as SoundPlayer} from './players/base.mjs';
import {default as RandomSoundPlayer} from './players/random.mjs';
import {default as SequentialSoundPlayer} from './players/sequential.mjs';
export {SoundPlayer, RandomSoundPlayer, SequentialSoundPlayer, SoundPlayerTypeCollection};

/**
 * Bing Bong! main class that handles a game instance
 */
export default class BingBong {
	/**
	 * Game instance to use
	 * @type {Game}
	 */
	game = null;

	/**
	 * Sound player types that correspond to selection modes
	 * @type {Map<string, Function>}
	 */
	soundPlayerTypes = new SoundPlayerTypeCollection();

	/**
	 * Sound players currently in use for each message type
	 * @type {Object}
	 * @property {SoundPlayer} normal Sound player being used for normal (non-roll) chat messages
	 * @property {SoundPlayer} rolls Sound player being used for dice roll chat messages
	 */
	soundPlayers = {
		normal: null,
		rolls: null,
	}

	/**
	 * Listener for the chat message hook
	 * @type {?number}
	 */
	#hookListener = null;

	/**
	 * @param {Game} game Game instance to handle
	 */
	constructor(game) {
		log.info('Initializing');
		this.game = game;
		this.soundPlayerTypes.add(RandomSoundPlayer);
		this.soundPlayerTypes.add(SequentialSoundPlayer);
		this.#registerSettings();
	}

	/**
	 * Handles a received chat message
	 * @param {*} msg Chat message to process
	 */
	handleChatMessage(msg) {
		const player = msg.isRoll ? this.soundPlayers.rolls : this.soundPlayers.normal;
		if(!player) return;
		if(!msg.sound) msg.sound = player.choose().path;
	}

	/**
	 * Validates the current state and sets up the hook and all sound players as necessary
	 */
	setup() {
		log.info('Configuring sound players');
		let anyPlayersCreated = false;

		// Set up the players
		for(const player of Object.keys(this.soundPlayers)) {
			// If the player type is silent, we don't need to do anything for this player
			const type = this.game.settings.get('bing-bong', `playerType.${player}`);
			if(type === 'none') {
				this.soundPlayers[player] = null;
				continue;
			}

			// Verify the playlist exists
			const playlistName = this.game.settings.get('bing-bong', `playlist.${player}`);
			const playlist = this.game.playlists.getName(playlistName);
			if(!playlist) {
				log.info(`Nonexistent ${player} playlist specified:`, playlistName);
				this.soundPlayers[player] = null;
				continue;
			}

			// Prepare the player
			this.soundPlayers[player] = new (this.soundPlayerTypes.get(type))(this.game, playlist);
			this.soundPlayers[player].preload();
			anyPlayersCreated = true;
			log.info(`Sound player ${player} created:`, this.soundPlayers[player]);
		}

		// If no player was created, then we don't need to do anything else
		if(!anyPlayersCreated) {
			this.teardown();
			return;
		}

		// Register the chat message hook
		if(!this.#hookListener) {
			log.info('Registering hook');
			this.#hookListener = Hooks.on('renderChatMessage', this.handleChatMessage.bind(this));
		}
	}

	/**
	 * Unregisters the hook if it's registered
	 */
	teardown() {
		if(this.#hookListener) {
			log.info('Unregistering hook');
			Hooks.off('renderChatMessage', this.#hookListener);
			this.#hookListener = null;
		}
	}

	/**
	 * Registers the settings for the module to the game instance
	 */
	#registerSettings() {
		log.info('Registering settings');

		// Create the choices object for the selection mode settings
		const typeChoices = {none: this.game.i18n.localize('bing-bong.playerTypes.none')};
		for(const type of this.soundPlayerTypes.keys()) {
			typeChoices[type] = this.game.i18n.localize(`bing-bong.playerTypes.${type}`);
		}

		// Register the settings
		for(const player of Object.keys(this.soundPlayers)) {
			this.game.settings.register('bing-bong', `playlist.${player}`, {
				name: this.game.i18n.localize(`bing-bong.setting.playlist.${player}.name`),
				hint: this.game.i18n.localize(`bing-bong.setting.playlist.${player}.hint`),
				scope: 'world',
				config: true,
				type: String,
				default: '',
				onChange: this.setup.bind(this),
			});
			this.game.settings.register('bing-bong', `playerType.${player}`, {
				name: this.game.i18n.localize(`bing-bong.setting.playerType.${player}.name`),
				hint: this.game.i18n.localize(`bing-bong.setting.playerType.${player}.hint`),
				scope: 'client',
				config: true,
				type: String,
				default: player === 'rolls' ? 'none' : 'random',
				choices: typeChoices,
				onChange: this.setup.bind(this),
			});
		}
	}
}

Hooks.on('init', () => { game.BingBong = new BingBong(game); });
Hooks.on('ready', () => { game.BingBong.setup(); });
