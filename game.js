// Game Constants
const GAME_CONFIG = {
    ISLAND_SIZE: 500,
    FOREST_DENSITY: 0.3,
    ANIMAL_COUNT: 15,
    DAYS_TO_BOAT: 3,
    GAME_SPEED: 1,
};

// Game State
class GameState {
    constructor() {
        this.day = 1;
        this.time = 6; // 6:00 AM
        this.timeSpeed = 0.01; // Minutes per frame
        this.health = 100;
        this.maxHealth = 100;
        this.hunger = 100;
        this.maxHunger = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.inventory = {};
        this.boatReady = false;
        this.currentIsland = 1;
        this.totalIslands = 5;
        this.gameOver = false;
        this.gameOverReason = '';
    }

    addItem(itemName, quantity = 1) {
        if (this.inventory[itemName]) {
            this.inventory[itemName] += quantity;
        } else {
            this.inventory[itemName] = quantity;
        }
    }

    removeItem(itemName, quantity = 1) {
        if (this.inventory[itemName]) {
            this.inventory[itemName] -= quantity;
            if (this.inventory[itemName] <= 0) {
                delete this.inventory[itemName];
            }
        }
    }

    update(deltaTime) {
        // Update time
        this.time += this.timeSpeed;
        if (this.time >= 24) {
            this.time = 0;
            this.day++;
            if (this.day > GAME_CONFIG.DAYS_TO_BOAT && !this.boatReady) {
                this.boatReady = true;
            }
        }

        // Update stats
        this.hunger = Math.max(0, this.hunger - 0.02);
        this.energy = Math.min(this.maxEnergy, this.energy + 0.01);

        if (this.hunger <= 0) {
            this.health = Math.max(0, this.health - 0.5);
        }

        if (this.health <= 0) {
            this.gameOver = true;
            this.gameOverReason = 'You died from hunger and exhaustion...';
        }
    }
}

// Player Class
class Player {
    constructor(scene) {
        this.scene = scene;
        this.position = new THREE.Vector3(0, 5, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, -1);
        
        // Movement
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isJumping = false;
        this.onGround = false;
        
        // Physics
        this.speed = 0.3;
        this.jumpForce = 0.6;
        this.gravity = 0.01;
        this.friction = 0.85;
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.camera.position.copy(this.position);
        this.camera.position.y += 1.6; // Eye height
        
        // Mouse look
        this.pitch = 0;
        this.yaw = 0;
        this.sensitivity = 0.002;
        
        // Combat
        this.attackCooldown = 0;
        this.attackRange = 5;
        this.attackDamage = 20;
        this.lastAttackTime = 0;
        
        // Animation
        this.bobOffset = 0;
        this.bobSpeed = 0.1;
        this.bobAmount = 0.1;
        
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('click', () => this.attack());
        document.addEventListener('pointerlockchange', () => this.handlePointerLock());
        
        // Request pointer lock on click
        document.addEventListener('click', () => {
            document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
            document.body.requestPointerLock();
        });
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (key === 'w') this.moveForward = true;
        if (key === 's') this.moveBackward = true;
        if (key === 'a') this.moveLeft = true;
        if (key === 'd') this.moveRight = true;
        if (key === ' ') this.jump();
    }

    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (key === 'w') this.moveForward = false;
        if (key === 's') this.moveBackward = false;
        if (key === 'a') this.moveLeft = false;
        if (key === 'd') this.moveRight = false;
    }

    handleMouseMove(e) {
        if (document.pointerLockElement === document.body) {
            this.yaw -= e.movementX * this.sensitivity;
            this.pitch -= e.movementY * this.sensitivity;
            this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
        }
    }

    handlePointerLock() {
        // Pointer lock handling
    }

    jump() {
        if (this.onGround && gameState.energy > 10) {
            this.velocity.y += this.jumpForce;
            this.onGround = false;
            gameState.energy -= 10;
        }
    }

    attack() {
        if (gameState.energy > 5 && Date.now() - this.lastAttackTime > 500) {
            gameState.energy -= 5;
            this.lastAttackTime = Date.now();
            this.performAttack();
        }
    }

    performAttack() {
        // Find nearby animals and deal damage
        const attackRay = new THREE.Raycaster(
            this.camera.position,
            this.camera.getWorldDirection(new THREE.Vector3())
        );
        
        const intersects = attackRay.intersectObjects(this.scene.children, true);
        for (let intersect of intersects) {
            if (intersect.object.userData.isAnimal && intersect.distance < this.attackRange) {
                intersect.object.userData.health -= this.attackDamage;
                showMessage(`Hit ${intersect.object.userData.name}!`);
                break;
            }
        }
    }

    update(deltaTime) {
        // Calculate movement direction
        const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
        const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
        
        let moveDir = new THREE.Vector3();
        if (this.moveForward) moveDir.add(forward);
        if (this.moveBackward) moveDir.add(forward.multiplyScalar(-1));
        if (this.moveRight) moveDir.add(right);
        if (this.moveLeft) moveDir.add(right.multiplyScalar(-1));
        
        if (moveDir.length() > 0) {
            moveDir.normalize();
            this.velocity.x += moveDir.x * this.speed;
            this.velocity.z += moveDir.z * this.speed;
            gameState.energy -= 0.05;
            gameState.hunger -= 0.05;
        }
        
        // Apply friction and gravity
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;
        this.velocity.y -= this.gravity;
        
        // Update position
        this.position.add(this.velocity);
        
        // Ground collision (simple plane collision)
        if (this.position.y <= 5) {
            this.position.y = 5;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        
        // Update camera
        this.camera.position.copy(this.position);
        this.camera.position.y += 1.6;
        
        // Head bob animation
        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
            this.bobOffset += this.bobSpeed;
            this.camera.position.y += Math.sin(this.bobOffset) * this.bobAmount * 0.1;
        }
        
        // Update camera rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
        
        // Constrain to island
        const maxDist = GAME_CONFIG.ISLAND_SIZE / 2 - 20;
        const dist = Math.sqrt(this.position.x ** 2 + this.position.z ** 2);
        if (dist > maxDist) {
            const angle = Math.atan2(this.position.z, this.position.x);
            this.position.x = Math.cos(angle) * maxDist;
            this.position.z = Math.sin(angle) * maxDist;
        }
    }
}

// Animal Class
class Animal {
    constructor(scene, position, type = 'boar') {
        this.scene = scene;
        this.position = position.clone();
        this.type = type;
        this.health = 50;
        this.maxHealth = 50;
        this.hunger = 100;
        this.speed = 0.05;
        this.detectionRange = 30;
        this.attackRange = 3;
        this.attacking = false;
        this.direction = Math.random() * Math.PI * 2;
        
        this.mesh = this.createMesh();
        this.mesh.position.copy(this.position);
        this.mesh.userData.isAnimal = true;
        this.mesh.userData.health = this.health;
        this.mesh.userData.name = type;
        this.mesh.userData.instance = this;
        
        this.scene.add(this.mesh);
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1.5, 1, 2);
        const material = new THREE.MeshStandardMaterial({
            color: this.getColor(),
            roughness: 0.7,
            metalness: 0.1,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    getColor() {
        const colors = {
            boar: 0x8B6914,
            deer: 0x8B4513,
            wolf: 0x4A4A4A,
        };
        return colors[this.type] || 0x8B6914;
    }

    update(player) {
        // Update health display
        this.mesh.userData.health = this.health;
        
        if (this.health <= 0) {
            this.die(player);
            return;
        }

        // AI behavior
        const distToPlayer = this.position.distanceTo(player.position);

        if (distToPlayer < this.detectionRange) {
            // Chase player
            const direction = player.position.clone().sub(this.position).normalize();
            this.position.add(direction.multiplyScalar(this.speed * 1.5));
            this.mesh.position.copy(this.position);

            if (distToPlayer < this.attackRange) {
                this.attacking = true;
                if (Math.random() < 0.01) {
                    player.health -= 5;
                    showMessage(`${this.type} attacked you!`);
                }
            } else {
                this.attacking = false;
            }
        } else {
            // Wander
            this.direction += (Math.random() - 0.5) * 0.2;
            const moveDir = new THREE.Vector3(
                Math.sin(this.direction),
                0,
                Math.cos(this.direction)
            );
            this.position.add(moveDir.multiplyScalar(this.speed));
            this.mesh.position.copy(this.position);
            this.attacking = false;
        }

        // Keep on island
        const dist = Math.sqrt(this.position.x ** 2 + this.position.z ** 2);
        if (dist > GAME_CONFIG.ISLAND_SIZE / 2 - 20) {
            this.direction += Math.PI;
        }

        // Face direction
        this.mesh.rotation.y = this.direction + Math.PI / 2;
    }

    die(player) {
        player.scene.remove(this.mesh);
        const meatQuantity = Math.floor(Math.random() * 3) + 2;
        gameState.addItem(`${this.type}_meat`, meatQuantity);
        showMessage(`Defeated ${this.type}! Gained ${meatQuantity} ${this.type} meat`);
    }
}

// Island Generator
class IslandGenerator {
    constructor(scene) {
        this.scene = scene;
        this.animals = [];
    }

    generate(islandNumber = 1) {
        this.clearIsland();
        this.createTerrain();
        this.createTrees();
        this.createAnimals();
        if (gameState.boatReady && islandNumber < gameState.totalIslands) {
            this.createBoat();
        }
    }

    clearIsland() {
        this.animals.forEach(animal => {
            this.scene.remove(animal.mesh);
        });
        this.animals = [];
    }

    createTerrain() {
        // Ground plane
        const groundGeometry = new THREE.CircleGeometry(GAME_CONFIG.ISLAND_SIZE / 2, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.9,
            metalness: 0,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 4.8;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Ocean
        const oceanGeometry = new THREE.PlaneGeometry(2000, 2000);
        const oceanMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e4d7b,
            roughness: 0.5,
            metalness: 0.3,
            wireframe: false,
        });
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = 0;
        this.scene.add(ocean);
    }

    createTrees() {
        const treeCount = Math.floor(GAME_CONFIG.ISLAND_SIZE * GAME_CONFIG.FOREST_DENSITY);
        for (let i = 0; i < treeCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (GAME_CONFIG.ISLAND_SIZE / 2 - 30);
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            this.createTree(new THREE.Vector3(x, 5, z));
        }
    }

    createTree(position) {
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.copy(position);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.scene.add(trunk);

        // Foliage
        const foliageGeometry = new THREE.ConeGeometry(2, 3, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 0.7,
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.copy(position);
        foliage.position.y += 3;
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        this.scene.add(foliage);
    }

    createAnimals() {
        const animalTypes = ['boar', 'deer', 'wolf'];
        for (let i = 0; i < GAME_CONFIG.ANIMAL_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (GAME_CONFIG.ISLAND_SIZE / 2 - 50) + 30;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            const type = animalTypes[Math.floor(Math.random() * animalTypes.length)];
            const animal = new Animal(this.scene, new THREE.Vector3(x, 5, z), type);
            this.animals.push(animal);
        }
    }

    createBoat() {
        // Boat positioned at an edge
        const boatX = (GAME_CONFIG.ISLAND_SIZE / 2 - 30);
        const boatZ = 0;

        // Hull
        const hullGeometry = new THREE.BoxGeometry(3, 1.5, 8);
        const hullMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.6,
        });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.position.set(boatX, 5.5, boatZ);
        hull.castShadow = true;
        hull.receiveShadow = true;
        hull.userData.isBoat = true;
        this.scene.add(hull);

        // Sail
        const sailGeometry = new THREE.PlaneGeometry(3, 5);
        const sailMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.5,
        });
        const sail = new THREE.Mesh(sailGeometry, sailMaterial);
        sail.position.set(boatX, 7, boatZ);
        sail.rotation.z = 0.3;
        sail.castShadow = true;
        sail.receiveShadow = true;
        this.scene.add(sail);

        // Mast
        const mastGeometry = new THREE.CylinderGeometry(0.15, 0.15, 7, 8);
        const mastMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.7,
        });
        const mast = new THREE.Mesh(mastGeometry, mastMaterial);
        mast.position.set(boatX, 6.5, boatZ);
        mast.castShadow = true;
        mast.receiveShadow = true;
        this.scene.add(mast);
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.statsElement = document.getElementById('stats');
        this.dayElement = document.getElementById('day-text');
        this.timeElement = document.getElementById('time-text');
        this.inventoryElement = document.getElementById('inventory-items');
    }

    update() {
        // Update health bar
        const healthPercent = (gameState.health / gameState.maxHealth) * 100;
        document.getElementById('health-bar').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent = `${Math.ceil(gameState.health)}/${gameState.maxHealth}`;

        // Update hunger bar
        const hungerPercent = (gameState.hunger / gameState.maxHunger) * 100;
        document.getElementById('hunger-bar').style.width = hungerPercent + '%';
        document.getElementById('hunger-text').textContent = `${Math.ceil(gameState.hunger)}/${gameState.maxHunger}`;

        // Update energy bar
        const energyPercent = (gameState.energy / gameState.maxEnergy) * 100;
        document.getElementById('energy-bar').style.width = energyPercent + '%';
        document.getElementById('energy-text').textContent = `${Math.ceil(gameState.energy)}/${gameState.maxEnergy}`;

        // Update day and time
        this.dayElement.textContent = `Day ${gameState.day}`;
        const hours = Math.floor(gameState.time);
        const minutes = Math.floor((gameState.time - hours) * 60);
        this.timeElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        // Update inventory
        this.updateInventory();
    }

    updateInventory() {
        this.inventoryElement.innerHTML = '';
        for (const [itemName, quantity] of Object.entries(gameState.inventory)) {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `
                <div>${itemName}</div>
                <span class="inventory-item-count">${quantity}</span>
            `;
            div.onclick = () => this.useItem(itemName);
            this.inventoryElement.appendChild(div);
        }
    }

    useItem(itemName) {
        if (itemName.includes('meat')) {
            gameState.hunger = Math.min(gameState.maxHunger, gameState.hunger + 30);
            gameState.removeItem(itemName, 1);
            showMessage(`Ate ${itemName}. Hunger restored!`);
            this.updateInventory();
        }
    }
}

// Global Functions
let scene, camera, renderer, player, islandGen, gameState, uiManager;

function showMessage(text, duration = 2000) {
    const msgElement = document.getElementById('messages');
    msgElement.textContent = text;
    msgElement.classList.add('visible');
    setTimeout(() => {
        msgElement.classList.remove('visible');
    }, duration);
}

function initGame() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -300;
    directionalLight.shadow.camera.right = 300;
    directionalLight.shadow.camera.top = 300;
    directionalLight.shadow.camera.bottom = -300;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.physicallyCorrectLights = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Player
    player = new Player(scene);
    scene.add(player.camera);

    // Game state
    gameState = new GameState();
    uiManager = new UIManager();

    // Island
    islandGen = new IslandGenerator(scene);
    islandGen.generate(gameState.currentIsland);

    // Show intro message
    showMessage("Welcome to Chocobaddie! Erlin the Explorer's Island Adventure\nSurvive for 3 days to find the boat!", 4000);
    showMessage(`Island 1 of ${gameState.totalIslands}`, 3000);

    // Hide loading screen
    document.getElementById('loading-screen').classList.add('hidden');

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera = player.camera;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Start game loop
    animate();
}

function checkBoatCollision(player) {
    for (let mesh of scene.children) {
        if (mesh.userData && mesh.userData.isBoat) {
            const distance = player.position.distanceTo(mesh.position);
            if (distance < 5) {
                return true;
            }
        }
    }
    return false;
}

function nextIsland() {
    gameState.currentIsland++;
    if (gameState.currentIsland > gameState.totalIslands) {
        gameState.gameOver = true;
        gameState.gameOverReason = `You reached the final island! Journey complete!\nDays survived: ${gameState.day}`;
    } else {
        player.position.set(0, 5, 0);
        gameState.boatReady = false;
        islandGen.generate(gameState.currentIsland);
        showMessage(`Arrived at Island ${gameState.currentIsland}!\nSurvive 3 more days...`, 3000);
    }
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = 1 / 60;

    // Update game state
    gameState.update(deltaTime);
    player.update(deltaTime);

    // Update animals
    islandGen.animals.forEach(animal => {
        animal.update(player);
    });

    // Check boat collision
    if (gameState.boatReady && checkBoatCollision(player)) {
        nextIsland();
    }

    // Update UI
    uiManager.update();

    // Check game over
    if (gameState.gameOver) {
        endGame();
    }

    // Render
    renderer.render(scene, player.camera);
}

function endGame() {
    document.getElementById('loading-screen').classList.add('hidden');
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.classList.add('visible');
    document.getElementById('game-over-title').textContent = gameState.gameOverReason.split('\n')[0];
    document.getElementById('game-over-message').textContent = gameState.gameOverReason;
    document.getElementById('game-over-stats').textContent = 
        `Days Survived: ${gameState.day}\nIslands Reached: ${gameState.currentIsland}\nItems Collected: ${Object.keys(gameState.inventory).length}`;
    renderer.render(scene, player.camera);
}

// Start game when page loads
window.addEventListener('load', initGame);
