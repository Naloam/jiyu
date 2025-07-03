// 获取元素
const searchInput = document.getElementById('txt');
const searchBtn = document.getElementById('search-btn');
const searchEngineName = document.getElementById('search-engine-name');
const searchEngineList = document.querySelector('.search-engine-list');
const getTopBtn = document.getElementById('get-top');
const navBtn = document.querySelector('.nav-btn');
const nav = document.querySelector('.nav');
const leftBar = document.querySelector('.left-bar');

// 边栏隐藏
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main');

// 收藏功能实现
const FAVORITES_KEY = 'favorites';
let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

// 右键菜单控制
const contextMenu = document.getElementById('context-menu');
let selectedCard = null;

// 设置功能实现
const SETTINGS_KEY = 'userSettings';
let userSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    theme: 'light',
    fontSize: 'medium',
    backgroundOpacity: 0.8,
    cardStyle: 'default'
};

// 初始化收藏状态
document.addEventListener('DOMContentLoaded', () => {
    // 初始化收藏按钮
    document.querySelectorAll('.card-link').forEach(card => {
        const cardId = card.href; // 使用链接作为唯一标识
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.setAttribute('data-card-id', cardId);
        favoriteBtn.innerHTML = favorites.includes(cardId) ? 
            '<i class="fas fa-star"></i>' : 
            '<i class="far fa-star"></i>';
        
        // 移除可能存在的旧按钮
        const oldBtn = card.querySelector('.favorite-btn');
        if (oldBtn) {
            oldBtn.remove();
        }
        
        card.appendChild(favoriteBtn);
        
        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(cardId);
        });
    });
    
    // 应用设置
    applySettings();
});

// 切换收藏状态
function toggleFavorite(cardId) {
    const index = favorites.indexOf(cardId);
    if (index === -1) {
        favorites.push(cardId);
        showToast('已添加到收藏夹');
    } else {
        favorites.splice(index, 1);
        showToast('已从收藏夹移除');
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    updateFavoriteButton(cardId);
    updateFavoritesDisplay();
}

// 更新收藏按钮状态
function updateFavoriteButton(cardId) {
    const button = document.querySelector(`[data-card-id="${cardId}"]`);
    if (button) {
        const icon = button.querySelector('i');
        if (favorites.includes(cardId)) {
            icon.className = 'fas fa-star';
            icon.style.animation = 'starPop 0.3s ease';
        } else {
            icon.className = 'far fa-star';
            icon.style.animation = 'none';
        }
    }
}

// 更新收藏显示
function updateFavoritesDisplay() {
    const favoritesBtn = document.getElementById('favorites-btn');
    const isShowingFavorites = favoritesBtn.classList.contains('active');
    
    // 获取所有卡片容器
    const cardContainers = document.querySelectorAll('.col-md-3');
    
    if (isShowingFavorites) {
        // 只显示收藏的卡片
        cardContainers.forEach(container => {
            const card = container.querySelector('.card-link');
            if (card) {
                container.style.display = favorites.includes(card.href) ? 'block' : 'none';
            }
        });
    } else {
        // 显示所有卡片
        cardContainers.forEach(container => {
            container.style.display = 'block';
        });
    }
}

// 收藏筛选功能
document.getElementById('favorites-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const favoritesBtn = document.getElementById('favorites-btn');
    favoritesBtn.classList.toggle('active');
    updateFavoritesDisplay();
});

// 应用设置
function applySettings() {
    document.documentElement.setAttribute('data-theme', userSettings.theme);
    document.body.style.fontSize = userSettings.fontSize === 'small' ? '14px' : 
                                 userSettings.fontSize === 'large' ? '18px' : '16px';
    document.body.style.backgroundColor = `rgba(245, 245, 245, ${userSettings.backgroundOpacity})`;
    
    // 应用卡片样式
    document.querySelectorAll('.card-box').forEach(card => {
        card.className = `card-box ${userSettings.cardStyle}`;
    });
    
    // 保存设置
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(userSettings));
}

// 设置按钮点击事件
document.getElementById('settings-btn').addEventListener('click', (e) => {
    e.preventDefault();
    
    // 创建设置弹窗
    const settingsModal = document.createElement('div');
    settingsModal.className = 'settings-modal';
    settingsModal.innerHTML = `
        <div class="settings-content">
            <div class="settings-header">
                <h2>设置</h2>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="settings-body">
                <div class="setting-item">
                    <label>主题</label>
                    <select id="theme-select">
                        <option value="light" ${userSettings.theme === 'light' ? 'selected' : ''}>浅色</option>
                        <option value="dark" ${userSettings.theme === 'dark' ? 'selected' : ''}>深色</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>字体大小</label>
                    <select id="font-size-select">
                        <option value="small" ${userSettings.fontSize === 'small' ? 'selected' : ''}>小</option>
                        <option value="medium" ${userSettings.fontSize === 'medium' ? 'selected' : ''}>中</option>
                        <option value="large" ${userSettings.fontSize === 'large' ? 'selected' : ''}>大</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>背景透明度</label>
                    <input type="range" id="opacity-slider" min="0" max="1" step="0.1" 
                           value="${userSettings.backgroundOpacity}">
                </div>
                <div class="setting-item">
                    <label>卡片样式</label>
                    <select id="card-style-select">
                        <option value="default" ${userSettings.cardStyle === 'default' ? 'selected' : ''}>默认</option>
                        <option value="minimal" ${userSettings.cardStyle === 'minimal' ? 'selected' : ''}>简约</option>
                        <option value="gradient" ${userSettings.cardStyle === 'gradient' ? 'selected' : ''}>渐变</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(settingsModal);
    
    // 绑定设置变更事件
    const themeSelect = settingsModal.querySelector('#theme-select');
    const fontSizeSelect = settingsModal.querySelector('#font-size-select');
    const opacitySlider = settingsModal.querySelector('#opacity-slider');
    const cardStyleSelect = settingsModal.querySelector('#card-style-select');
    
    themeSelect.addEventListener('change', () => {
        userSettings.theme = themeSelect.value;
        applySettings();
    });
    
    fontSizeSelect.addEventListener('change', () => {
        userSettings.fontSize = fontSizeSelect.value;
        applySettings();
    });
    
    opacitySlider.addEventListener('input', () => {
        userSettings.backgroundOpacity = parseFloat(opacitySlider.value);
        applySettings();
    });
    
    cardStyleSelect.addEventListener('change', () => {
        userSettings.cardStyle = cardStyleSelect.value;
        applySettings();
    });
    
    // 关闭按钮事件
    const closeBtn = settingsModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        settingsModal.remove();
    });
    
    // 点击外部关闭
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.remove();
        }
    });
});

// 生成卡片唯一标识符
function generateCardId(card) {
    const cardContainer = card.closest('.col-md-3');
    const section = cardContainer.closest('.item');
    const sectionId = section.id;
    const cardIndex = Array.from(section.querySelectorAll('.col-md-3')).indexOf(cardContainer);
    return `${sectionId}-${cardIndex}`;
}

// 右键菜单事件
document.addEventListener('contextmenu', (e) => {
    const cardLink = e.target.closest('.card-link');
    if (cardLink) {
        e.preventDefault();
        selectedCard = cardLink;
        showContextMenu(e);
        return false;
    }
});

function showContextMenu(e) {
    contextMenu.style.display = 'block';
    
    // 获取卡片位置
    const cardRect = selectedCard.getBoundingClientRect();
    
    // 计算菜单位置，使其显示在卡片右上角
    const left = cardRect.right - contextMenu.offsetWidth;
    const top = cardRect.top;
    
    // 确保菜单不会超出视口
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let finalLeft = left;
    let finalTop = top;
    
    // 如果右侧空间不足，则显示在左侧
    if (left < 0) {
        finalLeft = cardRect.left;
    }
    
    // 如果顶部空间不足，则显示在底部
    if (top + contextMenu.offsetHeight > viewportHeight) {
        finalTop = cardRect.bottom - contextMenu.offsetHeight;
    }
    
    contextMenu.style.left = `${finalLeft}px`;
    contextMenu.style.top = `${finalTop}px`;
}

// 隐藏菜单
document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

// 复制链接功能
document.getElementById('menu-copy').addEventListener('click', () => {
    const link = selectedCard.href;
    navigator.clipboard.writeText(link).then(() => {
        showToast('链接已复制到剪贴板');
    }).catch(() => {
        showToast('复制失败，请手动复制');
    });
    contextMenu.style.display = 'none';
});

// 在新标签页打开功能
document.getElementById('menu-open').addEventListener('click', () => {
    window.open(selectedCard.href, '_blank');
    contextMenu.style.display = 'none';
});

// 回到顶部按键
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) { 
        getTopBtn.classList.add('show');
    } else {
        getTopBtn.classList.remove('show');
    }
});

getTopBtn.addEventListener('click', () => {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // 创建导航点
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // 更新轮播图位置
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 去往特定图片
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // 下一张图片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }
    
    // 上一张图片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    // 添加按钮事件监听
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // 自动播放
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    // 鼠标悬停时暂停自动播放
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    // 鼠标离开时恢复自动播放
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
});

// 搜索引擎设定
const searchEngines = [
    { name: 'Google', url: 'https://www.google.com/search?q=' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { name: 'Baidu', url: 'https://www.baidu.com/s?wd=' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' }
];

const academicEngines = [
    { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' },
    { name: 'Bing Academic', url: 'https://www.bing.com/academic/search?q=' },
    { name: 'arXiv', url: 'https://arxiv.org/search/?query=' },
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com/input?i=' }
];

// 初始化引擎
document.addEventListener('DOMContentLoaded', () => {
    initEngine('main-engine-list', searchEngines, 'main-engine');
    initEngine('academic-engine-list', academicEngines, 'academic-engine');
});

function initEngine(listId, engines, targetId) {
    const list = document.getElementById(listId);
    list.innerHTML = ''; // 清空原有内容
    
    engines.forEach(engine => {
        const li = document.createElement('li');
        li.textContent = engine.name;
        li.addEventListener('click', () => {
            document.getElementById(targetId).querySelector('span').textContent = engine.name;
            document.querySelector('.search-engine').classList.remove('active');
        });
        list.appendChild(li);
    });
}

// 搜索功能
function createHandler(engineType, inputId) {
    return function() {
        const query = document.getElementById(inputId).value.trim();
        if (!query) return;

        const engineName = document.querySelector(`#${engineType} span`).textContent;
        const engine = (engineType === 'main-engine' ? searchEngines : academicEngines)
            .find(e => e.name === engineName);
        
        window.open(engine.url + encodeURIComponent(query), '_blank');
    };
}

// 绑定事件
const mainSearch = createHandler('main-engine', 'main-search');
const academicSearch = createHandler('academic-engine', 'academic-search');

document.getElementById('main-search-btn').addEventListener('click', mainSearch);
document.getElementById('academic-search-btn').addEventListener('click', academicSearch);

document.getElementById('main-search').addEventListener('keypress', e => e.key === 'Enter' && mainSearch());
document.getElementById('academic-search').addEventListener('keypress', e => e.key === 'Enter' && academicSearch());

// 面板控制
document.querySelectorAll('.search-engine-name').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.parentElement.nextElementSibling.classList.toggle('active');
    });
});

document.addEventListener('click', e => {
    if (!e.target.closest('.search-box')) {
        document.querySelectorAll('.search-engine').forEach(panel => {
            panel.classList.remove('active');
        });
    }
});


sidebarToggle.addEventListener('click', () => {
    leftBar.classList.toggle('show');
    mainContent.classList.toggle('sidebar-hidden');
});

// 初始化搜索引擎
let currentSearchEngine = searchEngines[0];

function initSearchEngines() {
    searchEngines.forEach(engine => {
        const li = document.createElement('li');
        li.textContent = engine.name;
        li.addEventListener('click', () => {
            currentSearchEngine = engine;
            searchEngineName.textContent = engine.name;
            document.querySelector('.search-engine').classList.remove('active');
        });
        searchEngineList.appendChild(li);
    });
}

// 设置搜索引擎
function setSearchEngine(name, url) {
    const engineName = document.querySelector('.search-engine-name');
    engineName.textContent = name;
    document.querySelector('.search-box').setAttribute('data-current-url', url);
    document.querySelector('.search-engine').classList.remove('active');
}

// 搜索功能实现
function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.open(currentSearchEngine.url + encodeURIComponent(searchTerm), '_blank');
    }
}

// 回车搜索
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 搜索引擎选择按钮点击事件
searchEngineName.addEventListener('click', (e) => {
    document.querySelector('.search-engine').classList.toggle('active');
});

// 点击框外时关闭选择器
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        document.querySelector('.search-engine').classList.remove('active');
    }
});

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 添加到历史记录
function addToHistory(title, description, link) {
    const historyItem = {
        title,
        description,
        link,
        timestamp: new Date().toISOString()
    };
    
    visitHistory.unshift(historyItem);
    if (visitHistory.length > 20) {
        visitHistory.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(visitHistory));
}

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.message);
    showToast('页面加载出错，请刷新重试');
});

// 性能监控
window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`页面加载时间: ${loadTime}ms`);
});

