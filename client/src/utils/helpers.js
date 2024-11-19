export function stringToRGB(str) {
    // Validate input
    // if (str.length < 2 || str.length > 10 || !/^[A-Z]+$/.test(str)) {
    //     throw new Error('Input must be a string of length 2 to 10 consisting only of capital letters');
    // }

    // Convert each letter to a number 0-25 (A=0, B=1, ..., Z=25) and sum them
    const total = [...str].reduce((sum, char) => sum + (char.charCodeAt(0) - 65), 0);

    // Scale values to RGB range while ensuring a valid distribution
    const numChars = str.length;
    const red = (total * 255 / (25 * numChars)) % 256;
    const green = ((total * 512 / (25 * numChars)) + 85) % 256;
    const blue = ((total * 1024 / (25 * numChars)) + 170) % 256;

    // Round the values to integers
    const r = Math.floor(red);
    const g = Math.floor(green);
    const b = Math.floor(blue);

    return {
        rgb: [r, g, b],
        cssString: `rgba(${r}, ${g}, ${b}, 0.3)`
    };
}

export function getColorFromPercentChange(percentChange) {
    // Convert percentage to decimal and cap at ±5% for more sensitive color scaling
    const normalizedChange = Math.max(Math.min(percentChange, 5), -5) / 5;

    if (normalizedChange >= 0) {
        // Positive change: pure green with variable intensity
        return {text: `rgba(0, ${Math.round(120 + (normalizedChange * 105))}, 50, 1)`, bg: `rgba(0, ${Math.round(120 + (normalizedChange * 105))}, 0, 0.4)`}

    } else {
        // Negative change: pure red with variable intensity
        return {bg: `rgba(${Math.round(120 + (Math.abs(normalizedChange) * 105))}, 0, 0, 0.4)`, text: `rgba(${Math.round(120 + (Math.abs(normalizedChange) * 105))}, 0, 50, 1)`}

    }
}