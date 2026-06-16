// ====================================================================
// finale.js: ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ (NEON + CRYSTAL REDIRECT)
// ====================================================================

(() => {
    // ------------------------------------------------------------------
    // 1. КОНФИГУРАЦИЯ
    // ------------------------------------------------------------------
    const CONTAINER_ID = 'scene-container';
    
    const FULL_LETTER_TEXT = 
    `Привет! Эльвира, с днём рождения!

    Сделал тебе сайт. Потратил на него... ну, скажем так, немало времени. Там куча всего: системная консоль с пасхалками, визуальная новелла про рыцаря и принцессу (сюжет придумывал сам, кстати), гача с уникальными наградами и 3D-сцена с тортом и нашими фото.
    
    Надеюсь, зайдёт. Если где-то что-то сломается или будут баги — не ругайся, я старался.
    
    Спасибо тебе вообще за всё. Благодаря тебе я взялся за эти проекты и понял, что мне это реально нравится. Набрался практики, разобрался, куда хочу двигаться дальше.
    
    Но главное не это. Спасибо просто за то, что ты есть. Время проведённое с тобой реально интересное и тёплое. Ну и просто... ты классная.
    Let it be a great year ahead!`;

    const TABLE_RADIUS = 1.2;
    const CAKE_SCALE = 0.0075;
    const LETTER_SCALE = 0.15;
    const CRYSTAL_SCALE = 0.1; // Масштаб твоего кристалла
    const CAMERA_POS = { x: 0, y: 1.2, z: 3.5 }; 
    const AUTO_ROTATE_SPEED = 0.001;

    // Файлы
    const MODELS = {
        cake: 'models/3DCAKE.glb',       
        letter: 'models/letter.glb',
        crystall: 'models/crystall.glb' // Твой кристалл
    };

    const PHOTO_PATHS = [
        'photos/photo1.jpeg', 
        'photos/photo2.jpeg', 
        'photos/photo3.jpeg', 
        'photos/photo4.jpg'
    ];

    // Конфигурация для парящих фотографий
    const PHOTO_CONFIGS = [
        { x: -0.9, z: 0.0, y: 0.5, rotY: 1.5, tiltX: -0, maxW: 0.8, maxH: 1.0 },
        { x: 0.9, z: 0.2, y: 0.5, rotY: -1.6, tiltX: -0, maxW: 0.8, maxH: 1.0 },
        { x: 0.1, z: -0.95, y: 0.55, rotY: -0.15, tiltX: -0, maxW: 0.8, maxH: 1.0 },
        { x: -0.2, z: 0.85, y: 0.5, rotY: 1.0, tiltX: -0, maxW: 0.8, maxH: 1.0 }
    ];

    // ------------------------------------------------------------------
    // 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
    // ------------------------------------------------------------------
    const container = document.getElementById(CONTAINER_ID);
    const letterModal = document.getElementById('letter-modal');
    const closeButton = document.querySelector('.close-button');
    const letterTextContainer = document.getElementById('letter-text');
    const instructionDiv = document.getElementById('instruction');

    let scene, camera, renderer;
    const worldGroup = new THREE.Group(); 
    let letterMesh = null;
    let crystallMesh = null; // Переменная для хранения кристалла
    let autoRotateEnabled = true;
    let typingTimeout;

    const gltfLoader = new THREE.GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let isPointerDown = false;
    let pointerStartX = 0, pointerStartY = 0, prevPointerX = 0;

    // ------------------------------------------------------------------
    // 3. ИНИЦИАЛИЗАЦИЯ
    // ------------------------------------------------------------------
    function init() {
        if (!container) return;

        // Сцена и Туман
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1a0b2e, 4, 12);
        scene.add(worldGroup);

        // Камера
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(CAMERA_POS.x, CAMERA_POS.y, CAMERA_POS.z);
        camera.lookAt(0, 0, 0);

        // Рендерер
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true, 
            powerPreference: "high-performance" 
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        setupLights();
        createGradientBackground(); 
        loadObjects();
        addEventListeners();
        animate();
    }

    function setupLights() {
    // Свет сверху
    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(0, 5, 0);
    worldGroup.add(topLight);
    
    // Свет спереди-слева (подсветит боковые грани)
    const sideLight = new THREE.DirectionalLight(0x8A2BE2, 1.5);
    sideLight.position.set(-5, 2, 5);
    worldGroup.add(sideLight);

    // Свет сзади-справа (создаст контурные блики)
    const backLight = new THREE.DirectionalLight(0x4B0082, 1.5);
    backLight.position.set(5, 2, -5);
    worldGroup.add(backLight);
    
    // Мягкий заполняющий свет
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    worldGroup.add(ambient);
}

    function createGradientBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 1; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#050208');   
        gradient.addColorStop(0.6, '#1a0b2e'); 
        gradient.addColorStop(1, '#6a3082');   
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 512);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
    }

    // ------------------------------------------------------------------
    // 4. ЗАГРУЗКА ОБЪЕКТОВ
    // ------------------------------------------------------------------
    function loadObjects() {
        // 1. Стол
        const tableGeo = new THREE.CylinderGeometry(TABLE_RADIUS, TABLE_RADIUS, 0.05, 64);
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
        const table = new THREE.Mesh(tableGeo, tableMat);
        table.position.y = -0.025;
        worldGroup.add(table);

        // 2. Торт
        gltfLoader.load(MODELS.cake, (g) => {
            const cake = g.scene;
            cake.scale.setScalar(CAKE_SCALE);
            cake.position.set(0, 0, 0);
            worldGroup.add(cake);
        }, undefined, (err) => console.error('Ошибка торта:', err));

        // 3. Парящие фото
        PHOTO_CONFIGS.forEach((cfg, i) => {
            if (i < PHOTO_PATHS.length) {
                addFloatingPhoto(PHOTO_PATHS[i], cfg);
            }
        });

        // 4. Письмо с НЕОНОВОЙ ОБВОДКОЙ
        gltfLoader.load(MODELS.letter, (g) => {
            letterMesh = g.scene;
            
            letterMesh.traverse((child) => {
                if (child.isMesh) {
                    const edges = new THREE.EdgesGeometry(child.geometry);
                    const lineMat = new THREE.LineBasicMaterial({ 
                        color: 0x00ffe7, 
                        transparent: true, 
                        opacity: 0.2 
                    });
                    const outline = new THREE.LineSegments(edges, lineMat);
                    child.add(outline);
                }
            });

            letterMesh.scale.setScalar(LETTER_SCALE);
            letterMesh.position.set(0.3, -0.35, 0.2);
            worldGroup.add(letterMesh);
        }, undefined, (err) => console.error('Ошибка письма:', err));

        // 5. Загрузка КРИСТАЛЛА со светящимся неоновым материалом
        gltfLoader.load(MODELS.crystall, (g) => {
    crystallMesh = g.scene;

    crystallMesh.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xB3022A,        
                emissive: 0x72021B,      
                emissiveIntensity: 0.4,  // 
                roughness: 0.5,          //
                metalness: 1.1,          // 
                side: THREE.DoubleSide   // 
            });
        }
    });

    crystallMesh.scale.setScalar(CRYSTAL_SCALE);
    crystallMesh.position.set(-0.1, 0.1, 0.8);
    worldGroup.add(crystallMesh);
}, undefined, (err) => console.error('Ошибка кристалла:', err));

    function addFloatingPhoto(path, cfg) {
        textureLoader.load(path, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            const aspect = tex.image.width / tex.image.height;
            let w = cfg.maxW;
            let h = cfg.maxW / aspect;
            if (h > cfg.maxH) { h = cfg.maxH; w = h * aspect; }

            const material = new THREE.MeshBasicMaterial({ 
                map: tex, 
                side: THREE.DoubleSide, 
                transparent: true,
                opacity: 0.95,
                depthWrite: true
            });

            const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
            photoMesh.position.set(cfg.x, cfg.y, cfg.z);
            photoMesh.rotation.y = cfg.rotY;
            photoMesh.rotation.x = THREE.MathUtils.degToRad(cfg.tiltX);

            photoMesh.userData.floatOffset = Math.random() * Math.PI * 2;
            photoMesh.userData.floatSpeed = 0.5 + Math.random() * 0.5;
            
            worldGroup.add(photoMesh);
        }, undefined, (err) => console.error('Ошибка фото:', path, err));
    }

    }

    // ------------------------------------------------------------------
    // 5. УПРАВЛЕНИЕ И ИНТЕРФЕЙС (RAYCASTING РАЗДЕЛЕН)
    // ------------------------------------------------------------------
    function addEventListeners() {
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        container.addEventListener('pointerdown', (e) => {
            isPointerDown = true;
            autoRotateEnabled = false;
            pointerStartX = e.clientX; 
            pointerStartY = e.clientY;
            prevPointerX = e.clientX;
            
            const audio = document.getElementById('background-audio');
            if (audio && audio.paused) audio.play().catch(() => {});
        });

        window.addEventListener('pointermove', (e) => {
            if (!isPointerDown) return;
            worldGroup.rotation.y += (e.clientX - prevPointerX) * 0.005;
            prevPointerX = e.clientX;
        });

        window.addEventListener('pointerup', (e) => {
            if (!isPointerDown) return;
            isPointerDown = false;
            
            const dist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
            
            // Если это был чистый клик/тап (а не свайп для вращения сцены)
            if (dist < 10) {
                pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
                pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(pointer, camera);

                // 1. Проверяем клик по КРИСТАЛЛУ -> Редирект на 5 страницу
                if (crystallMesh) {
                    const intersectsCrystal = raycaster.intersectObject(crystallMesh, true);
                    if (intersectsCrystal.length > 0) {
                        window.location.href = 'gate.html'; // Ссылка на твой финальный сайт признания
                        return; // Выходим, чтобы другие триггеры не сработали
                    }
                }

                // 2. Проверяем клик по ПИСЬМУ -> Открытие модалки
                if (letterMesh) {
                    const intersectsLetter = raycaster.intersectObject(letterMesh, true);
                    if (intersectsLetter.length > 0) {
                        openModal();
                    }
                }
            }
            
            setTimeout(() => { 
                if (!isPointerDown) autoRotateEnabled = true; 
            }, 3000);
        });

        if (closeButton) closeButton.addEventListener('click', closeModal);
    }

    function openModal() {
        if (!letterModal) return;
        letterModal.style.display = 'block';
        if (instructionDiv) instructionDiv.style.display = 'none';
        autoRotateEnabled = false;
        letterTextContainer.innerHTML = '';
        typeWriter(FULL_LETTER_TEXT, 0);
    }

    function closeModal() {
        letterModal.style.display = 'none';
        if (instructionDiv) instructionDiv.style.display = 'block';
        autoRotateEnabled = true;
        clearTimeout(typingTimeout);
    }

    function typeWriter(text, i) {
        if (i < text.length) {
            letterTextContainer.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            letterTextContainer.scrollTop = letterTextContainer.scrollHeight;
            typingTimeout = setTimeout(() => typeWriter(text, i + 1), 40);
        }
    }

    // ------------------------------------------------------------------
    // 6. АНИМАЦИЯ (ВРАЩЕНИЕ И ПУЛЬСАЦИЯ КРИСТАЛЛА)
    // ------------------------------------------------------------------
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotateEnabled) {
            worldGroup.rotation.y += AUTO_ROTATE_SPEED;
        }

        // Анимация самого кристалла (Автономное вращение + Пульсация)
        // Анимация самого кристалла (Автономное вращение + Пульсация)
if (crystallMesh) {
    // Вращаем локальный меш внутри его собственной системы координат
    crystallMesh.traverse((child) => {
        if (child.isMesh) {
            child.rotation.y += 0.01; // Вращение вокруг своей оси
        }
    });

    // Магия пульсации (оставляем как было, это будет красиво подсвечивать грани на столе)
    const timeSeconds = Date.now() * 0.002; 
    const pulseIntensity = 1.2 + Math.sin(timeSeconds) * 0.6; 

    crystallMesh.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.emissiveIntensity = pulseIntensity;
        }
    });
}

        // Покачивание фото
        const time = Date.now() * 0.001;
        worldGroup.children.forEach(child => {
            if (child.userData.floatOffset !== undefined) {
                child.position.y += Math.sin(time * child.userData.floatSpeed + child.userData.floatOffset) * 0.0002;
            }
        });
        
        renderer.render(scene, camera);
    }

    document.addEventListener('DOMContentLoaded', init);
})();