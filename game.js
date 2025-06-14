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

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5); // Position the light
scene.add(directionalLight);

// Basic command room representation (a cube)
// const geometry = new THREE.BoxGeometry(); // OLD
// const material = new THREE.MeshBasicMaterial({ color: 0x808080 }); // OLD
// const commandRoom = new THREE.Mesh(geometry, material); // OLD
// scene.add(commandRoom); // OLD
// TODO: Replace cube with detailed command room model
// TODO: Load astronaut model and add to the command room scene

const commandRoomGroup = new THREE.Group();
scene.add(commandRoomGroup);

const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
floor.position.y = -2;
commandRoomGroup.add(floor);

const wallGeometry = new THREE.PlaneGeometry(10, 5);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });

const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.y = 0.5; // Assuming floor is at -2, walls go up 2.5 units from there.
backWall.position.z = -5;
commandRoomGroup.add(backWall);

const sideWall = new THREE.Mesh(wallGeometry, wallMaterial);
sideWall.position.y = 0.5;
sideWall.position.x = -5;
sideWall.rotation.y = Math.PI / 2;
commandRoomGroup.add(sideWall);

const consoleMaterial = new THREE.MeshStandardMaterial({ color: 0x333388 });

const mainConsoleGeometry = new THREE.BoxGeometry(3, 1.5, 1);
const mainConsole = new THREE.Mesh(mainConsoleGeometry, consoleMaterial);
mainConsole.position.set(0, -1.25, -3.5);
commandRoomGroup.add(mainConsole);

const sideConsoleGeometry = new THREE.BoxGeometry(1, 1, 2);
const sideConsole = new THREE.Mesh(sideConsoleGeometry, consoleMaterial);
sideConsole.position.set(-3, -1.5, -1);
commandRoomGroup.add(sideConsole);

// Store original colors of command room parts
const originalMaterials = new Map();
commandRoomGroup.children.forEach(child => {
    if (child.material) {
        originalMaterials.set(child.uuid, child.material.clone());
    }
});

// camera.position.z = 5; // Old or default
camera.position.set(0, 2, 7); // Move camera up a bit and further back
camera.lookAt(0, 0, 0); // Ensure it's looking at the center of the scene or the commandRoomGroup's center

// Game logic elements
const ultraButton = document.getElementById('ultraButton');
const speedInput = document.getElementById('speedInput');
const timerDisplay = document.getElementById('timerDisplay');
const speedDisplay = document.getElementById('speedDisplay');

// Initialize Speed Display on Load
if (speedDisplay && speedInput) { // Ensure elements exist
    speedDisplay.textContent = "Current Speed: " + speedInput.value;
}

// Placeholder for the car scene state
let inCarScene = false;
let startTime;

ultraButton.addEventListener('click', () => {
    const speedValue = speedInput.value;
    if (speedDisplay) { // Ensure the element exists
        speedDisplay.textContent = "Current Speed: " + speedValue;
    }
    if (speedValue.toLowerCase() === 'infinity' || parseFloat(speedValue) >= 9999) {
        if (!inCarScene) {
            console.log("Switching to car scene in Tokyo 1980s!");
            commandRoomGroup.children.forEach(child => {
                if (child.material) {
                    // Ensure we have a material to change
                    // For simplicity, let's make everything red.
                    // More complex logic could use a map or different colors per part.
                    child.material.color.setHex(0xff0000);
                }
            });
            inCarScene = true;
            // TODO: Implement actual scene switch here (hiding group, showing car scene group)
        }
    } else {
        if (inCarScene) {
            console.log("Returning to command room.");
            commandRoomGroup.children.forEach(child => {
                if (child.material && originalMaterials.has(child.uuid)) {
                    // Restore original material properties
                    child.material.color.copy(originalMaterials.get(child.uuid).color);
                    // If other properties were changed, copy them back too.
                    // child.material = originalMaterials.get(child.uuid).clone(); // Alternative: restore full material
                }
            });
            inCarScene = false;
            // TODO: Implement actual scene switch here
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
    // commandRoom.rotation.x += 0.01; // OLD
    // commandRoom.rotation.y += 0.01; // OLD

    if (startTime) { // Check if startTime has been initialized
        const elapsedTime = Date.now() - startTime;
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Format as MM:SS
        const formattedTime =
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0');

        if (timerDisplay) { // Ensure the element exists
            timerDisplay.textContent = "Timer: " + formattedTime;
        }
    }

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
    startTime = Date.now(); // Initialize startTime here
}

// Start the emergency after a short delay to ensure everything is loaded
setTimeout(startEmergencySequence, 1000);
