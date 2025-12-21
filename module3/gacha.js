// ====================================================================
// gacha.js — С ОБНОВЛЕННЫМ ПЕРЕХОДОМ НА LEGENDARY.HTML
// ====================================================================

// 1. КОНСТАНТЫ
const RARITY = {
    COMMON: "common", UNCOMMON: "uncommon", RARE: "rare", ULTRA: "ultra", LEGENDARY: "legendary"
};
const RARITY_RANK = {
    [RARITY.COMMON]: 1, [RARITY.UNCOMMON]: 2, [RARITY.RARE]: 3, [RARITY.ULTRA]: 4, [RARITY.LEGENDARY]: 5
};

// 2. ДАННЫЕ (Твои данные без изменений, проверены)
const CASES_DATA = [
    {
        "id": "common_case", "name": "Обычный кейс", "visual": "img/cases/gray_case.jpeg", "rarity": "common", "price": 1, "min_drops": 1, "max_drops": 2,
        "drop_types": [{ "type": "buff", "chance": 75 }, { "type": "collectible", "chance": 25 }],
        "rarity_chances": { "buff": { "common": 80, "uncommon": 20 }, "collectible": { "common": 60, "uncommon": 40 } }
    },
    {
        "id": "tech_case", "name": "Техно кейс", "visual": "img/cases/tech_case.jpeg", "rarity": "uncommon", "price": 3, "min_drops": 1, "max_drops": 2,
        "drop_types": [{ "type": "buff", "chance": 65 }, { "type": "collectible", "chance": 35 }],
        "rarity_chances": { "buff": { "common": 60, "uncommon": 30, "rare": 10 }, "collectible": { "common": 50, "uncommon": 35, "rare": 15 } }
    },
    {
        "id": "neon_case", "name": "Неоновый кейс", "visual": "img/cases/neon_case.jpeg", "rarity": "rare", "price": 5, "min_drops": 2, "max_drops": 3,
        "drop_types": [{ "type": "buff", "chance": 50 }, { "type": "collectible", "chance": 35 }, { "type": "letter", "chance": 15 }],
        "rarity_chances": { "buff": { "common": 40, "uncommon": 40, "rare": 20 }, "collectible": { "common": 30, "uncommon": 40, "rare": 30 }, "letter": { "common": 60, "uncommon": 30, "rare": 10 } }
    },
    {
        "id": "crystal_case", "name": "Кристаллический кейс", "visual": "img/cases/crystal_case.jpeg", "rarity": "rare", "price": 7, "min_drops": 2, "max_drops": 3,
        "drop_types": [{ "type": "buff", "chance": 45 }, { "type": "collectible", "chance": 30 }, { "type": "letter", "chance": 25 }],
        "rarity_chances": { "buff": { "common": 30, "uncommon": 40, "rare": 30 }, "collectible": { "common": 20, "uncommon": 35, "rare": 45 }, "letter": { "common": 40, "uncommon": 40, "rare": 20 } }
    },
    {
        "id": "plasma_case", "name": "Плазменный кейс", "visual": "img/cases/plasma_case.jpeg", "rarity": "ultra", "price": 10, "min_drops": 2, "max_drops": 3,
        "drop_types": [{ "type": "buff", "chance": 40 }, { "type": "collectible", "chance": 30 }, { "type": "letter", "chance": 30 }],
        "rarity_chances": { "buff": { "common": 15, "uncommon": 30, "rare": 40, "ultra": 15 }, "collectible": { "common": 10, "uncommon": 30, "rare": 40, "ultra": 20 }, "letter": { "common": 20, "uncommon": 40, "rare": 40 } }
    },
    {
        "id": "glitch_case", "name": "Глитч кейс", "visual": "img/cases/glitch_case.jpeg", "rarity": "ultra", "price": 12, "min_drops": 3, "max_drops": 4,
        "drop_types": [{ "type": "buff", "chance": 25 }, { "type": "collectible", "chance": 25 }, { "type": "letter", "chance": 20 }, { "type": "fragment", "chance": 30 }],
        "rarity_chances": { "buff": { "common": 10, "uncommon": 20, "rare": 35, "ultra": 35 }, "collectible": { "common": 5, "uncommon": 15, "rare": 30, "ultra": 40, "legendary": 10 }, "letter": { "common": 10, "uncommon": 20, "rare": 40, "ultra": 30 }, "fragment": { "rare": 30, "ultra": 50, "legendary": 20 } }
    },
    {
        "id": "cosmic_case", "name": "Космический кейс", "visual": "img/cases/cosmic_case.jpeg", "rarity": "legendary", "price": 20, "min_drops": 3, "max_drops": 4,
        "drop_types": [{ "type": "buff", "chance": 30 }, { "type": "collectible", "chance": 30 }, { "type": "letter", "chance": 10 }, { "type": "fragment", "chance": 30 }],
        "rarity_chances": { "buff": { "common": 5, "uncommon": 15, "rare": 30, "ultra": 40, "legendary": 10 }, "collectible": { "common": 5, "uncommon": 10, "rare": 30, "ultra": 45, "legendary": 10 }, "letter": { "common": 0, "uncommon": 10, "rare": 30, "ultra": 50, "legendary": 10 }, "fragment": { "rare": 20, "ultra": 50, "legendary": 30 } }
    }
];

const BUFFS_DATA = [
    { id: "mood", name: "+1 Mood", type: "buff", visual: "img/buffs/mood.jpeg", rarity: RARITY.COMMON, effect_text: "Пусть сервер мира крутится в твою сторону." },
    { id: "calm", name: "+1 Calm", type: "buff", visual: "img/buffs/calm.jpeg", rarity: RARITY.COMMON, effect_text: "Ошибки памяти очищены. Давление нормализовано." },
    { id: "focus", name: "+1 Focus", type: "buff", visual: "img/buffs/focus.jpeg", rarity: RARITY.COMMON, effect_text: "Уровень концентрации повышен." },
    { id: "luck", name: "+1 Luck", type: "buff", visual: "img/buffs/luck.jpeg", rarity: RARITY.UNCOMMON, effect_text: "Сегодня backend судьбы поставил тебе +1 к критам." },
    { id: "energy", name: "+1 Energy", type: "buff", visual: "img/buffs/energy.jpeg", rarity: RARITY.UNCOMMON, effect_text: "Мощность восстановлена. Работает на чистой плазме." },
    { id: "creativity", name: "+1 Creativity", type: "buff", visual: "img/buffs/creativity.jpeg", rarity: RARITY.UNCOMMON, effect_text: "Обнаружена новая библиотека идей." },
    { id: "stability", name: "+1 Stability", type: "buff", visual: "img/buffs/stability.jpeg", rarity: RARITY.RARE, effect_text: "Никаких багов. Только стабильный билд." },
    { id: "protection", name: "+1 Protection", type: "buff", visual: "img/buffs/protection.jpeg", rarity: RARITY.RARE, effect_text: "Включен фаервол от стресса и негатива.У тебя иммунитет к вирусам дня." },
    { id: "speed", name: "+1 Speed", type: "buff", visual: "img/buffs/speed.jpeg", rarity: RARITY.ULTRA, effect_text: "Время сжалось до двух наносекунд." },
    { id: "rewind", name: "Rewind Token", type: "buff", visual: "img/buffs/rewind.jpeg", rarity: RARITY.ULTRA, effect_text: "Получен жетон 'Перемотка'." },
    { id: "godmode", name: "God Mode", type: "buff", visual: "img/buffs/godmode.jpeg", rarity: RARITY.LEGENDARY, effect_text: "Взломана главная консоль. Ты — оператор." }
];

const COLLECTIBLES_DATA = [
    // FRAGMENTS
    { id: "fragment_1", name: "January Spark", type: "fragment", visual: "img/collection/fragment1.jpeg", rarity: RARITY.COMMON, set_size: 5, unlocks: "secret_birthday_scene" },
    { id: "fragment_2", name: "2 Fragment", type: "fragment", visual: "img/collection/fragment2.jpeg", rarity: RARITY.UNCOMMON, set_size: 5, unlocks: "secret_birthday_scene" },
    { id: "fragment_3", name: "3 Fragment", type: "fragment", visual: "img/collection/fragment3.jpeg", rarity: RARITY.RARE, set_size: 5, unlocks: "secret_birthday_scene" },
    { id: "fragment_4", name: "4 Fragment", type: "fragment", visual: "img/collection/fragment4.jpeg", rarity: RARITY.RARE, set_size: 5, unlocks: "secret_birthday_scene" },
    { id: "fragment_5", name: "5 Fragment", type: "fragment", visual: "img/collection/fragment5.jpeg", rarity: RARITY.ULTRA, set_size: 5, unlocks: "secret_birthday_scene" },
    // LETTERS
    { id: "letter_1", name: "Log 0x1A", type: "letter", visual: "img/collection/letter1.jpeg", rarity: RARITY.COMMON, set_size: 5, unlocks: "mega_buff_pack", effect_text: "Gustav обдолбался пачками тригонометрии и не знает что писать." },
    { id: "letter_2", name: "Log 0x2B", type: "letter", visual: "img/collection/letter2.jpeg", rarity: RARITY.UNCOMMON, set_size: 5, unlocks: "mega_buff_pack", effect_text: "Пусть судьба аккуратно подбросит тебе пару поводов улыбнуться." },
    { id: "letter_3", name: "Log 0x3C", type: "letter", visual: "img/collection/letter3.jpeg", rarity: RARITY.UNCOMMON, set_size: 5, unlocks: "mega_buff_pack", effect_text: "Надеюсь, твой день сегодня будет легким , как утренний бриз и приятным как любимый плейлист" },
    { id: "letter_4", name: "Log 0x4D", type: "letter", visual: "img/collection/letter4.jpeg", rarity: RARITY.RARE, set_size: 5, unlocks: "mega_buff_pack", effect_text: "Пусть все мелочи твоего дня складываются так, будто специально для тебя, и пусть рядом будут те кто это ценить " },
    { id: "letter_5", name: "Log 0x5E", type: "letter", visual: "img/collection/letter5.jpeg", rarity: RARITY.RARE, set_size: 5, unlocks: "mega_buff_pack", effect_text: "Кажется сегодня воздух намного теплее...может это потому что кто-то здесь празднует особенный день." },
    // PUZZLES
    { id: "puzzle_1", name: "Puzzle Piece #1", type: "collectible", visual: "img/collection/puzzle1.jpeg", rarity: RARITY.UNCOMMON, set_size: 3, unlocks: "3d_cake" },
    { id: "puzzle_2", name: "Puzzle Piece #2", type: "collectible", visual: "img/collection/puzzle2.jpeg", rarity: RARITY.RARE, set_size: 3, unlocks: "3d_cake" },
    { id: "puzzle_3", name: "Puzzle Piece #3", type: "collectible", visual: "img/collection/puzzle3.jpeg", rarity: RARITY.ULTRA, set_size: 3, unlocks: "3d_cake" },
    // SECRET (TOP PRIZE)
    { id: "secret_token", name: "Ultimate Secret", type: "secret", visual: "img/collection/ultimate.jpeg", rarity: RARITY.LEGENDARY, set_size: 1, unlocks: "access_to_final_message", description: "Нажми на фото, чтобы открыть секрет..." }
];

// 3. ЛОГИКА
let currentTokens = 300;
const PLAYER_INVENTORY = {};
let currentCaseId = "common_case";
let isSpinning = false;
let MAP_CASES = {}, ITEM_GROUPS = {}, MAP_ALL_ITEMS = {};

function buildMaps() {
    MAP_CASES = Object.fromEntries(CASES_DATA.map(c => [c.id, c]));
    const allItems = [...BUFFS_DATA, ...COLLECTIBLES_DATA];
    MAP_ALL_ITEMS = Object.fromEntries(allItems.map(i => [i.id, i]));
    allItems.forEach(item => {
        if (item.id === "secret_token") return;
        const t = item.type, r = item.rarity;
        ITEM_GROUPS[t] = ITEM_GROUPS[t] || {};
        ITEM_GROUPS[t][r] = ITEM_GROUPS[t][r] || [];
        ITEM_GROUPS[t][r].push(item);
    });
}

function weightedRandom(options) {
    if (!options || options.length === 0) return null;
    let pool = Array.isArray(options) ? options : Object.entries(options).map(([k, v]) => ({ type: k, rarity: k, chance: v }));
    const total = pool.reduce((s, o) => s + o.chance, 0);
    if (total <= 0) return null;
    let r = Math.random() * total;
    for (const opt of pool) { if (r < opt.chance) return opt.type || opt.rarity; r -= opt.chance; }
    return pool[pool.length - 1].type || pool[pool.length - 1].rarity;
}

function getUniqueRandomItem(dropType, rarity) {
    const group = ITEM_GROUPS[dropType]?.[rarity];
    if (group && group.length > 0) {
        const notOwned = group.filter(item => !PLAYER_INVENTORY[item.id]);
        if (notOwned.length > 0) return notOwned[Math.floor(Math.random() * notOwned.length)];
    }
    const fallbackGroup = ITEM_GROUPS[dropType];
    if (fallbackGroup) {
        const allOfType = Object.values(fallbackGroup).flat();
        const allNotOwned = allOfType.filter(item => !PLAYER_INVENTORY[item.id]);
        if (allNotOwned.length > 0) return allNotOwned[Math.floor(Math.random() * allNotOwned.length)];
    }
    return null;
}

function checkCollectionCompletion(item) {
    if (!item.set_size || !item.unlocks) return null;
    const setIds = COLLECTIBLES_DATA.filter(c => c.type === item.type && c.set_size === item.set_size).map(c => c.id);
    const count = setIds.filter(id => (PLAYER_INVENTORY[id] || 0) > 0).length;
    return count >= item.set_size ? item.unlocks : null;
}

function checkAllCollectionsCompleted() {
    const required = COLLECTIBLES_DATA.filter(i => i.id !== 'secret_token');
    for (let item of required) { if (!PLAYER_INVENTORY[item.id]) return false; }
    return !PLAYER_INVENTORY["secret_token"]; // Возвращаем true только если секрет еще НЕ получен
}

// UI Elements
const DOM = {
    tokensCount: document.getElementById('tokens-count'),
    btnSpin: document.getElementById('btn-spin'),
    inventoryGrid: document.getElementById('inventory'),
    pullLog: document.getElementById('pull-log'),
    caseImage: document.getElementById('case-image'),
    resultModal: document.getElementById('result-modal'),
    resultClose: document.getElementById('result-close'),
    resultReturn: document.getElementById('btn-close-return'),
    resultRarity: document.getElementById('result-rarity'),
    resultImage: document.getElementById('result-image'),
    resultTitle: document.getElementById('result-title'),
    resultDesc: document.getElementById('result-desc'),
    toast: document.getElementById('toast'),
    audioSpin: document.getElementById('sfx-spin'),
    audioWin: document.getElementById('sfx-win'),
    audioRare: document.getElementById('sfx-rare'),
    audioLegendary: document.getElementById('sfx-legendary') // Если есть
};

function openRandomCase() {
    if (isSpinning) return;
    const gameCase = CASES_DATA[Math.floor(Math.random() * CASES_DATA.length)];
    if (currentTokens < gameCase.price) { showToast(`Нужно ${gameCase.price} токенов!`, "common"); return; }
    
    isSpinning = true;
    DOM.btnSpin.disabled = true;
    currentTokens -= gameCase.price;
    DOM.caseImage.src = gameCase.visual;
    updateUI();
    if(DOM.audioSpin) { DOM.audioSpin.currentTime = 0; DOM.audioSpin.play().catch(()=>{}); }

    setTimeout(() => {
        const drops = [];
        const dropCount = Math.floor(Math.random() * (gameCase.max_drops - gameCase.min_drops + 1)) + gameCase.min_drops;
        const droppedIds = new Set();
        const unlocks = [];

        for (let i = 0; i < dropCount; i++) {
            let item = null, attempts = 0;
            while (attempts < 5) {
                const dt = weightedRandom(gameCase.drop_types); if (!dt) break;
                const r = weightedRandom(gameCase.rarity_chances[dt]); if (!r) break;
                const candidate = getUniqueRandomItem(dt, r);
                if (candidate && !droppedIds.has(candidate.id)) { item = candidate; break; }
                attempts++;
            }
            if (item) {
                droppedIds.add(item.id);
                PLAYER_INVENTORY[item.id] = 1;
                const ul = checkCollectionCompletion(item);
                if (ul && !unlocks.includes(ul)) unlocks.push(ul);
                drops.push({ ...item });
            }
        }

        if (drops.length > 0) showResultModal(drops);
        else showToast("Кейс пуст (все собрано?)", "common");

        unlocks.forEach(() => showToast("🎉 Коллекция собрана!", "legendary"));

        // ПРОВЕРКА НА ВСЁ СОБРАННОЕ -> ВЫДАЧА СЕКРЕТА
        if (checkAllCollectionsCompleted()) {
            setTimeout(() => {
                PLAYER_INVENTORY["secret_token"] = 1;
                showToast("🏆 ВЫ СОБРАЛИ ВСЁ! СЕКРЕТ ОТКРЫТ!", "legendary");
                const secretItem = MAP_ALL_ITEMS["secret_token"];
                if (secretItem) {
                    showItemDetails(secretItem);
                    // Особый звук для легендарки
                    if(DOM.audioLegendary) DOM.audioLegendary.play().catch(()=>{});
                }
            }, 1500); // Небольшая задержка перед секретом
        }

        updateUI();
        isSpinning = false;
        DOM.btnSpin.disabled = false;
    }, 1500);
}

function updateUI() {
    DOM.tokensCount.textContent = currentTokens;
    DOM.inventoryGrid.innerHTML = '';
    const sorted = Object.keys(PLAYER_INVENTORY).sort((a, b) => 
        (RARITY_RANK[MAP_ALL_ITEMS[b]?.rarity] || 0) - (RARITY_RANK[MAP_ALL_ITEMS[a]?.rarity] || 0));

    sorted.forEach(id => {
        const item = MAP_ALL_ITEMS[id];
        if (!item) return;
        const card = document.createElement('div');
        card.className = `inventory-card rarity-${item.rarity}`;
        card.innerHTML = `<img src="${item.visual}" alt="${item.name}">`;
        
        // --- ГЛАВНОЕ ИЗМЕНЕНИЕ: КЛИК ПО ИНВЕНТАРЮ ---
        card.addEventListener('click', () => {
            if (item.id === 'secret_token') {
                // Если кликнули на секретку — переход
                window.location.href = 'legendary.html';
            } else {
                showItemDetails(item);
            }
        });
        
        DOM.inventoryGrid.appendChild(card);
    });
    DOM.btnSpin.textContent = "SPIN (RANDOM)";
}

function showItemDetails(item) {
    DOM.resultRarity.textContent = item.rarity.toUpperCase();
    DOM.resultRarity.className = `result-rarity rarity-${item.rarity}`;
    DOM.resultImage.src = item.visual;
    DOM.resultTitle.textContent = item.name;
    DOM.resultDesc.textContent = item.description || item.effect_text || "";
    DOM.resultModal.classList.remove('hidden');

    // --- ГЛАВНОЕ ИЗМЕНЕНИЕ: КЛИК В МОДАЛКЕ ---
    if (item.id === 'secret_token') {
        DOM.resultImage.style.cursor = 'pointer';
        DOM.resultImage.onclick = () => window.location.href = 'legendary.html';
        DOM.resultDesc.innerHTML += "<br><br><b>(НАЖМИ НА ФОТО!)</b>";
    } else {
        DOM.resultImage.style.cursor = 'default';
        DOM.resultImage.onclick = null;
    }
}

function showResultModal(drops) {
    const main = drops[0];
    showItemDetails(main);
    if (main.rarity === RARITY.LEGENDARY || main.rarity === RARITY.ULTRA) {
        if(DOM.audioRare) DOM.audioRare.play().catch(()=>{});
    } else {
        if(DOM.audioWin) DOM.audioWin.play().catch(()=>{});
    }
    drops.forEach(d => {
        const li = document.createElement('li');
        li.className = `rarity-${d.rarity}`;
        li.textContent = `[${d.rarity.toUpperCase()}] ${d.name}`;
        DOM.pullLog.prepend(li);
    });
}

function closeResultModal() { DOM.resultModal.classList.add('hidden'); }
function showToast(msg, type) {
    DOM.toast.textContent = msg;
    DOM.toast.className = `toast rarity-${type}`;
    DOM.toast.classList.remove('hidden');
    setTimeout(() => DOM.toast.classList.add('hidden'), 3000);
}

function initGacha() {
    buildMaps();
    updateUI();
    DOM.btnSpin.addEventListener('click', openRandomCase);
    DOM.resultReturn.addEventListener('click', closeResultModal);
    DOM.resultClose.addEventListener('click', closeResultModal);
    document.getElementById('btn-next').addEventListener('click', () => {
        const ids = CASES_DATA.map(c => c.id);
        currentCaseId = ids[(ids.indexOf(currentCaseId) + 1) % ids.length];
        const nc = MAP_CASES[currentCaseId];
        DOM.caseImage.src = nc.visual;
        showToast(`Просмотр: ${nc.name}`, nc.rarity);
    });
    document.getElementById('btn-restart').addEventListener('click', () => location.reload());
}

document.addEventListener('DOMContentLoaded', initGacha);