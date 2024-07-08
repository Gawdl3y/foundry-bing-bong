import SoundPlayer from './base.mjs';

/**
 * Sound player that chooses a random sound from its playlist
 */
export default class RandomSoundPlayer extends SoundPlayer {
	static ID = 'random';

	choose() {
		if (!this.hasSounds()) return null;
		const sounds = Array.from(this.playlist.sounds.values());
		return sounds[Math.floor(Math.random() * sounds.length)];
	}
}
