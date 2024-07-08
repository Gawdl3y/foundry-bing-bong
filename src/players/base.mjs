import * as log from '../logger.mjs';

/**
 * Base sound player that handles a playlist
 */
export default class SoundPlayer {
	/**
	 * Unique identifier for the type of sound player
	 * @type {string}
	 */
	static ID = 'base';

	/**
	 * {@link https://foundryvtt.com/api/classes/foundry.audio.AudioHelper.html|FoundryVTT AudioHelper} class to use for
	 * static method calls. This exists only to avoid deprecation warnings on Foundry >= v12 while maintaining full
	 * compatibility with Foundry < v12.
	 * @type {Function}
	 */
	// eslint-disable-next-line no-undef
	static #AudioHelper = foundry.audio?.AudioHelper ?? AudioHelper;

	/**
	 * Game instance to use
	 * @type {Game}
	 */
	game;

	/**
	 * Playlist this player operates on
	 * @type {Playlist}
	 */
	playlist;

	/**
	 * Whether we have already sent a notification about the playlist having no sounds
	 * @type {boolean}
	 */
	#notifiedNoSounds = false;

	/**
	 * @param {Game} game Game instance to use
	 * @param {Playlist} playlist Playlist to operate on
	 */
	constructor(game, playlist) {
		this.game = game;
		this.playlist = playlist;
	}

	/**
	 * Chooses a sound to play from the playlist
	 * @returns {PlaylistSound}
	 */
	choose() {
		throw new Error(`${this.constructor.name} has not implemented a choose() method.`);
	}

	/**
	 * Chooses and plays a sound from the playlist
	 * @param {boolean} allClients Whether to request all connected clients to play the sound as well
	 * @returns {Promise<Sound>}
	 */
	play(allClients = false) {
		const sound = this.choose();
		if (sound) return SoundPlayer.#AudioHelper.play({ src: sound.path }, allClients);
		return Promise.resolve(null);
	}

	/**
	 * Preloads all sounds in the playlist
	 * @param {boolean} allClients Whether to request all connected clients to preload the sounds as well
	 * @returns
	 */
	preload(allClients = false) {
		const promises = [];
		for (const sound of this.playlist.sounds.values()) {
			promises.push(this.game.audio.preload(sound.path));
			if (allClients) promises.push(SoundPlayer.#AudioHelper.preloadSound(sound.path));
		}
		return Promise.all(promises);
	}

	/**
	 * Checks whether the playlist has sounds in it
	 * @returns {boolean}
	 */
	hasSounds() {
		// Reset the notification status if there are sounds
		if (this.playlist.sounds.size > 0) {
			this.#notifiedNoSounds = false;
			return true;
		}

		// If we haven't already, notify of the playlist being empty
		if (!this.#notifiedNoSounds) {
			log.info(`bing-bong | Playlist ${this.playlist} contains no sounds:`, this.playlist);
			this.#notifiedNoSounds = true;
		}

		return false;
	}
}
