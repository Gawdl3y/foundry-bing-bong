import SoundPlayer from './base.mjs';

/**
 * Holds sound player types (extensions of {@link SoundPlayer}), mapped by their ID
 */
export default class SoundPlayerTypeCollection extends Map {
	/**
	 * Validates and adds a sound player type to the collection
	 * @param {Function} type Type to add (must extend {@link SoundPlayer})
	 * @throws {TypeError}
	 */
	add(type) {
		if (typeof type !== 'function') {
			throw new TypeError(`Type must be a class/constructor function - ${typeof type} provided.`);
		}

		// eslint-disable-next-line no-prototype-builtins
		if (!SoundPlayer.isPrototypeOf(type)) {
			throw new TypeError('Type must be a child of SoundPlayer.');
		}

		this.set(type.ID, type);
	}
}
