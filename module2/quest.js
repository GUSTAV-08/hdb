(() => {
    const intro = document.getElementById('intro');
    const btnStart = document.getElementById('btn-start');
    const btnInstr = document.getElementById('btn-instr'); 
    const instructionsScreen = document.getElementById('instructions'); 
    const btnBackFromInstr = document.getElementById('btn-back-from-instr');
    const selectScreen = document.getElementById('select');
    const cards = document.getElementById('cards');
    const storyScreen = document.getElementById('story');
    const bg = document.getElementById('bg');
    const sceneText = document.getElementById('scene-text');
    const choicesBox = document.getElementById('choices');
    const logBox = document.getElementById('log');
    const btnRestart = document.getElementById('btn-restart');
    const btnNextModule = document.getElementById('btn-nextmodule');
    const btnBackIntro = document.getElementById('btn-back-intro');
    const bgm = document.getElementById('bgm');

    const STORY_PATHS = {
        knight: "stories/knight_story.json",
        mage: "stories/mage_story.json",
        priest: "stories/priestess_story.json"
    };

    let story = null;
    let sceneIndex = 0;
    let currentHero = null;
    let reputation = 0;
    let affection = 0;

    // HUD для статов
    const repBox = document.createElement('div');
    repBox.id = 'rep-stats';
    repBox.className = 'stats-hud';
    storyScreen.appendChild(repBox);

    function updateStats() {
        repBox.innerText = `⚜️ ${reputation} | ❤️ ${affection}`;
    }

    function log(msg, isErr = false) {
        console.log(msg);
        if (isErr) {
            logBox.classList.remove('hidden');
            logBox.innerText = String(msg);
        }
    }

    function hideAllScreens() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    }

    // Навигация
    btnStart.addEventListener('click', () => { 
        hideAllScreens(); 
        selectScreen.classList.add('active'); 
    });

    btnInstr.addEventListener('click', () => { 
        hideAllScreens(); 
        instructionsScreen.classList.add('active'); 
    });

    btnBackFromInstr.addEventListener('click', () => { 
        hideAllScreens(); 
        intro.classList.add('active'); 
    });

    btnBackIntro && btnBackIntro.addEventListener('click', () => { 
        hideAllScreens(); 
        intro.classList.add('active'); 
    });

    cards.addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (!card) return;
        currentHero = card.dataset.hero;
        startLoadStory(currentHero);
    });

    btnRestart && btnRestart.addEventListener('click', () => { 
        location.reload(); 
    });

    btnNextModule && btnNextModule.addEventListener('click', () => { 
        window.location.href = '../module3/gacha.html'; 
    });

    async function startLoadStory(hero) {
        hideAllScreens();
        storyScreen.classList.add('active');
        
        if (bgm) {
            bgm.volume = 0.4;
            try { await bgm.play(); } catch (e) { 
                log("Autoplay blocked (нажмите на экран для музыки)", false); 
            }
        }

        reputation = 0; 
        affection = 0;
        updateStats();

        try {
            const resp = await fetch(STORY_PATHS[hero]);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const json = await resp.json();
            story = normalizeStory(json);
            sceneIndex = 0;
            renderSceneByIndex(sceneIndex);
        } catch (err) { 
            log(`Ошибка загрузки: ${err.message}`, true); 
        }
    }

    function normalizeStory(json) {
        if (Array.isArray(json)) return json;
        if (json.stages && Array.isArray(json.stages)) return json.stages;
        if (json.scenes && Array.isArray(json.scenes)) return json.scenes;
        return [];
    }

    function renderSceneByIndex(idx) {
        if (!story || idx < 0 || idx >= story.length) return;

        const s = story[idx];
        const bgPath = s.background ? `img/${s.background}` : `img/bg_default.jpg`;
        
        // НОВАЯ ЛОГИКА: адаптивный режим фона
        const bgMode = s.backgroundMode || 'cover'; // по умолчанию cover
        
        // Удаляем старые классы
        bg.classList.remove('mode-cover', 'mode-contain');
        
        // Применяем новый режим
        if (bgMode === 'contain') {
            bg.classList.add('mode-contain');
        } else {
            bg.classList.add('mode-cover');
        }
        
        bg.style.backgroundImage = `url("${bgPath}")`;

        // Анимация текста
        sceneText.style.opacity = 0;
        setTimeout(() => {
            sceneText.innerText = s.scene || s.text || '';
            sceneText.style.opacity = 1;
        }, 120);

        // Рендер выборов
        choicesBox.innerHTML = '';
        if (Array.isArray(s.choices) && s.choices.length > 0) {
            s.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'choice-button';
                btn.innerText = choice.text || '...';
                btn.onclick = () => handleChoice(choice); 
                choicesBox.appendChild(btn);
            });
        } else {
            const endBtn = document.createElement('button');
            endBtn.className = 'choice-button';
            endBtn.innerText = '✨ Завершить историю';
            endBtn.onclick = () => { 
                hideAllScreens(); 
                selectScreen.classList.add('active'); 
            };
            choicesBox.appendChild(endBtn);
        }
        
        updateStats();
    }

    function handleChoice(choice) {
        if (choice.reputation) reputation += choice.reputation;
        if (choice.affection) affection += choice.affection;
        updateStats();

        if (choice.next === 'AUTO_DECISION') {
            handleKingDecidesLogic();
        } else {
            goToScene(choice.next);
        }
    }

    function handleKingDecidesLogic() {
        let nextSceneId;
        if (reputation >= 7 && affection >= 5) {
            nextSceneId = 'good_end';
        } else if (affection >= 3 && reputation >= 2) {
            nextSceneId = 'neutral_end';
        } else {
            nextSceneId = 'bad_end';
        }
        goToScene(nextSceneId);
    }

    function goToScene(target) {
        if (!target) return;
        
        // Переход в гачу
        if (target === 'GO_TO_GACHA' || target === 'to_gacha' || target === 'next_module') {
            window.location.href = '/module3/gacha.html';
            return;
        }

        const idx = story.findIndex(s => s.id === target);
        if (idx !== -1) {
            sceneIndex = idx;
            renderSceneByIndex(sceneIndex);
        } else {
            log(`Сцена "${target}" не найдена`, true);
        }
    }

    // Горячие клавиши
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 's' && intro.classList.contains('active')) {
            btnStart.click();
        }
    });

    // Инициализация
    hideAllScreens();
    intro.classList.add('active');

    // Добавляем класс по умолчанию для фона
    bg.classList.add('mode-cover');
})();