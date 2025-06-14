// Audio placeholders
// TODO: Initialize and load retrowave 80's style music
// const backgroundMusic = new Audio('path/to/retrowave_music.mp3');
// backgroundMusic.loop = true;

// TODO: Initialize and load alert sound
// const alertSound = new Audio('path/to/alert_sound.mp3');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic command room representation (a cube)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Grey color
const commandRoom = new THREE.Mesh(geometry, material);
scene.add(commandRoom);
// TODO: Replace cube with detailed command room model
// TODO: Load astronaut model and add to the command room scene

camera.position.z = 5;

// Game logic elements
const ultraButton = document.getElementById('ultraButton');
const speedInput = document.getElementById('speedInput');

// Placeholder for the car scene state
let inCarScene = false;

// Original command room color
const originalCommandRoomColor = commandRoom.material.color.getHex();

ultraButton.addEventListener('click', () => {
    const speedValue = speedInput.value;
    // Check if speed is 'infinity' (case-insensitive) or a very high number (e.g., >= 9999)
    if (speedValue.toLowerCase() === 'infinity' || parseFloat(speedValue) >= 9999) {
        if (!inCarScene) {
            console.log("Switching to car scene in Tokyo 1980s!");
            // Change scene: For now, just change the command room color
            commandRoom.material.color.setHex(0xff0000); // Change to red
            inCarScene = true;

            // TODO: Hide command room elements
            // TODO: Load/show car model
            // TODO: Load/show Tokyo 1980s environment
            // TODO: Start retrowave 80's style music
            // TODO: Position camera for car scene (e.g., driver's perspective)

        }
    } else {
        if (inCarScene) {
            // Optional: Revert if conditions are no longer met
            console.log("Returning to command room.");
            commandRoom.material.color.setHex(originalCommandRoomColor); // Revert to original color
            inCarScene = false;

            // TODO: Hide car scene elements
            // TODO: Load/show command room elements
            // TODO: Stop retrowave music / revert to ambient command room sounds (if any)
            // TODO: Reset camera to command room perspective
        }
    }
});

function triggerAlertVisuals() {
    let flashes = 0;
    const maxFlashes = 3; // Flash 3 times
    const flashInterval = 500; // ms between on/off state of flash

    const originalColor = renderer.getClearColor(new THREE.Color()).getHex();
    const isOriginallyTransparent = renderer.getClearAlpha() === 0; // Check if alpha was 0

    function flash() {
        if (flashes < maxFlashes * 2) { // Each flash has an 'on' and 'off' state
            if (flashes % 2 === 0) { // 'on' state
                renderer.setClearColor(0xff0000, 1); // Red
            } else { // 'off' state
                if (isOriginallyTransparent) {
                    renderer.setClearAlpha(0); // If it was transparent, make it transparent again
                } else {
                    renderer.setClearColor(originalColor, 1); // Original color
                }
            }
            flashes++;
            setTimeout(flash, flashInterval);
        } else {
             // Ensure it returns to original state
            if (isOriginallyTransparent) {
                renderer.setClearAlpha(0);
            } else {
                renderer.setClearColor(originalColor, 1);
            }
             // If you had a specific scene background color instead of just clearColor:
             // scene.background = originalSceneBackground; // Make sure to store originalSceneBackground
        }
    }
    flash();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Basic animation (rotate the command room)
    commandRoom.rotation.x += 0.01;
    commandRoom.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Simulate emergency on game start
function startEmergencySequence() {
    console.log("Emergency! Alert sound playing!");
    // TODO: Play actual alert sound here (e.g., alertSound.play())
    triggerAlertVisuals();
}

// Start the emergency after a short delay to ensure everything is loaded
setTimeout(startEmergencySequence, 1000);
