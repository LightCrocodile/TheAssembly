const output = document.getElementById('output');
const input = document.getElementById('input');

// Sound effects
const typeSound = new Audio('https://freesound.org/data/previews/318/318681_5121236-lq.mp3'); // Replace with a link to a typewriter sound
typeSound.volume = 0.1; // Adjust volume as needed

// Boot-up sequence with delay to mimic old computer startup
function bootSequence() {
    const bootMessages = [
        "Booting The Assembly OS v1.0...",
        "Initializing hardware...",
        "Loading kernel...",
        "Mounting drives...",
        "Establishing secure command interface...",
        "System ready. Type 'help' for a list of commands.\n"
    ];

    let index = 0;

    // Display boot messages with a delay
    const interval = setInterval(() => {
        if (index < bootMessages.length) {
            output.textContent += bootMessages[index] + '\n';
            index++;
        } else {
            clearInterval(interval);
            input.focus(); // Focus on the input after boot
        }
    }, 800); // Adjust timing to your preference
}

// Automatically focus on the input field when the page loads and run boot sequence
window.onload = () => {
    bootSequence();
};

// Function to convert hexadecimal to ASCII
function hexToAscii(hex) {
    const str = hex.match(/.{1,4}/g) // Match every 4 characters (2 bytes)
        .map((h) => String.fromCharCode(parseInt(h, 16))) // Convert to ASCII
        .join('');
    return str;
}

// Password and protected file content
const password = "1508"; // Define the password
const protectedFileContent = hexToAscii("&#116;&#104;&#101;&#32;&#99;&#101;&#122;&#97;&#114;&#32;&#105;&#115;&#32;&#112;&#108;&#101;&#97;&#115;&#101;&#100;"); // Decoding to ASCII

// Command dictionary
const commands = {
    'help': 'Available commands: ls, cat *filename*',
    'ls': 'Available files: mission_brief.txt',
    'cat mission_brief.txt': '',
    'cat assembly_log.txt': '',
    'cat project_overlord.txt': 'Enter the password to access the file:'
};

// Function to display text letter by letter
function typeText(text, callback) {
    const characters = text.split('');
    let index = 0;

    const interval = setInterval(() => {
        if (index < characters.length) {
            output.innerHTML += characters[index];
            index++;
            output.scrollTop = output.scrollHeight; // Auto-scroll to the bottom
            typeSound.play(); // Play typing sound
        } else {
            clearInterval(interval);
            if (callback) callback(); // Execute callback after typing is done
        }
    }, 50); // Adjust typing speed here
}

let awaitingPassword = false; // Flag to know if the user is typing a password

// Event listener for handling commands
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = input.value.toLowerCase().trim();
        output.innerHTML += `\n> ${command}\n`;

        // If awaiting password, don't process other commands
        if (awaitingPassword) {
            const enteredPassword = input.value.trim();
            input.value = ''; // Clear input field

            // Check if the entered password matches
            if (enteredPassword === password) {
                output.innerHTML += `\n${protectedFileContent}`; // Show file content as ASCII
            } else {
                output.innerHTML += `\nAccess denied. Incorrect password.`; // Deny access
            }

            awaitingPassword = false; // Stop awaiting password
            return; // Exit to avoid running the rest of the command logic
        }

        // Handle normal commands
        if (command === 'cat mission_brief.txt') {
            typeText('Mission Brief: Where images stand still, the key to unlocking the now lies beneath the surface of the forgotten past. Seek the cipher from the depths of the assembly.\n', () => {
                typeText('Log: [REDACTED] - Initiating Project Overload...\n', () => {
                    output.innerHTML += '\nType "cat project_overlord.txt" to access the locked file.';
                });
            });

        } else if (command === 'cat project_overlord.txt') {
            output.innerHTML += 'Enter the password to access the file:';
            awaitingPassword = true; // Set flag to true so the next input is treated as a password

        } else if (commands[command]) {
            output.innerHTML += `${commands[command]}`;
        } else {
            output.innerHTML += `Command not recognized. Type 'help' for a list of commands.`;
        }

        input.value = ''; // Clear input
        output.scrollTop = output.scrollHeight; // Auto-scroll to the bottom
    }
});

// Refocus the input field if clicked outside
document.addEventListener('click', () => {
    input.focus();
});
