// Fires when the left mouse button is pressed when it overs
// over an element or it has just been pressed down over it
export function press(node) {
    function handlePress(event) {
        if (typeof event === 'object') {
            if (event.buttons === 1) {
                node.dispatchEvent(new CustomEvent('pressdown', {}));
            }
        }
    }

    node.addEventListener('mouseover', handlePress)
    node.addEventListener('mousedown', handlePress)

    return {
        destroy() {
            node.removeEventListener('mouseover', handlePress)
            node.removeEventListener('mousedown', handlePress)
        }
    };
}