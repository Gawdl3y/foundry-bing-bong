import SoundPlayer from './base.mjs';

/**
 * Sound player that chooses sounds from its playlist sequentially. Upon reaching the end, it starts from the beginning.
 */
export default class SequentialSoundPlayer extends SoundPlayer {
	static ID = 'sequential';

	/**
	 * Index of the sound to play next
	 * @type {number}
	 */
	#currentSound = 0;

	choose() {
		if(!this.hasSounds()) return null;
		const sounds = Array.from(this.playlist.sounds.values());
		if(this.#currentSound >= sounds.length) this.#currentSound = 0;
		return sounds[this.#currentSound++];
	}
}
