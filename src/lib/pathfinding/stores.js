import { writable } from 'svelte/store';

// Keeps track of if the fill brush is adding or removing cells
export const fillStore = writable("");
// Keeps track of whether the program is running or not
export const runningStore = writable(false);