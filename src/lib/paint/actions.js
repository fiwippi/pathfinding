export function press(node) {
    let x;
    let y;

    function handleMouseDown(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(new CustomEvent('drawbrush', {
            detail: { x, y }
        }));

        node.addEventListener('mousemove', handleMouseMove);
        node.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(new CustomEvent('drawbrush', {
            detail: { x, y }
        }));
    }

    function handleMouseUp() {
        node.removeEventListener('mousemove', handleMouseMove);
        node.removeEventListener('mouseup', handleMouseUp);
    }

    node.addEventListener('mousedown', handleMouseDown);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMouseDown);
        }
    };
}