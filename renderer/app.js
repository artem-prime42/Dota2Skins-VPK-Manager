/* Dota2skins mod manager — renderer */
'use strict';

const RAW_BASE = 'https://dota2skins.vercel.app';

const CAT_LABELS = {
  ru: {
    heroes: 'Герои', 'item-effects': 'Эффекты предметов', 'hero-items': 'Предметы героев',
    backgrounds: 'Фоны меню', cursors: 'Курсоры', 'mega-kill': 'Мега-килл', shaders: 'Шейдеры',
    couriers: 'Курьеры', terrains: 'Ландшафты', creeps: 'Крипы', trees: 'Деревья', river: 'Река',
    'ti-bp-effects': 'Паки эффектов', emblems: 'Эмблемы', 'creep-deny': 'Денай крипов',
    music: 'Музыка', 'hero-sounds': 'Звуки героев', sounds: 'Звуки', 'ranged-attack': 'Дальние атаки',
    other: 'Разное', ranks: 'Ранги', 'item-icons': 'Иконки предметов', 'versus-screens': 'Versus Screen',
    announcers: 'Анонсеры', wards: 'Варды', pedestal: 'Пьедесталы', huds: 'HUD',
    herofx: 'Эффекты героев', pings: 'Пинги', packs: 'Versus Screen', optimization: 'Оптимизация',
    tormentor: 'Тормент', 'high-five': 'High Five', ancient: 'Древние', roshan: 'Рошан',
    towers: 'Башни', fonts: 'Шрифты', sites: 'Сайты', guides: 'Гайды', news: 'Новости',
  },
  en: {
    heroes: 'Heroes', 'item-effects': 'Item effects', 'hero-items': 'Hero items',
    backgrounds: 'Menu backgrounds', cursors: 'Cursors', 'mega-kill': 'Mega kill', shaders: 'Shaders',
    couriers: 'Couriers', terrains: 'Terrains', creeps: 'Creeps', trees: 'Trees', river: 'River',
    'ti-bp-effects': 'Effect packs', emblems: 'Emblems', 'creep-deny': 'Deny creeps',
    music: 'Music', 'hero-sounds': 'Hero sounds', sounds: 'Sounds', 'ranged-attack': 'Ranged attacks',
    other: 'Other', ranks: 'Ranks', 'item-icons': 'Item icons', 'versus-screens': 'Versus screen',
    announcers: 'Announcers', wards: 'Wards', pedestal: 'Pedestals', huds: 'HUD',
    herofx: 'Hero effects', pings: 'Pings', packs: 'Versus screen', optimization: 'Optimization',
    tormentor: 'Tormentor', 'high-five': 'High five', ancient: 'Ancients', roshan: 'Roshan',
    towers: 'Towers', fonts: 'Fonts', sites: 'Sites', guides: 'Guides', news: 'News',
  }
};

const CAT_ICON = {
  all: 'apps', heroes: 'person', 'hero-items': 'swords', herofx: 'auto_fix_high',
  'hero-sounds': 'record_voice_over', terrains: 'landscape', trees: 'forest', river: 'water',
  creeps: 'bug_report', towers: 'cell_tower', roshan: 'skull', ancient: 'castle',
  tormentor: 'deployed_code', wards: 'visibility', couriers: 'pets', pedestal: 'podium',
  'creep-deny': 'block', shaders: 'palette', 'ti-bp-effects': 'auto_awesome',
  'item-effects': 'bolt', 'ranged-attack': 'my_location', 'high-five': 'waving_hand',
  backgrounds: 'wallpaper', huds: 'dashboard', emblems: 'military_tech',
  'versus-screens': 'compare_arrows', 'item-icons': 'category', ranks: 'workspace_premium',
  pings: 'notifications_active', cursors: 'arrow_selector_tool', fonts: 'text_fields',
  announcers: 'mic', 'mega-kill': 'campaign', music: 'music_note', sounds: 'volume_up',
  packs: 'compare_arrows', optimization: 'speed', other: 'widgets', guides: 'menu_book',
  sites: 'language', tools: 'build', news: 'newspaper',
};

// rail sections: [label, [categoryIds]]
const RAIL_SECTIONS = {
  ru: [
    ['Герои', ['heroes', 'hero-items', 'herofx', 'hero-sounds']],
    ['Мир', ['terrains', 'trees', 'river', 'creeps', 'towers', 'roshan', 'ancient', 'tormentor', 'wards', 'couriers', 'pedestal', 'creep-deny']],
    ['Эффекты', ['shaders', 'ti-bp-effects', 'item-effects', 'ranged-attack', 'high-five']],
    ['Интерфейс', ['backgrounds', 'huds', 'emblems', 'versus-screens', 'item-icons', 'ranks', 'pings', 'cursors', 'fonts']],
    ['Звук', ['announcers', 'mega-kill', 'music', 'sounds']],
    ['Прочее', ['packs', 'optimization', 'other', 'sites']],
  ],
  en: [
    ['Heroes', ['heroes', 'hero-items', 'herofx', 'hero-sounds']],
    ['World', ['terrains', 'trees', 'river', 'creeps', 'towers', 'roshan', 'ancient', 'tormentor', 'wards', 'couriers', 'pedestal', 'creep-deny']],
    ['Effects', ['shaders', 'ti-bp-effects', 'item-effects', 'ranged-attack', 'high-five']],
    ['Interface', ['backgrounds', 'huds', 'emblems', 'versus-screens', 'item-icons', 'ranks', 'pings', 'cursors', 'fonts']],
    ['Audio', ['announcers', 'mega-kill', 'music', 'sounds']],
    ['Other', ['packs', 'optimization', 'other', 'sites']],
  ],
};

const CATALOG_EXCLUDE = ['tools'];

const HERO_PREVIEW_FALLBACKS = {
  io: 'https://i.postimg.cc/SRq0t679/wisp-vert.jpg',
  anti_mage: 'https://i.postimg.cc/zGPrXR85/antimage-vert.jpg',
  lifestealer: 'https://i.postimg.cc/90p33DL0/life-stealer-vert.jpg',
  nature_prophet: 'https://i.postimg.cc/bv2KyCmn/furion-vert.jpg',
  necrophos: 'https://i.postimg.cc/d3JX9qw6/necrolyte-vert.jpg',
  windranger: 'https://i.postimg.cc/x1B44G9x/Windranger-icon.webp',
};

const SORTS = [
  { key: 'default', label: { ru: 'По умолчанию', en: 'Default' } },
  { key: 'date', label: { ru: 'Сначала новые', en: 'Newest first' } },
  { key: 'name', label: { ru: 'По имени А-Я', en: 'Name A-Z' } },
  { key: 'name-desc', label: { ru: 'По имени Я-А', en: 'Name Z-A' } },
];

const UI_TEXT = {
  ru: {
    appTitle: 'Dota2skins',
    appSubtitle: 'Dota 2',
    searchPlaceholder: 'Поиск модов…',
    clear: 'Очистить',
    minimize: 'Свернуть',
    closeWindow: 'Закрыть',
    home: 'Главная',
    catalog: 'Каталог',
    library: 'Библиотека',
    presets: 'Пресеты',
    authors: 'Авторы',
    tools: 'Инструменты',
    settings: 'Настройки',
    launchDota: 'Запустить Dota 2',
    dashboardNewsTitle: 'Новости лаунчера',
    dashboardStatsTitle: 'Статистика лаунчера',
    modsCount: 'модов',
    authorsCount: 'авторов',
    categoriesCount: 'категорий',
    installedMods: 'установлено',
    noResults: 'Ничего не найдено',
    noNews: 'Новостей пока нет',
    searchText: 'Поиск:',
    loadingCatalog: 'Загрузка каталога…',
    catalogLoadError: 'Не удалось загрузить каталог',
    retry: 'Повторить',
    categories: 'Категории',
    allCategories: 'Все категории',
    modsForDota2: 'Моды для Dota 2',
    recentlyAdded: 'Недавно добавленные',
    viewAll: 'Смотреть всё',
    recentWeekTitle: 'Новые моды за неделю',
    backToHome: 'Назад на главную',
    updated: 'обновлён',
    settingsTitle: 'Настройки',
    languageLabel: 'Язык',
    dotaPath: 'Путь к Dota 2',
    detectAutomatically: 'Найти автоматически',
    browseManually: 'Указать вручную',
    langFolder: 'Языковая папка',
    steamLaunchOption: 'Параметр запуска Steam',
    copy: 'Копировать',
    cacheSize: 'Размер',
    clearCache: 'Очистить',
    catalogTitle: 'Каталог',
    refreshNow: 'Обновить сейчас',
    source: 'Источник',
    about: 'О программе',
    aboutHeroTitle: 'Dota2skins Manager',
    aboutHeroIntro: 'Dota2skins Manager — официальный лаунчер проекта Dota2skins.',
    aboutHeroBody: 'Автоматически загружает каталог модов, устанавливает, обновляет и управляет модами для Dota 2.',
    community: 'Сообщество',
    discordTitle: 'Discord Community',
    discordDesc: 'Присоединяйтесь к нашему сообществу, получайте поддержку, обсуждайте моды и следите за новыми обновлениями.',
    discordAction: 'Присоединиться',
    telegramTitle: 'Telegram Channel',
    telegramDesc: 'Новости проекта, новые моды, обновления лаунчера и важные объявления.',
    telegramAction: 'Открыть Telegram',
    thirdPartySoftware: 'Стороннее программное обеспечение',
    version: 'Версия',
    updatesNote: 'Обновления скачиваются автоматически из GitHub Releases — когда новая версия готова, появится кнопка установки.',
    dotaConnected: 'Dota 2 подключена',
    dotaNotFound: 'Dota 2 не найдена — укажи путь в настройках',
    launchDota: 'Запустить Dota 2',
    openModsFolder: 'Папка модов',
    guides: 'Гайды',
    searchingDota: 'Поиск Dota 2…',
    close: 'Закрыть',
    cancel: 'Отмена',
    delete: 'Удалить',
    installed: 'Установленные',
    preview: 'Превью',
    openLink: 'Открыть ссылку',
    install: 'Установить',
    uninstall: 'Удалить',
    installing: 'Установка…',
    download: 'Скачать',
    downloading: 'Скачивание…',
    save: 'Сохранить',
    backToHeroes: 'Назад к героям',
    noHeroes: 'Нет доступных героев',
    noFilteredMods: 'Ничего не найдено — сбрось фильтры',
    guide: 'Гайд',
    openSite: 'Открыть сайт',
    savePack: 'Сохранить пак',
    deletePack: 'Удалить пак',
    packSaved: 'Пак сохранён',
    packEmpty: 'В паке не осталось модов',
    enterPackName: 'Введи название пака',
    packNameHint: 'Название своего пака…',
    enableAll: 'Включить всё',
    disableAll: 'Отключить всё',
    removeAllMods: 'Удалить все моды',
    removeAllConfirm: 'Удалить все установленные моды?',
    removeAllDone: 'Удалено модов: {count}',
    removeAllResult: 'Удалено модов: {removed}; ошибок: {failed}',
    emptyLibrary: 'Пока ничего не установлено — загляни в Каталог',
    customPack: 'свой пак',
    notFoundInCatalog: 'не найден в каталоге',
    restore: 'Вернуть',
    removeFromPack: 'Убрать',
    removeConfirm: 'Удалить «{name}»?',
    removeFileConfirm: 'Удалить файл {name}?',
    removed: 'удалён',
    removePresetConfirm: 'Удалить пресет «{name}»?',
    packInstallSummary: 'Пак «{name}»: установлено {ok}, пропущено {skip}{fail}',
    packInstallErrors: ', ошибок {count}',
    russian: 'Русский',
    english: 'Английский',
    modsFolderHint: 'Папка модов: dota_{lang}. Не забудь сменить параметр запуска!',
    changeLaunchOption: 'Не забудь сменить параметр запуска!',
    downloadingProgress: 'Скачивание: {label}',
    stageProgress: '{label}: {stage}',
    downloadingAutomatically: 'Скачиваю автоматически…',
    installNoteFonts: 'Шрифт ставится в файлы игры (game\\dota\\panorama\\fonts) — параметр запуска не нужен. Оригиналы сохраняются автоматически.',
    installNoteCursors: 'Курсор ставится в game\\dota\\resource\\cursor — параметр запуска не нужен. Оригиналы сохраняются автоматически.',
    settingsSteamNote: 'Steam → Библиотека → ПКМ по Dota 2 → Свойства → Параметры запуска → вставь строку выше. Моды (кроме шрифтов и курсоров) работают только с этим параметром.',
    settingsSteamWarning: 'В Dota2 теперь требуется указывать допустимый язык, поэтому такие параметры, как -language minify, -language foo, больше не работают. Вместо этого используйте другой допустимый язык.',
    cacheInfoNote: 'Скачанные архивы модов. Нужны для быстрой переустановки — удаление ничего не сломает.',
    externalFiles: 'Внешние файлы в папке модов',
    externalFilesNote: 'Файлы, установленные не через менеджер',
    alwaysActive: 'всегда активен',
    externalFile: 'внешний файл',
    presetsTitle: 'Пресеты',
    presetDescription: 'Пресет запоминает, какие моды включены. Применение пресета включает его моды и выключает остальные.',
    presetNamePlaceholder: 'Название пресета (напр. «Анимешный», «Минимал»)',
    savePreset: 'Сохранить текущее состояние',
    presetEmpty: 'Пресетов пока нет',
    apply: 'Применить',
    emptyPreset: 'пусто (всё будет выключено)',
    noAuthorsFound: 'Авторы не найдены',
    backToAuthors: 'Назад к авторам',
    noAuthorMods: 'У этого автора пока нет модов',
    authorSearchPlaceholder: 'Поиск модов…',
    authorsTitle: 'Авторы',
    authorSite: 'Сайт',
    run: 'Запустить',
    folder: 'Папка',
    ready: 'готов',
    searchHeroes: 'Поиск',
    resultOne: 'результат',
    resultFew: 'результата',
    resultMany: 'результатов',
    updateAvailable: 'Доступно обновление',
    updateReady: 'Обновление готово к установке',
    later: 'Позже',
    restartAndUpdate: 'Перезапустить и обновить',
    noUpdates: 'Обновлений пока нет',
    checkingUpdates: 'Проверка обновлений выполняется…',
    failedUpdates: 'Не удалось проверить обновления',
    refreshingCatalog: 'Обновляю каталог…',
    catalogUpdated: 'Каталог обновлён',
    pathSaved: 'Путь сохранён',
    appLanguageSaved: 'Язык приложения сохранён',
    copiedToClipboard: 'Скопировано в буфер',
    cacheCleared: 'Кэш очищен',
    foundDota: 'Dota 2 найдена: ',
    autoDetectFailed: 'Не нашёл автоматически — укажи вручную',
    updateDownload: 'Скачивание: ',
    notFoundSettings: 'Сначала укажи путь к Dota 2 в настройках',
  },
  en: {
    appTitle: 'Dota2skins',
    appSubtitle: 'Dota 2',
    searchPlaceholder: 'Search mods…',
    clear: 'Clear',
    minimize: 'Minimize',
    closeWindow: 'Close',
    home: 'Home',
    catalog: 'Catalog',
    library: 'Library',
    presets: 'Presets',
    authors: 'Authors',
    tools: 'Tools',
    settings: 'Settings',
    launchDota: 'Launch Dota 2',
    dashboardNewsTitle: 'Launcher news',
    dashboardStatsTitle: 'Launcher statistics',
    modsCount: 'mods',
    authorsCount: 'authors',
    categoriesCount: 'categories',
    installedMods: 'installed',
    noResults: 'Nothing found',
    noNews: 'No news yet',
    searchText: 'Search:',
    loadingCatalog: 'Loading catalog…',
    catalogLoadError: 'Could not load catalog',
    retry: 'Retry',
    categories: 'Categories',
    allCategories: 'All categories',
    modsForDota2: 'Mods for Dota 2',
    recentlyAdded: 'Recently added',
    viewAll: 'View all',
    recentWeekTitle: 'New mods this week',
    backToHome: 'Back to home',
    updated: 'updated',
    settingsTitle: 'Settings',
    languageLabel: 'Language',
    dotaPath: 'Dota 2 path',
    detectAutomatically: 'Detect automatically',
    browseManually: 'Browse manually',
    langFolder: 'Language folder',
    steamLaunchOption: 'Steam launch option',
    copy: 'Copy',
    cacheSize: 'Size',
    clearCache: 'Clear',
    catalogTitle: 'Catalog',
    refreshNow: 'Refresh now',
    source: 'Source',
    about: 'About',
    aboutHeroTitle: 'Dota2skins Manager',
    aboutHeroIntro: 'Dota2skins Manager — the official launcher for the Dota2skins project.',
    aboutHeroBody: 'It automatically loads the mod catalog, installs, updates, and manages mods for Dota 2.',
    community: 'Community',
    discordTitle: 'Discord Community',
    discordDesc: 'Join our community for support, mod discussions, and the latest updates.',
    discordAction: 'Join',
    telegramTitle: 'Telegram Channel',
    telegramDesc: 'Project news, new mods, launcher updates, and important announcements.',
    telegramAction: 'Open Telegram',
    thirdPartySoftware: 'Third-party software',
    version: 'Version',
    updatesNote: 'Updates are downloaded automatically from GitHub Releases — when a new version is ready, an install button appears.',
    dotaConnected: 'Dota 2 is connected',
    dotaNotFound: 'Dota 2 not found — set the path in settings',
    launchDota: 'Launch Dota 2',
    openModsFolder: 'Mods folder',
    guides: 'Guides',
    searchingDota: 'Searching for Dota 2…',
    close: 'Close',
    cancel: 'Cancel',
    delete: 'Delete',
    installed: 'Installed',
    preview: 'Preview',
    openLink: 'Open link',
    install: 'Install',
    uninstall: 'Uninstall',
    installing: 'Installing…',
    download: 'Download',
    downloading: 'Downloading…',
    save: 'Save',
    backToHeroes: 'Back to heroes',
    noHeroes: 'No heroes available',
    noFilteredMods: 'Nothing found — reset the filters',
    guide: 'Guide',
    openSite: 'Open site',
    savePack: 'Save pack',
    deletePack: 'Delete pack',
    packSaved: 'Pack saved',
    packEmpty: 'No mods left in the pack',
    enterPackName: 'Enter a pack name',
    packNameHint: 'Your custom pack will appear in the Packs category',
    enableAll: 'Enable all',
    disableAll: 'Disable all',
    removeAllMods: 'Remove all mods',
    removeAllConfirm: 'Delete all installed mods?',
    removeAllDone: 'Removed mods: {count}',
    removeAllResult: 'Removed mods: {removed}; failures: {failed}',
    emptyLibrary: 'Nothing is installed yet — open the Catalog',
    customPack: 'custom pack',
    notFoundInCatalog: 'not found in catalog',
    restore: 'Restore',
    removeFromPack: 'Remove',
    removeConfirm: 'Delete «{name}»?',
    removeFileConfirm: 'Delete file {name}?',
    removed: 'removed',
    removePresetConfirm: 'Delete preset «{name}»?',
    packInstallSummary: 'Pack «{name}»: installed {ok}, skipped {skip}{fail}',
    packInstallErrors: ', {count} error(s)',
    russian: 'Russian',
    english: 'English',
    modsFolderHint: 'Mods folder: dota_{lang}. Don’t forget to change the launch option!',
    changeLaunchOption: 'Don’t forget to change the launch option!',
    downloadingProgress: 'Downloading: {label}',
    stageProgress: '{label}: {stage}',
    downloadingAutomatically: 'Downloading automatically…',
    installNoteFonts: 'The font is installed into the game files (game\\dota\\panorama\\fonts) — no launch option is needed. Originals are saved automatically.',
    installNoteCursors: 'The cursor is installed into game\\dota\\resource\\cursor — no launch option is needed. Originals are saved automatically.',
    settingsSteamNote: 'Steam → Library → Right-click Dota 2 → Properties → Launch options → paste the string above. Mods (except fonts and cursors) only work with this option.',
    settingsSteamWarning: 'Dota 2 now requires a valid language to be specified, so launch parameters such as -language minify or -language foo no longer work. Use another valid language instead.',
    cacheInfoNote: 'Downloaded mod archives. They are used for quick reinstall — deleting them will not break anything.',
    externalFiles: 'External files in the mods folder',
    externalFilesNote: 'Files installed outside the manager',
    alwaysActive: 'always active',
    externalFile: 'external file',
    presetsTitle: 'Presets',
    presetDescription: 'A preset remembers which mods are enabled. Applying it turns on its mods and turns the rest off.',
    presetNamePlaceholder: 'Preset name (for example “Anime” or “Minimal”)',
    savePreset: 'Save current state',
    presetEmpty: 'No presets yet',
    apply: 'Apply',
    emptyPreset: 'empty (everything will be disabled)',
    noAuthorsFound: 'No authors found',
    backToAuthors: 'Back to authors',
    noAuthorMods: 'This author has no mods yet',
    authorSearchPlaceholder: 'Search mods…',
    authorsTitle: 'Authors',
    authorSite: 'Website',
    run: 'Run',
    folder: 'Folder',
    ready: 'ready',
    searchHeroes: 'Search',
    resultOne: 'result',
    resultFew: 'results',
    resultMany: 'results',
    updateAvailable: 'Update available',
    updateReady: 'Update is ready to install',
    later: 'Later',
    restartAndUpdate: 'Restart and update',
    noUpdates: 'No updates yet',
    checkingUpdates: 'Checking for updates…',
    failedUpdates: 'Could not check for updates',
    refreshingCatalog: 'Refreshing catalog…',
    catalogUpdated: 'Catalog updated',
    pathSaved: 'Path saved',
    appLanguageSaved: 'App language saved',
    copiedToClipboard: 'Copied to clipboard',
    cacheCleared: 'Cache cleared',
    foundDota: 'Dota 2 found: ',
    autoDetectFailed: 'Could not detect automatically — set it manually',
    updateDownload: 'Downloading: ',
    notFoundSettings: 'Set the Dota 2 path in settings first',
  }
};

const state = {
  view: 'home',
  catalog: null,
  settings: null,
  activeCategory: 'all',
  search: '',
  filters: { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '' },
  librarySearch: '',
  installedIndex: new Map(),
  installing: new Set(),
  modIndex: new Map(),
  authors: { selected: null, search: '', sort: 'default' },
};

const $ = (sel) => document.querySelector(sel);
const viewRoot = $('#view-root');

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmtMB(bytes) { return (bytes / 1024 / 1024).toFixed(1); }

function getLang() {
  if (state.settings?.appLanguage) return state.settings.appLanguage;
  const locale = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  return locale.startsWith('ru') ? 'ru' : 'en';
}
function t(key) { return UI_TEXT[getLang()]?.[key] ?? UI_TEXT.ru?.[key] ?? key; }
function trLabel(id) { return CAT_LABELS[getLang()]?.[id] ?? CAT_LABELS.ru?.[id] ?? id; }
function trSortLabel(key) { return SORTS.find((s) => s.key === key)?.label?.[getLang()] ?? key; }
function translateUi(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (key) el.setAttribute('aria-label', t(key));
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) el.setAttribute('title', t(key));
  });
  root.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.dataset.i18nAlt;
    if (key) el.setAttribute('alt', t(key));
  });
}

function parseDateValue(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return value > 1e12 ? value : value * 1000;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      return num > 1e12 ? num : num * 1000;
    }
    const parsed = Date.parse(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function fmtDate(value) {
  const ts = parseDateValue(value);
  if (ts === null) return '';
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return '';
  const locale = getLang() === 'en' ? 'en-US' : 'ru';
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

function getModDateValue(mod) {
  return mod?.meta?.date || mod?.createdAt || mod?.created_at || mod?.date || null;
}

function plural(n, ruOne, ruFew, ruMany, enOne = 'item', enMany = 'items') {
  if (getLang() === 'en') return n === 1 ? enOne : enMany;
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return ruOne;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return ruFew;
  return ruMany;
}

function toast(msg, type = 'ok', ms = 4000) {
  const el = document.createElement('div');
  el.className = `toast ${type === 'ok' ? '' : type}`;
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function previewUrl(categoryId, preview) {
  if (!preview) return null;
  if (/^https?:\/\//i.test(preview)) return preview;
  if (/^file:\/\//i.test(preview)) return preview.replace(/^file:\/\//i, '');
  if (preview.startsWith('assets/previews/')) return `${RAW_BASE}/${preview.split('/').map(encodeURIComponent).join('/')}`;
  return `${RAW_BASE}/assets/previews/${encodeURIComponent(categoryId)}/${encodeURIComponent(preview)}`;
}

function resolveDownloadTarget(mod, style) {
  const candidates = [];
  const direct = style?.file || mod?.file || mod?.downloadUrl || mod?.downloadUrlOverride;
  if (direct) candidates.push(direct);
  if (Array.isArray(mod?.downloadOptions)) {
    for (const opt of mod.downloadOptions) {
      if (opt?.url) candidates.push(opt.url);
    }
  }
  if (Array.isArray(mod?.links)) {
    for (const link of mod.links) {
      if (link?.type === 'download' && link?.url) candidates.push(link.url);
      if ((link?.type === 'file' || link?.type === 'source') && link?.url) candidates.push(link.url);
    }
  }
  const picked = candidates.find((value) => typeof value === 'string' && value.trim());
  if (!picked) return null;
  if (/^https?:\/\//i.test(picked)) return picked;
  return `${RAW_BASE}/${picked.split('/').map(encodeURIComponent).join('/')}`;
}

function isVideo(src) { return /\.(mp4|webm)$/i.test(src || ''); }
function isAudio(src) { return /\.(mp3|wav|ogg)$/i.test(src || ''); }
function isImage(src) { return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(src || ''); }
function isMedia(src) { return isVideo(src) || isAudio(src); }
function isYouTubeUrl(url) { return /(?:youtube\.com\/watch\?[^#]*v=|youtube\.com\/embed\/|youtu\.be\/)/i.test(url || ''); }
function isVimeoUrl(url) { return /vimeo\.com\//i.test(url || ''); }
function isEmbeddableVideoUrl(url) { return isYouTubeUrl(url) || isVimeoUrl(url); }
function getEmbedUrl(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?[^#]*v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

// resolve a repo-relative or absolute link to a full URL
function resolveUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${RAW_BASE}/${url.split('/').map(encodeURIComponent).join('/')}`;
}

function resolvePreviewAction(categoryId, mod) {
  const previewLink = (mod?.links || []).find((l) => l?.type === 'preview' && typeof l?.url === 'string' && l.url.trim());
  if (!previewLink) return null;

  const value = previewLink.url.trim();
  const resolved = previewUrl(categoryId, value);
  if (isMedia(resolved)) return { kind: isAudio(resolved) ? 'audio' : 'media', url: resolved };
  const embedUrl = getEmbedUrl(value);
  if (embedUrl) return { kind: 'embed', url: embedUrl, rawUrl: value };
  return null;
}

function mediaHtml(url, { hoverPlay = false, autoplay = false, controls = false } = {}) {
  const normalizedUrl = typeof url === 'string' ? url.trim() : '';
  if (!normalizedUrl) {
    return `<div class="noimg"><span class="ms" style="font-size:36px">image</span></div>`;
  }
  if (isVideo(normalizedUrl)) {
    return `<video src="${esc(normalizedUrl)}" ${controls ? 'controls' : 'muted'} loop playsinline preload="${autoplay ? 'auto' : 'none'}" ${autoplay ? 'autoplay' : ''} ${hoverPlay ? 'data-hoverplay="1"' : ''}></video>`;
  }
  if (isAudio(normalizedUrl)) {
    return `<div class="audio-wrap"><span class="ms audio-icon">graphic_eq</span><audio src="${esc(normalizedUrl)}" controls preload="none"></audio></div>`;
  }
  return `<img src="${esc(normalizedUrl)}" loading="lazy" alt="">`;
}

// ---------- custom confirm dialog ----------

function confirmDialog(message, { okLabel = t('delete'), danger = true } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-msg">${esc(message)}</div>
        <div class="confirm-actions">
          <button class="btn" data-c="no">${t('cancel')}</button>
          <button class="btn ${danger ? 'btn-danger-solid' : 'btn-primary'}" data-c="yes">${esc(okLabel)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const done = (v) => { overlay.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) done(false); });
    overlay.querySelector('[data-c="no"]').addEventListener('click', () => done(false));
    overlay.querySelector('[data-c="yes"]').addEventListener('click', () => done(true));
    const onKey = (e) => { if (e.key === 'Escape') done(false); };
    document.addEventListener('keydown', onKey);
    overlay.querySelector('[data-c="yes"]').focus();
  });
}

function authorUrl(name) {
  return state.catalog?.constants?.MOD_AUTHOR?.[name] || state.catalog?.constants?.MOD_SENDER?.[name] || null;
}

// media preview a mod can play in the built-in player: a "preview"-type link, or a video preview file
function modPreviewMedia(categoryId, mod) {
  const action = resolvePreviewAction(categoryId, mod);
  return action?.url || null;
}

// ---------- built-in media player ----------

function fmtTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function openPlayer(urlOrAction, title) {
  const action = typeof urlOrAction === 'string' ? { kind: isAudio(urlOrAction) ? 'audio' : 'media', url: urlOrAction } : urlOrAction;
  const url = action?.url || '';
  const audio = action?.kind === 'audio' || isAudio(url);
  const embed = action?.kind === 'embed';
  const image = action?.kind === 'image' || isImage(url);
  const overlay = document.createElement('div');
  overlay.className = 'player-overlay';
  overlay.innerHTML = `
    <div class="player-box ${audio ? 'audio' : ''}">
      ${embed
        ? `<div class="player-embed"><iframe src="${esc(url)}" title="${esc(title || '')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`
        : audio
          ? `<div class="player-audio-visual"><span class="ms">graphic_eq</span></div><audio src="${esc(url)}" autoplay></audio>`
          : image
            ? `<div class="player-image"><img src="${esc(url)}" alt="${esc(title || '')}"></div>`
            : `<video src="${esc(url)}" autoplay playsinline></video>`}
      <div class="player-title">${esc(title || '')}</div>
      <button class="player-close" aria-label="${t('close')}"><span class="ms">close</span></button>
      ${embed ? '' : `<div class="player-controls">
        <button class="pl-btn" data-act="play" aria-label="Пауза"><span class="ms">pause</span></button>
        <div class="pl-progress"><div class="pl-fill"></div><div class="pl-knob"></div></div>
        <span class="pl-time">0:00 / 0:00</span>
        <button class="pl-btn" data-act="mute" aria-label="Звук"><span class="ms">volume_up</span></button>
        ${audio || image ? '' : `<button class="pl-btn" data-act="fs" aria-label="${t('close')}"><span class="ms">fullscreen</span></button>`}
      </div>`}
    </div>`;
  document.body.appendChild(overlay);

  const media = overlay.querySelector('video, audio');
  const box = overlay.querySelector('.player-box');
  const playBtn = overlay.querySelector('[data-act="play"] .ms');
  const muteBtn = overlay.querySelector('[data-act="mute"] .ms');
  const fill = overlay.querySelector('.pl-fill');
  const knob = overlay.querySelector('.pl-knob');
  const timeEl = overlay.querySelector('.pl-time');
  const progress = overlay.querySelector('.pl-progress');

  if (media) media.loop = true;

  const close = () => {
    if (media) media.pause();
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  };
  document.addEventListener('keydown', onKey, true);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('.player-close').addEventListener('click', close);

  const togglePlay = () => { media.paused ? media.play() : media.pause(); };
  overlay.querySelector('[data-act="play"]').addEventListener('click', togglePlay);
  media.addEventListener('play', () => { playBtn.textContent = 'pause'; });
  media.addEventListener('pause', () => { playBtn.textContent = 'play_arrow'; });
  if (!audio) media.addEventListener('click', togglePlay);

  media.addEventListener('timeupdate', () => {
    const pct = media.duration ? (media.currentTime / media.duration) * 100 : 0;
    fill.style.width = `${pct}%`;
    knob.style.left = `${pct}%`;
    timeEl.textContent = `${fmtTime(media.currentTime)} / ${fmtTime(media.duration)}`;
  });

  const seek = (e) => {
    const rect = progress.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (media.duration) media.currentTime = pct * media.duration;
  };
  progress.addEventListener('mousedown', (e) => {
    seek(e);
    const move = (ev) => seek(ev);
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });

  overlay.querySelector('[data-act="mute"]').addEventListener('click', () => {
    media.muted = !media.muted;
    muteBtn.textContent = media.muted ? 'volume_off' : 'volume_up';
  });
  const fsBtn = overlay.querySelector('[data-act="fs"]');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else box.requestFullscreen();
    });
  }
}

function keyOf(categoryId, name, styleLabel) {
  return `${categoryId}|${name}|${styleLabel || ''}`;
}

async function refreshInstalledIndex() {
  const { installed } = await window.api.mods.list();
  state.installedIndex.clear();
  for (const rec of installed) {
    state.installedIndex.set(keyOf(rec.categoryId, rec.name, rec.styleLabel), rec);
  }
  $('#libCount').textContent = installed.length || '';
}

// ---------- catalog data helpers ----------

// user-created packs live in localStorage
function customPacks() {
  try {
    return JSON.parse(localStorage.getItem('customPacks') || '[]');
  } catch {
    return [];
  }
}

function saveCustomPacks(packs) {
  localStorage.setItem('customPacks', JSON.stringify(packs));
}

function categoryMods(categoryId) {
  const data = state.catalog?.mods?.modsData?.[categoryId];
  if (!data) return [];
  if (Array.isArray(data)) {
    const mods = data.map((m) => ({ ...m, _group: null }));
    if (categoryId === 'packs') {
      for (const p of customPacks()) {
        mods.push({ name: p.name, type: 'pack', mods: p.mods, _group: null, _custom: true });
      }
    }
    return mods;
  }
  if (data.groups) {
    const out = [];
    for (const g of data.groups) {
      for (const m of g.mods || []) out.push({ ...m, _group: g.name, _groupId: g.id });
    }
    return out;
  }
  return [];
}

function isGrouped(categoryId) {
  const data = state.catalog?.mods?.modsData?.[categoryId];
  return !!(data && !Array.isArray(data) && data.groups);
}

function visibleCategories() {
  const cats = state.catalog?.constants?.categories || [];
  return cats
    .filter((c) => !CATALOG_EXCLUDE.includes(c.id))
    .map((c) => ({ ...c, _modsCount: categoryMods(c.id).length }))
    .sort((a, b) => b._modsCount - a._modsCount || (a.id || '').localeCompare(b.id || ''));
}

function buildModIndex() {
  state.modIndex.clear();
  for (const c of state.catalog?.constants?.categories || []) {
    for (const m of categoryMods(c.id)) {
      if (m.name) state.modIndex.set(m.name.toLowerCase(), { categoryId: c.id, mod: m });
    }
  }
}

function catName(id) {
  if (id === 'all') return getLang() === 'en' ? 'All categories' : 'Все категории';
  return trLabel(id) || state.catalog?.constants?.translations?.[id] || id;
}

function catIcon(id) { return CAT_ICON[id] || 'extension'; }

function resolveHeroPreview(hero) {
  const slug = (hero?.slug || hero?.id || '').toString().toLowerCase();
  const explicit = HERO_PREVIEW_FALLBACKS[slug];
  if (explicit) return explicit;
  const raw = hero?.preview || null;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${RAW_BASE}/${raw.split('/').map(encodeURIComponent).join('/')}`;
}

function installTarget(mod) {
  const f = mod.file;
  if (!f) return null;
  if (/\.(vpk|zip)$/i.test(f)) return f;
  return null;
}

function tagLabel(categoryId, tag) {
  const cfg = state.catalog?.constants?.TAG_CONFIGS?.[categoryId];
  return cfg?.map?.[tag] || tag;
}

function isInstalled(categoryId, m) {
  return state.installedIndex.has(keyOf(categoryId, m.name, null)) ||
    (m.styles || []).some((s) => state.installedIndex.has(keyOf(categoryId, m.name, s.label)));
}

// ---------- filtering / sorting ----------

function collectTags(mods) {
  const tags = new Map(); // tag -> count
  for (const m of mods) {
    for (const [k, v] of Object.entries(m.tags || {})) {
      if (v) tags.set(k, (tags.get(k) || 0) + 1);
    }
  }
  return [...tags.entries()].sort((a, b) => b[1] - a[1]);
}

function collectGroups(mods) {
  const seen = new Set();
  const out = [];
  for (const m of mods) {
    if (m._group && !seen.has(m._group)) {
      seen.add(m._group);
      out.push(m._group);
    }
  }
  return out;
}

function heroMatches(hero, name) {
  const re = new RegExp(`\\b${hero.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return re.test(name);
}

function applyFilters(mods, catForInstalled) {
  const f = state.filters;
  let out = mods;
  if (f.group) out = out.filter((m) => m._group === f.group);
  if (f.hero) out = out.filter((m) => heroMatches(f.hero, m.name));
  if (f.tags.size) {
    out = out.filter((m) => [...f.tags].every((t) => m.tags?.[t]));
  }
  if (f.installedOnly) {
    out = out.filter((m) => isInstalled(m._cat || catForInstalled, m));
  }
  const dateOf = (m) => m.meta?.date || 0;
  switch (f.sort) {
    case 'date': out = [...out].sort((a, b) => dateOf(b) - dateOf(a)); break;
    case 'name': out = [...out].sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': out = [...out].sort((a, b) => b.name.localeCompare(a.name)); break;
  }
  return out;
}

// ---------- window controls ----------

$('#winMin')?.addEventListener('click', () => window.api.win.minimize());
$('#winClose')?.addEventListener('click', () => window.api.win.close());

// ---------- navigation ----------

document.querySelectorAll('.tb-tab').forEach((btn) => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

function switchView(view) {
  closeModal();
  closeSlotModals();
  document.querySelectorAll('.tb-tab').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  state.view = view;
  $('#catRail').classList.toggle('hidden', view !== 'catalog');
  render();
}

$('#openModsFolderBtn').addEventListener('click', async () => {
  const r = await window.api.misc.openLangFolder();
  if (r.error) toast(r.error, 'error');
});

$('#launchDotaBtn').addEventListener('click', async () => {
  const r = await window.api.misc.launchDota();
  if (r?.error) toast(r.error, 'warn');
});

// global search
let searchTimer = null;
$('#globalSearch').addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value;
    $('#clearSearch').classList.toggle('hidden', !state.search);
    if (state.view !== 'catalog') switchView('catalog');
    else renderCatalog();
    $('#globalSearch')?.focus();
  }, 180);
});
$('#clearSearch').addEventListener('click', () => {
  $('#globalSearch').value = '';
  state.search = '';
  $('#clearSearch').classList.add('hidden');
  if (state.view === 'catalog') renderCatalog();
});

// ---------- views ----------

function render() {
  let renderer = renderCatalog;
  switch (state.view) {
    case 'home': renderer = renderDashboard; break;
    case 'catalog': renderer = renderCatalog; break;
    case 'library': renderer = renderLibrary; break;
    case 'presets': renderer = renderPresets; break;
    case 'authors': renderer = renderAuthors; break;
    case 'tools': renderer = renderTools; break;
    case 'settings': renderer = renderSettings; break;
    case 'about': renderer = renderAbout; break;
  }
  renderer();
  translateUi(document);
}

// ===== Category rail =====

function renderRail() {
  const rail = $('#catRail');
  const sortedCats = visibleCategories();
  const cats = new Set(sortedCats.map((c) => c.id));
  const catOrder = new Map(sortedCats.map((c, index) => [c.id, index]));
  let html = `
    <button class="rail-item ${state.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
      <span class="ms">apps</span>${t('allCategories')}
    </button>`;
  for (const [, ids] of (RAIL_SECTIONS[getLang()] || RAIL_SECTIONS.ru)) {
    const present = ids.filter((id) => cats.has(id)).sort((a, b) => (catOrder.get(a) ?? 9999) - (catOrder.get(b) ?? 9999));
    if (!present.length) continue;
    for (const id of present) {
      html += `
        <button class="rail-item ${state.activeCategory === id ? 'active' : ''}" data-cat="${esc(id)}">
          <span class="ms">${catIcon(id)}</span>${esc(catName(id))}
          <span class="rail-cnt">${categoryMods(id).length}</span>
        </button>`;
    }
  }
  rail.innerHTML = html;
  rail.querySelectorAll('.rail-item').forEach((b) => {
    b.addEventListener('click', () => {
      state.activeCategory = b.dataset.cat;
      state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '' };
      renderCatalog();
    });
  });
}

// ===== Catalog =====

function getRecentWeekMods() {
  const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const mods = [];
  for (const cat of visibleCategories()) {
    for (const mod of categoryMods(cat.id)) {
      const ts = parseDateValue(getModDateValue(mod));
      if (!ts || ts < cutoff) continue;
      mods.push({ ...mod, _cat: cat.id });
    }
  }
  return mods.sort((a, b) => (parseDateValue(getModDateValue(b)) || 0) - (parseDateValue(getModDateValue(a)) || 0));
}

function renderRecentWeekPage() {
  const recentWeekMods = getRecentWeekMods();
  viewRoot.innerHTML = `
    <div class="view-header">
      <div>
        <button class="btn btn-ghost" id="recentWeekBackBtn"><span class="ms">arrow_back</span>${t('backToHome')}</button>
        <h1 class="view-title">${t('recentWeekTitle')}</h1>
      </div>
      <span class="view-sub">${recentWeekMods.length} ${plural(recentWeekMods.length, 'мод', 'мода', 'модов', 'mod', 'mods')}</span>
    </div>
    <div class="grid" id="modGrid">
      ${recentWeekMods.length ? recentWeekMods.map((m, i) => cardHtml(m, i, true)).join('') : `<div class="empty-note">${t('noResults')}</div>`}
    </div>`;
  $('#recentWeekBackBtn')?.addEventListener('click', () => render());
  bindCards(viewRoot, recentWeekMods);
}

function renderCatalog() {
  if (!state.catalog) {
    viewRoot.innerHTML = `<div class="empty-note">${t('loadingCatalog')}</div>`;
    return;
  }
  if (state.catalog.error) {
    viewRoot.innerHTML = `
      <div class="empty-note">
        ${t('catalogLoadError')}: ${esc(state.catalog.error)}<br><br>
        <button class="btn btn-primary" id="retryCat">${t('retry')}</button>
      </div>`;
    $('#retryCat').addEventListener('click', () => loadCatalog(true));
    return;
  }

  renderRail();

  const searching = state.search.trim().length > 0;
  if (searching) return renderSearchResults();
  if (state.activeCategory === 'all') return renderHome();
  renderCategory(state.activeCategory);
}

// --- home (all categories) ---

function renderDashboard() {
  const cats = visibleCategories();
  const totalMods = cats.reduce((n, c) => n + categoryMods(c.id).length, 0);
  const totalAuthors = 12;
  const categoriesCount = cats.length;
  const installedModsCount = state.installedIndex.size || parseInt($('#libCount')?.textContent || '0') || 0;
  const recentMods = ((state.catalog?.mods?.recentlyAddedMods || [])
    .slice(0, 8)
    .map((m) => ({ ...m, _cat: m._cat || m.categoryId || m.category || 'other' })) || []);
  const updateItems = (getLang() === 'en' ? [
    {
      title: '1.1.1 launcher bug fix',
      date: '2026-07-29',
      meta: 'Bug fix',
      changes: [
        'Fixed launcher issues related to mod installation naming for certain categories.'
      ],
    },
    {
      title: '1.1.0 launcher update',
      date: '2026-07-28',
      meta: 'Improvements and fixes',
      changes: [
        'Fixed library search focus and prevented input losing cursor after each keystroke.',
        'Updated sort labels to show human-readable options across categories.',
        
        'Miscellaneous bug fixes and UI polish.'
      ],
    },
    {
      title: '1.0.9 launcher patch',
      date: '2026-07-26',
      meta: 'Bug fix',
      changes: [
        'Bug fix'
      ],
    },
    {
      title: '1.0.8 launcher polish',
      date: '2026-07-26',
      meta: 'New patch notes popups, smoother recent mods preview, and a cleaner launcher scrollbar.',
      changes: [
        'Added modal popups for patch notes with release date and detailed change log.',
        'Added a “View all” button for the recent mods section.',
        'Improved the launcher scrollbar styling for a cleaner look.'
      ],
    },
    {
      title: '1.0.7 launcher refresh',
      date: '2026-07-25',
      meta: 'New home dashboard, clearer navigation, and smoother library controls.',
      changes: [
        'Added a refreshed home dashboard with launcher statistics and recent mods.',
        'Improved category browsing and the launcher search experience.',
        'Added support for switching language from Settings without restarting the app.'
      ],
    },
  ] : [
    {
      title: 'Версия 1.1.1',
      date: '2026-07-29',
      meta: 'Баг фикс',
      changes: [
        'Исправлены проблемы с названиями устанавливаемых модов в некоторых категориях.'
      ],
    },
    {
      title: 'Версия 1.1.0',
      date: '2026-07-28',
      meta: 'Улучшения и исправления',
      changes: [
        'Исправлен фокус поиска в библиотеке — курсор больше не теряется при вводе.',
        'Обновлены метки сортировки — корректный вывод опций во всех категориях.',
        
        'Различные исправления и полировка интерфейса.'
      ],
    },
    {
      title: 'Версия 1.0.9',
      date: '2026-07-26',
      meta: 'Баг фикс',
      changes: [
        'Баг фикс'
      ],
    },
    {
      title: 'Обновление 1.0.8',
      date: '2026-07-26',
      meta: 'Новые всплывающие патч-ноты, улучшенный блок недавних модов и более аккуратный скроллбар.',
      changes: [
        'Добавлены модальные окна для патч-нотов с датой и подробным списком изменений.',
        'Добавлена кнопка «Смотреть всё» для блока недавно добавленных модов.',
        'Скроллбар лаунчера стал тоньше и аккуратнее.'
      ],
    },
    {
      title: 'Обновление 1.0.7',
      date: '2026-07-25',
      meta: 'Новый стартовый экран, понятнее навигация и удобнее управление библиотекой.',
      changes: [
        'Добавлен обновлённый главный экран с новостями, статистикой и новыми модами.',
        'Улучшено переключение категорий и поиск по лаунчеру.',
        'Добавлена возможность менять язык в настройках без перезапуска.'
      ],
    },
  ]);

  viewRoot.innerHTML = `
    <div class="dashboard-grid">
      <section class="dashboard-news">
        <div class="section-h"><span class="ms">new_releases</span>${t('dashboardNewsTitle')}</div>
        <div class="news-list">
          ${updateItems.map((item) => `
            <article class="news-item" data-news-title="${esc(item.title)}" data-news-date="${esc(item.date)}" data-news-meta="${esc(item.meta)}" data-news-changes="${esc(item.changes.join(' | '))}">
              <div class="news-item-title">${esc(item.title)}</div>
              <div class="news-item-meta">${esc(item.meta)}</div>
            </article>`).join('')}
        </div>
      </section>
      <aside class="dashboard-stats">
        <div class="section-h"><span class="ms">insights</span>${t('dashboardStatsTitle')}</div>
        <div class="stats-grid">
          <div class="stats-card">
            <div class="stats-value">${totalMods}</div>
            <div class="stats-label">${t('modsCount')}</div>
          </div>
          <div class="stats-card">
            <div class="stats-value">${totalAuthors}</div>
            <div class="stats-label">${t('authorsCount')}</div>
          </div>
          <div class="stats-card">
            <div class="stats-value">${categoriesCount}</div>
            <div class="stats-label">${t('categoriesCount')}</div>
          </div>
          <div class="stats-card">
            <div class="stats-value">${installedModsCount}</div>
            <div class="stats-label">${t('installedMods')}</div>
          </div>
        </div>
      </aside>
      <section class="dashboard-recent">
        <div class="section-h recent-section-head">
          <span class="ms">auto_awesome</span>${t('recentlyAdded')}
          <button class="btn btn-ghost recent-all-btn" id="recentWeekBtn">${t('viewAll')}</button>
        </div>
        <div class="recent-row">
          ${recentMods.length ? recentMods.map((m, i) => cardHtml(m, i, true)).join('') : `<div class="empty-note">${t('noResults')}</div>`}
        </div>
      </section>
    </div>`;
  $('#recentWeekBtn')?.addEventListener('click', () => renderRecentWeekPage());
  viewRoot.querySelectorAll('.news-item').forEach((item) => {
    item.addEventListener('click', () => {
      const title = item.dataset.newsTitle || '';
      const rawDate = item.dataset.newsDate || '';
      const meta = item.dataset.newsMeta || '';
      const changes = (item.dataset.newsChanges || '').split(' | ').filter(Boolean);
      const date = rawDate ? new Date(rawDate).toLocaleDateString(getLang() === 'en' ? 'en-US' : 'ru', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      const overlay = document.createElement('div');
      overlay.className = 'slot-modal-overlay';
      overlay.innerHTML = `
        <div class="modal-box">
          <div class="modal-header">
            <h2 class="modal-title">${esc(title)}</h2>
            <button class="modal-close" aria-label="${t('close')}"><span class="ms">close</span></button>
          </div>
          <div class="modal-body">
            <div class="news-modal-meta">${esc(meta)}</div>
            <div class="news-modal-date">${esc(date)}</div>
            <ul class="news-modal-list">
              ${changes.map((change) => `<li>${esc(change)}</li>`).join('')}
            </ul>
          </div>
        </div>`;
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
      overlay.querySelector('.modal-close')?.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
  bindCards(viewRoot, recentMods);
}

function renderHome() {
  const cats = visibleCategories();

  viewRoot.innerHTML = `
    <div class="section-h"><span class="ms">apps</span>${t('categories')}</div>
    <div class="cat-tiles">
        ${cats.map((c, i) => {
          const prev = c.preview ? previewUrl(c.id, c.preview) : null;
          return `
          <div class="cat-tile" data-cat="${esc(c.id)}" style="--i:${Math.min(i, 24)}">
            ${prev ? mediaHtml(prev) : ''}
            <div class="ct-shade"></div>
            <div class="ct-label">
              <span class="ct-name">${esc(catName(c.id))}</span>
              <span class="ct-cnt">${categoryMods(c.id).length}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
  `;

  viewRoot.querySelectorAll('.cat-tile').forEach((t) => {
    t.addEventListener('click', () => {
      state.activeCategory = t.dataset.cat;
      state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '' };
      renderCatalog();
      $('#main').scrollTop = 0;
    });
  });
  bindCards(viewRoot);
}

// --- search results ---

function renderSearchResults() {
  const q = state.search.trim().toLowerCase();
  const cats = visibleCategories();
  let mods = [];
  for (const c of cats) {
    for (const m of categoryMods(c.id)) {
      if (m.name && m.name.toLowerCase().includes(q)) mods.push({ ...m, _cat: c.id });
    }
  }
  mods = applyFilters(mods);

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${t('searchText')} <span class="accent">${esc(state.search.trim())}</span></h1>
    </div>
    ${toolbarHtml(mods.length, { tags: [], groups: [] })}
    <div class="grid" id="modGrid">
      ${mods.length ? mods.map((m, i) => cardHtml(m, i, true)).join('') : `<div class="empty-note">${t('noResults')}</div>`}
    </div>
  `;
  bindToolbar();
  bindCards(viewRoot, mods);
}

// --- single category ---

const SLOT_LABELS = {
  ru: {
    set: 'Набор',
    default: 'Набор',
    head: 'Голова',
    headpiece: 'Голова',
    mask: 'Маска',
    shoulders: 'Плечи',
    back: 'Спина',
    cape: 'Плащ',
    legs: 'Ноги',
    boots: 'Ботинки',
    weapon: 'Оружие',
    offhand: 'Левая рука',
    arm: 'Рука',
    arms: 'Руки',
    body: 'Тело',
    chest: 'Грудь',
    waist: 'Пояс',
    pet: 'Питомец',
    tail: 'Хвост',
    item: 'Предмет',
    voice: 'Голос',
    misc: 'Разное',
    default: 'Набор',
  },
  en: {
    set: 'Set',
    default: 'Set',
    head: 'Head',
    headpiece: 'Head',
    mask: 'Mask',
    shoulders: 'Shoulders',
    back: 'Back',
    cape: 'Cape',
    legs: 'Legs',
    boots: 'Boots',
    weapon: 'Weapon',
    offhand: 'Off-hand',
    arm: 'Arm',
    arms: 'Arms',
    body: 'Body',
    chest: 'Chest',
    waist: 'Waist',
    pet: 'Pet',
    tail: 'Tail',
    item: 'Item',
    voice: 'Voice',
    misc: 'Misc',
  },
};
const SLOT_ORDER = {
  set: 0,
  default: 0,
  head: 1,
  headpiece: 1,
  mask: 2,
  shoulders: 3,
  back: 4,
  cape: 5,
  body: 6,
  chest: 7,
  waist: 8,
  legs: 9,
  boots: 10,
  weapon: 11,
  offhand: 12,
  arm: 13,
  arms: 13,
  tail: 14,
  pet: 15,
  item: 16,
  voice: 17,
  misc: 18,
};
function translateSlot(slot) {
  const key = (slot || 'default').toString().trim().toLowerCase();
  return SLOT_LABELS[getLang()]?.[key] || SLOT_LABELS.ru?.[key] || slot || (getLang() === 'en' ? 'Set' : 'Набор');
}
function sortSlots(slots) {
  return [...new Set(slots.map((slot) => slot || 'default'))].sort((a, b) => {
    const aKey = (a || 'default').toString().trim().toLowerCase();
    const bKey = (b || 'default').toString().trim().toLowerCase();
    const order = (SLOT_ORDER[aKey] ?? 99) - (SLOT_ORDER[bKey] ?? 99);
    if (order !== 0) return order;
    return translateSlot(aKey).localeCompare(translateSlot(bKey), 'ru', { sensitivity: 'base' });
  });
}

function renderCategory(categoryId) {
  const all = categoryMods(categoryId).map((m) => ({ ...m, _cat: categoryId }));
  const tags = collectTags(all);
  const groups = isGrouped(categoryId) ? collectGroups(all) : [];
  const heroes = categoryId === 'heroes'
    ? (state.catalog?.constants?.HERO_CATALOG || []).filter((h) => (h.modsCount || 0) > 0)
    : [];
  const mods = applyFilters(all, categoryId);

  const grouped = isGrouped(categoryId) && !state.filters.group && state.filters.sort === 'default';

  let gridHtml = '';
  if (categoryId === 'heroes') {
    const selectedHero = state.filters.hero || '';
    const heroSearch = (state.filters.heroSearch || '').toLowerCase();
    const filteredHeroes = (heroSearch
      ? heroes.filter((h) => h.name.toLowerCase().includes(heroSearch))
      : heroes)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' }));
    
    if (selectedHero) {
      const heroEntry = heroes.find((h) => h.slug === selectedHero || h.name === selectedHero);
      const items = heroEntry ? all.filter((m) => (m.hero || '').toLowerCase() === heroEntry.slug.toLowerCase()) : [];
      const slots = sortSlots(items.map((m) => m.slot || 'default'));
      const slotCards = slots.map((slot) => {
        const slotMods = items.filter((m) => (m.slot || 'default') === slot);
        const modCount = slotMods.length;
        const slotTitle = translateSlot(slot);
        const firstPreview = slotMods.find((m) => m.preview || m.imageUrl)?.preview || slotMods.find((m) => m.preview || m.imageUrl)?.imageUrl || null;
        const previewHtml = firstPreview ? `<div class="hero-slot-media">${mediaHtml(previewUrl(categoryId, firstPreview), { hoverPlay: false })}</div>` : '';
        return `
          <div class="hero-slot-card" data-slot="${esc(slot)}">
            ${previewHtml}
            <div class="hero-slot-info">
              <div class="hero-slot-title">${esc(slotTitle)}</div>
            </div>
          </div>`;
      }).join('');
      gridHtml = `
        <div class="hero-detail">
          <button class="btn btn-ghost hero-back" id="heroBackBtn"><span class="ms">arrow_back</span>${t('backToHeroes')}</button>
          <div class="hero-detail-title">${esc(heroEntry?.name || selectedHero)}</div>
          <div class="hero-slots-grid">${slotCards}</div>
        </div>`;
    } else if (!filteredHeroes.length) {
      gridHtml = `<div class="empty-note">${t('noHeroes')}</div>`;
    } else {
      const heroCards = filteredHeroes.map((hero) => {
        const previewUrlValue = resolveHeroPreview(hero);
        const previewHtml = previewUrlValue ? `<div class="hero-card-media">${mediaHtml(previewUrl('heroes', previewUrlValue))}</div>` : '';
        return `
          <div class="card hero-card" data-hero="${esc(hero.slug)}">
            ${previewHtml}
            <div class="hero-card-content">
              <div class="hero-card-title">${esc(hero.name)}</div>
              <div class="hero-card-meta">${hero.modsCount || 0} ${plural(hero.modsCount || 0, 'мод', 'мода', 'модов', 'mod', 'mods')}</div>
            </div>
          </div>`;
      }).join('');
      gridHtml = `<div class="hero-grid">${heroCards}</div>`;
    }
  } else if (!mods.length) {
    gridHtml = `<div class="empty-note">${t('noFilteredMods')}</div>`;
  } else if (grouped) {
    let lastGroup = null;
    mods.forEach((m, i) => {
      if (m._group !== lastGroup) {
        gridHtml += `<div class="group-title">${esc(m._group)}</div>`;
        lastGroup = m._group;
      }
      gridHtml += cardHtml(m, i);
    });
  } else {
    gridHtml = mods.map((m, i) => cardHtml(m, i)).join('');
  }

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${esc(catName(categoryId))}</h1>
      <span class="view-sub">${all.length} ${plural(all.length, 'мод', 'мода', 'модов', 'mod', 'mods')}</span>
    </div>
    ${toolbarHtml(mods.length, { tags, groups, heroes, categoryId })}
    <div class="grid" id="modGrid">${gridHtml}</div>
  `;
  bindToolbar();
  if (categoryId === 'heroes') {
    const selectedHero = state.filters.hero || '';
    if (selectedHero) {
      const heroEntry = (state.catalog?.constants?.HERO_CATALOG || []).find((h) => h.slug === selectedHero || h.name === selectedHero);
      if (heroEntry) {
        const items = all.filter((m) => (m.hero || '').toLowerCase() === heroEntry.slug.toLowerCase());
        viewRoot.querySelectorAll('.hero-slot-card').forEach((card) => {
          card.addEventListener('click', () => {
            const slot = card.dataset.slot;
            const slotMods = items.filter((m) => (m.slot || 'default') === slot);
            openSlotModal(slot, slotMods, heroEntry.name, categoryId);
          });
        });
      }
      const backBtn = $('#heroBackBtn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          state.filters.hero = '';
          state.filters.heroSearch = '';
          renderCatalog();
        });
      }
    } else {
      viewRoot.querySelectorAll('.hero-card').forEach((card) => {
        card.addEventListener('click', () => {
          state.filters.hero = card.dataset.hero;
          renderCatalog();
        });
      });
    }
  } else {
    bindCards(viewRoot, mods);
  }
}

// --- hero slot modal ---

function closeSlotModals() {
  document.querySelectorAll('.slot-modal-overlay').forEach((overlay) => overlay.remove());
}

function openSlotModal(slot, mods, heroName, categoryId) {
  closeModal();
  closeSlotModals();
  const overlay = document.createElement('div');
  overlay.className = 'slot-modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2 class="modal-title">${esc(heroName)} — ${esc(translateSlot(slot))}</h2>
        <button class="modal-close" aria-label="${t('close')}"><span class="ms">close</span></button>
      </div>
      <div class="modal-body">
        <div class="grid" id="slotModsGrid">
          ${mods.map((m, i) => cardHtml({ ...m, _cat: categoryId }, i, false)).join('')}
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
  };
  document.addEventListener('keydown', onKey, true);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('.modal-close').addEventListener('click', close);
  bindCards(overlay.querySelector('#slotModsGrid'), mods.map((m) => ({ ...m, _cat: categoryId })));
}

// --- toolbar ---

const GROUP_LABEL = {
  ru: { 'hero-items': 'Все герои', 'item-effects': 'Все предметы', creeps: 'Все крипы', towers: 'Все башни', 'creep-deny': 'Все типы' },
  en: { 'hero-items': 'All heroes', 'item-effects': 'All items', creeps: 'All creeps', towers: 'All towers', 'creep-deny': 'All types' },
};

function toolbarHtml(resultCount, { tags = [], groups = [], heroes = [], categoryId = null }) {
  const f = state.filters;
  const isHeroes = categoryId === 'heroes';
  const toolbarParts = [];

  if (!isHeroes) {
    toolbarParts.push(`
      <div class="select-wrap">
        <span class="ms">sort</span>
        <select id="sortSelect">
          ${SORTS.map((s) => `<option value="${s.key}" ${f.sort === s.key ? 'selected' : ''}>${esc(trSortLabel(s.key))}</option>`).join('')}
        </select>
      </div>`);
  }

  if (isHeroes && !f.hero) {
    toolbarParts.push(`
      <div class="hero-search-wrap">
        <span class="ms">search</span>
        <input type="text" id="heroSearchInput" placeholder="${t('searchHeroes')}" value="${esc(f.heroSearch || '')}">
      </div>`);
  }

  if (!isHeroes && groups.length) {
    toolbarParts.push(`
      <div class="select-wrap">
        <span class="ms">${categoryId === 'hero-items' ? 'person' : catIcon(categoryId) || 'group'}</span>
        <select id="groupSelect">
          <option value="">${GROUP_LABEL[getLang()]?.[categoryId] || GROUP_LABEL.ru[categoryId] || (getLang() === 'en' ? 'All groups' : 'Все группы')}</option>
          ${groups.map((g) => `<option value="${esc(g)}" ${f.group === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}
        </select>
      </div>`);
  }

  if (!isHeroes) {
    toolbarParts.push(`<div class="sep"></div>`);
    toolbarParts.push(`
      <button class="fchip ${f.installedOnly ? 'active' : ''}" id="installedChip">
        <span class="ms">check_circle</span>${t('installed')}
      </button>`);
  }

  if (!isHeroes && tags.length) {
    toolbarParts.push(`<div class="sep"></div>`);
    toolbarParts.push(...tags.map(([tag, cnt]) => `
      <button class="fchip ${f.tags.has(tag) ? 'active' : ''}" data-tag="${esc(tag)}">
        ${esc(tagLabel(categoryId, tag))}<span style="opacity:.55">${cnt}</span>
      </button>`));
  }

  return `
    <div class="toolbar">
      ${toolbarParts.join('')}
      <span class="count">${resultCount} ${plural(resultCount, 'результат', 'результата', 'результатов', 'result', 'results')}</span>
    </div>`;
}

function bindToolbar() {
  $('#sortSelect')?.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    renderCatalog();
  });
  $('#groupSelect')?.addEventListener('change', (e) => {
    state.filters.group = e.target.value;
    renderCatalog();
  });
  $('#heroSelect')?.addEventListener('change', (e) => {
    state.filters.hero = e.target.value;
    renderCatalog();
  });
  let heroSearchTimer = null;
  const heroSearchInput = $('#heroSearchInput');
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      clearTimeout(heroSearchTimer);
      heroSearchTimer = setTimeout(() => {
        state.filters.heroSearch = e.target.value;
        renderCatalog();
      }, 180);
    });
    heroSearchInput.addEventListener('focus', () => {
      heroSearchInput.select();
    });
  }
  $('#installedChip')?.addEventListener('click', () => {
    state.filters.installedOnly = !state.filters.installedOnly;
    renderCatalog();
  });
  document.querySelectorAll('.fchip[data-tag]').forEach((c) => {
    c.addEventListener('click', () => {
      const t = c.dataset.tag;
      if (state.filters.tags.has(t)) state.filters.tags.delete(t);
      else state.filters.tags.add(t);
      renderCatalog();
    });
  });
}

// --- cards ---

function cardHtml(m, i, withCat = false) {
  const cat = m._cat;
  const previewCandidate = m.preview || m.imageUrl || m.thumbnail || (m.styles?.[0]?.preview);
  const prev = previewUrl(cat, previewCandidate);
  const installed = isInstalled(cat, m);
  const isPack = m.type === 'pack';
  const external = !installTarget(m) && !m.styles && !isPack;
  const tags = Object.entries(m.tags || {}).filter(([, v]) => v).map(([k]) => k).slice(0, 3);
  const author = (m.author || m.sender || '').trim();
  const hideAuthor = author && ['Unknown', 'Anonymous'].includes(author);
  const previewAction = resolvePreviewAction(cat, m);
  const authorProfile = (state.catalog?.constants?.AUTHOR_PROFILES || []).find((entry) => entry.displayName.toLowerCase() === author.toLowerCase() || entry.id.toLowerCase() === author.toLowerCase());
  const authorAvatar = authorProfile?.avatarUrl ? `<img class="author-chip-avatar" src="${esc(authorProfile.avatarUrl)}" alt="${esc(author)}">` : '<span class="ms">person</span>';
  return `
    <div class="card" data-key="${esc(keyOf(cat, m.name, null))}" style="--i:${Math.min(i, 28)}">
      <div class="card-media">
        ${mediaHtml(prev, { hoverPlay: true })}
        ${previewAction ? `<button class="card-preview-btn" data-play="${esc(previewAction.url)}" data-kind="${esc(previewAction.kind)}" data-title="${esc(m.name)}" aria-label="${t('preview')}"><span class="ms">visibility</span></button>` : ''}
        <div class="media-tags">
          ${installed ? `<span class="mtag ok">${t('installed')}</span>` : ''}
          ${isPack ? `<span class="mtag">${t('pack') || 'Pack'} · ${(m.mods || []).length}</span>` : ''}
          ${m._custom ? `<span class="mtag custom">${t('customPack')}</span>` : ''}
          ${external ? `<span class="mtag">${t('link') || 'Link'}</span>` : ''}
          ${tags.map((t) => `<span class="mtag">${esc(tagLabel(cat, t))}</span>`).join('')}
        </div>
        ${m.styles ? `
          <div class="media-swatches">
            ${m.styles.slice(0, 5).map((s) => `<span class="swatch-dot" style="background:${esc(s.color || '#a78bfa')}"></span>`).join('')}
          </div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${esc(m.name)}</div>
        <div class="card-meta">
          ${withCat ? '' : ''}
          ${getModDateValue(m) ? `<span>${fmtDate(getModDateValue(m))}</span>` : ''}
          ${author && !hideAuthor ? `<button class="author-chip ${authorProfile ? 'clickable' : ''}" data-author-id="${esc(authorProfile?.id || '')}" type="button">${authorAvatar}${esc(author)}</button>` : ''}
        </div>
      </div>
    </div>`;
}

function bindCards(root, modsList) {
  root.querySelectorAll('.card[data-key]').forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.dataset.key;
      // find the mod by key among provided list or global index
      let target = null;
      if (modsList) {
        target = modsList.find((m) => keyOf(m._cat, m.name, null) === key);
      }
      if (!target) {
        const [cat, name] = key.split('|');
        target = findModByName(cat, name);
      }
      if (target) openModModal(target._cat, target);
    });
    const v = card.querySelector('video[data-hoverplay]');
    if (v) {
      card.addEventListener('mouseenter', () => { v.play().catch(() => {}); });
      card.addEventListener('mouseleave', () => { v.pause(); });
    }
    const authorChip = card.querySelector('.author-chip.clickable');
    if (authorChip) {
      authorChip.addEventListener('click', (e) => {
        e.stopPropagation();
        const authorId = authorChip.dataset.authorId;
        if (authorId) {
          closeModal();
          closeSlotModals();
          state.authors = { selected: authorId };
          state.view = 'authors';
          render();
        }
      });
    }
    const previewBtn = card.querySelector('.card-preview-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPlayer({ kind: previewBtn.dataset.kind || 'media', url: previewBtn.dataset.play }, previewBtn.dataset.title);
      });
    }
  });
}

function findModByName(cat, name) {
  if (cat === 'packs') {
    const custom = customPacks().find((p) => p.name === name);
    if (custom) return { ...custom, _cat: 'packs' };
  }
  const hit = state.modIndex.get(name.toLowerCase());
  return hit ? { ...hit.mod, _cat: hit.categoryId } : null;
}

// ---------- mod modal ----------

let modalState = null;

function openModModal(categoryId, mod) {
  closeSlotModals();
  modalState = { categoryId, mod, styleIdx: 0 };
  drawModal();
  $('#modalOverlay').classList.remove('hidden');
}

function closeModal() {
  $('#modalOverlay').classList.add('hidden');
  $('#modalContent').innerHTML = '';
  modalState = null;
}

$('#modalOverlay').addEventListener('click', (e) => {
  if (e.target === $('#modalOverlay')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

const LINK_LABEL = {
  ru: { preview: 'Превью', source: 'Источник', author: 'Автор', bug: 'Баг', guide: 'Гайд' },
  en: { preview: 'Preview', source: 'Source', author: 'Author', bug: 'Bug', guide: 'Guide' },
};

function packMembers(mod) {
  return (mod.mods || []).map((name) => {
    const hit = state.modIndex.get(name.toLowerCase());
    return { name, hit };
  });
}

function openCatalogTarget(categoryId, heroSlug = '') {
  closeModal();
  closeSlotModals();
  state.activeCategory = categoryId;
  state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: heroSlug, heroSearch: '' };
  state.view = 'catalog';
  $('#main').scrollTop = 0;
  renderCatalog();
}

function drawModal() {
  const { categoryId, mod, styleIdx } = modalState;
  const styles = mod.styles || null;
  const cur = styles ? styles[styleIdx] : mod;
  const fileRef = styles ? cur.file : mod.file;
  const downloadTarget = resolveDownloadTarget(mod, styles ? cur : null);
  const target = downloadTarget && /\.(vpk|zip)$/i.test(downloadTarget) ? downloadTarget : null;
  const isPack = mod.type === 'pack';
  const styleLabel = styles ? cur.label : null;
  const installedRec = state.installedIndex.get(keyOf(categoryId, mod.name, styleLabel));
  const busy = state.installing.has(keyOf(categoryId, mod.name, styleLabel));
  const guide = mod.guideId && state.catalog?.guides?.[mod.guideId];

  const links = mod.links || [];
  const previewAction = resolvePreviewAction(categoryId, { ...mod, preview: cur.preview || mod.preview });
  const mediaUrl = previewUrl(categoryId, cur.preview || mod.preview);

  // author: mod.author/sender field, or an "author"-type link whose url is a name or URL
  const authorLink = links.find((l) => l.type === 'author');
  const authorName = mod.author || mod.sender ||
    (authorLink && !/^https?:\/\//i.test(authorLink.url) ? authorLink.url : null);
  const authorHref = (authorLink && /^https?:\/\//i.test(authorLink.url) ? authorLink.url : null) ||
    (authorName ? authorUrl(authorName) : null);
  const hideAuthor = authorName && ['Unknown', 'Anonymous'].includes(authorName);
  const authorProfile = (state.catalog?.constants?.AUTHOR_PROFILES || []).find((entry) => entry.displayName.toLowerCase() === authorName?.toLowerCase() || entry.id.toLowerCase() === authorName?.toLowerCase());
  const authorAvatar = authorProfile?.avatarUrl ? `<img class="author-chip-avatar" src="${esc(authorProfile.avatarUrl)}" alt="${esc(authorName)}">` : '<span class="ms">person</span>';

  const otherLinks = links.filter((l) => !(l.type === 'preview' && isMedia(l.url)) && l.type !== 'author');
  const heroSlug = (mod.hero || '').toString().trim();
  const heroEntry = heroSlug ? (state.catalog?.constants?.HERO_CATALOG || []).find((entry) => {
    const slug = (entry.slug || entry.id || '').toString().toLowerCase();
    return slug === heroSlug.toLowerCase() || (entry.name || '').toLowerCase() === heroSlug.toLowerCase();
  }) : null;
  const heroLabel = heroEntry?.name || (heroSlug ? heroSlug.replace(/_/g, ' ') : '');

  // pack contents (with per-session exclusions)
  if (isPack && !modalState.packExcluded) modalState.packExcluded = new Set();
  const members = isPack ? packMembers(mod) : [];
  const activeCount = isPack ? members.filter((x) => !modalState.packExcluded.has(x.name)).length : 0;

  $('#modalContent').innerHTML = `
    <div class="modal-media">
      ${mediaHtml(mediaUrl, { autoplay: true })}
      <button class="modal-close" id="modalCloseBtn" aria-label="Закрыть"><span class="ms">close</span></button>
      ${previewAction ? `
        <button class="preview-toggle" id="previewPlayBtn">
          <span class="ms">play_circle</span>${t('preview')}
        </button>` : ''}
    </div>
    <div class="modal-body">
      <div class="modal-title-row">
        <div class="modal-title">${esc(mod.name)}</div>
      </div>
      <div class="modal-sub">
        <button class="modal-meta-chip" id="modalCategoryBtn" type="button">${esc(catName(categoryId))}</button>
        ${heroLabel ? `<button class="modal-meta-chip" id="modalHeroBtn" type="button"><span class="ms">person</span>${esc(heroLabel)}</button>` : ''}
        ${mod._group ? `<span>· ${esc(mod._group)}</span>` : ''}
        ${mod._custom ? `<span>· ${t('customPack')}</span>` : ''}
        ${getModDateValue(mod) ? `<span>· ${fmtDate(getModDateValue(mod))}</span>` : ''}
        ${authorName && !hideAuthor ? `
          <button class="author-chip ${authorProfile ? 'clickable' : ''}" id="authorChip" ${authorProfile ? '' : 'disabled'} data-author-id="${esc(authorProfile?.id || '')}">
            ${authorAvatar}${esc(authorName)}${authorProfile ? '<span class="ms" style="font-size:11px">open_in_new</span>' : ''}
          </button>` : ''}
      </div>
      ${styles ? `
        <div class="style-row">
          ${styles.map((s, i) => `
            <button class="style-btn ${i === styleIdx ? 'active' : ''}" data-style="${i}">
              ${s.color ? `<span class="swatch" style="background:${esc(s.color)}"></span>` : ''}${esc(s.label)}
            </button>`).join('')}
        </div>` : ''}
      ${isPack ? `
        <div class="pack-list">
          ${members.map((x) => {
            const excluded = modalState.packExcluded.has(x.name);
            const thumb = x.hit ? previewUrl(x.hit.categoryId, x.hit.mod.preview || x.hit.mod.styles?.[0]?.preview) : null;
            const inst = x.hit && isInstalled(x.hit.categoryId, x.hit.mod);
            return `
            <div class="pack-row ${excluded ? 'excluded' : ''} ${x.hit ? '' : 'missing'}" data-member="${esc(x.name)}">
              ${thumb && !isVideo(thumb) ? `<img class="pack-thumb" src="${esc(thumb)}" loading="lazy" alt="">` : '<div class="pack-thumb"></div>'}
              <div class="pack-info">
                <div class="pack-mod-name">${esc(x.name)}</div>
                <div class="pack-mod-cat">${x.hit ? esc(catName(x.hit.categoryId)) : t('notFoundInCatalog')}${inst ? ` · ${t('installed')}` : ''}</div>
              </div>
              <button class="pack-x" data-toggle="${esc(x.name)}" aria-label="${excluded ? t('restore') : t('removeFromPack')}">
                <span class="ms">${excluded ? 'add' : 'close'}</span>
              </button>
            </div>`;
          }).join('')}
        </div>
        <div class="pack-save-row">
          <input class="input" id="packSaveName" placeholder="${t('packNameHint')}" value="${mod._custom ? esc(mod.name) : ''}">
          <button class="btn btn-sm" id="packSaveBtn"><span class="ms">bookmark_add</span>${t('savePack')}</button>
          ${mod._custom ? `<button class="btn btn-sm btn-danger" id="packDeleteBtn">${t('deletePack')}</button>` : ''}
        </div>` : ''}
      <div class="modal-actions">
        ${isPack ? `<button class="btn btn-primary" id="installPackBtn" ${activeCount ? '' : 'disabled'}><span class="ms">download</span>${t('install')} (${activeCount})</button>` : ''}
        ${!isPack && target ? (installedRec
          ? `<button class="btn btn-danger" id="uninstallBtn"><span class="ms">delete</span>${t('uninstall')}</button>`
          : `<button class="btn btn-primary" id="installBtn" ${busy ? 'disabled' : ''}><span class="ms">download</span>${busy ? t('installing') : t('install')}</button>`) : ''}
        ${!isPack && !target && downloadTarget ? `<button class="btn" id="openLinkBtn"><span class="ms">open_in_new</span>${t('openLink')}</button>` : ''}
      </div>
      ${otherLinks.length ? `
        <div class="modal-links">
          ${otherLinks.map((l) => `<a data-link="${links.indexOf(l)}">${esc(LINK_LABEL[getLang()]?.[l.type] || LINK_LABEL.ru?.[l.type] || l.type || (getLang() === 'en' ? 'link' : 'ссылка'))}</a>`).join('')}
        </div>` : ''}
      ${categoryId === 'fonts' ? `<div class="modal-note">${t('installNoteFonts')}</div>` : ''}
      ${categoryId === 'cursors' ? `<div class="modal-note">${t('installNoteCursors')}</div>` : ''}
    </div>
  `;

  $('#modalCloseBtn').addEventListener('click', closeModal);

  const categoryBtn = $('#modalCategoryBtn');
  if (categoryBtn) {
    categoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCatalogTarget(categoryId);
    });
  }
  const heroBtn = $('#modalHeroBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCatalogTarget('heroes', heroSlug);
    });
  }

  const previewPlay = $('#previewPlayBtn');
  if (previewPlay) {
    previewPlay.addEventListener('click', () => openPlayer(previewAction, mod.name));
  }

  const authorChip = $('#authorChip');
  if (authorChip) {
    authorChip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (authorChip.dataset.authorId) {
        closeModal();
        closeSlotModals();
        state.authors = { selected: authorChip.dataset.authorId };
        state.view = 'authors';
        render();
      } else if (authorHref) {
        window.api.misc.openExternal(authorHref);
      }
    });
  }

  // pack interactions
  document.querySelectorAll('.pack-x').forEach((b) => {
    b.addEventListener('click', () => {
      const n = b.dataset.toggle;
      if (modalState.packExcluded.has(n)) modalState.packExcluded.delete(n);
      else modalState.packExcluded.add(n);
      drawModal();
    });
  });
  const packSaveBtn = $('#packSaveBtn');
  if (packSaveBtn) {
    packSaveBtn.addEventListener('click', () => {
      const name = $('#packSaveName').value.trim();
      if (!name) { toast(t('enterPackName'), 'warn'); return; }
      const modNames = members.filter((x) => !modalState.packExcluded.has(x.name)).map((x) => x.name);
      if (!modNames.length) { toast(t('packEmpty'), 'warn'); return; }
      const packs = customPacks().filter((p) => p.name !== name && p.name !== (mod._custom ? mod.name : null));
      packs.push({ name, mods: modNames });
      saveCustomPacks(packs);
      toast(`${t('packSaved')}: ${name}`);
      if (state.view === 'catalog' && state.activeCategory === 'packs') { closeModal(); renderCatalog(); }
    });
  }
  const packDeleteBtn = $('#packDeleteBtn');
  if (packDeleteBtn) {
    packDeleteBtn.addEventListener('click', async () => {
      if (!await confirmDialog(`${t('delete')} «${mod.name}»?`)) return;
      saveCustomPacks(customPacks().filter((p) => p.name !== mod.name));
      closeModal();
      renderCatalog();
    });
  }

  document.querySelectorAll('.style-btn').forEach((b) => {
    b.addEventListener('click', () => {
      modalState.styleIdx = Number(b.dataset.style);
      drawModal();
    });
  });

  const installBtn = $('#installBtn');
  if (installBtn) {
    installBtn.addEventListener('click', () => doInstall(categoryId, mod, styleLabel, fileRef, cur.preview || mod.preview));
  }
  const uninstallBtn = $('#uninstallBtn');
  if (uninstallBtn) {
    uninstallBtn.addEventListener('click', async () => {
      if (!await confirmDialog(`${t('delete')} «${mod.name}»?`)) return;
      const r = await window.api.mods.remove(installedRec.id);
      if (r.error) toast(r.error, 'error');
      else toast(`${mod.name} ${t('removed')}`);
      await refreshInstalledIndex();
      drawModal();
    });
  }
  const packBtn = $('#installPackBtn');
  if (packBtn) packBtn.addEventListener('click', () => installPack(mod));
  const openLinkBtn = $('#openLinkBtn');
  if (openLinkBtn) openLinkBtn.addEventListener('click', () => window.api.misc.openExternal(downloadTarget));
  const guideLink = $('#modalGuideLink');
  if (guideLink) {
    guideLink.remove();
  }
  otherLinks.forEach((l) => {
    const a = document.querySelector(`[data-link="${links.indexOf(l)}"]`);
    if (a) a.addEventListener('click', () => {
      const u = resolveUrl(l.url);
      if (u) window.api.misc.openExternal(u);
    });
  });
}

async function doInstall(categoryId, mod, styleLabel, fileRef, preview) {
  const k = keyOf(categoryId, mod.name, styleLabel);
  if (state.installing.has(k)) return;
  if (!state.settings?.dotaPathValid && categoryId !== 'tools') {
    toast(t('dotaNotFound'), 'warn');
    return;
  }
  state.installing.add(k);
  if (modalState) drawModal();
  const installTarget = resolveDownloadTarget(mod, styleLabel ? mod.styles?.find((s) => s.label === styleLabel) : null) || fileRef;
  const r = await window.api.mods.install({ categoryId, name: mod.name, styleLabel, fileRef: installTarget, preview });
  state.installing.delete(k);
  if (r.error && !r.already) toast(`${mod.name}: ${r.error}`, 'error', 6000);
  else if (!r.error) toast(`${mod.name} ${t('installed').toLowerCase()}`);
  await refreshInstalledIndex();
  if (modalState) drawModal();
  return r;
}

async function installPack(pack) {
  const excluded = modalState?.packExcluded || new Set();
  const names = (pack.mods || []).filter((n) => !excluded.has(n));
  closeModal();
  let ok = 0, fail = 0, skip = 0;
  for (const name of names) {
    const hit = state.modIndex.get(name.toLowerCase());
    if (!hit) { skip++; continue; }
    const { categoryId, mod } = hit;
    const fileRef = resolveDownloadTarget(mod, mod.styles?.[0]) || mod.file || mod.styles?.[0]?.file;
    const styleLabel = mod.file ? null : mod.styles?.[0]?.label || null;
    if (!fileRef || !/\.(vpk|zip)$/i.test(fileRef)) { skip++; continue; }
    if (state.installedIndex.has(keyOf(categoryId, mod.name, styleLabel))) { skip++; continue; }
    const r = await doInstall(categoryId, mod, styleLabel, fileRef, mod.preview);
    if (r?.ok) ok++; else fail++;
  }
  const summary = t('packInstallSummary').replace('{name}', pack.name).replace('{ok}', ok).replace('{skip}', skip) + (fail ? t('packInstallErrors').replace('{count}', fail) : '');
  toast(summary, fail ? 'warn' : 'ok', 7000);
  await refreshInstalledIndex();
  render();
}

// ===== Library =====

async function renderLibrary() {
  const { installed, external } = await window.api.mods.list();
  const enabledCount = installed.filter((m) => m.enabled).length;

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${t('library')}</h1>
    </div>
    <div class="lib-toolbar">
      <input class="input lib-search" id="librarySearchInput" placeholder="${t('searchHeroes')}" value="${esc(state.librarySearch || '')}">
      <span class="lib-stats">${installed.length} ${plural(installed.length, 'мод', 'мода', 'модов', 'mod', 'mods')} · ${enabledCount} ${getLang() === 'en' ? 'enabled' : 'включено'}</span>
      <button class="btn btn-sm" id="enableAllBtn">${t('enableAll')}</button>
      <button class="btn btn-sm" id="disableAllBtn">${t('disableAll')}</button>
      <button class="btn btn-sm btn-danger" id="removeAllModsBtn">${t('removeAllMods')}</button>
      <button class="btn btn-sm" id="openFolderBtn2"><span class="ms">folder_open</span>${t('openModsFolder')}</button>
    </div>
    <div class="lib-list" id="libList"></div>
    ${external.length ? `
      <div class="section-h" style="margin-top:26px"><span class="ms">folder_zip</span>${t('externalFiles')}</div>
      <div style="color:var(--text-muted);font-size:12.5px;margin-bottom:10px">${t('externalFilesNote')}</div>
      <div class="lib-list" id="extList"></div>` : ''}
  `;

  function updateLibraryList() {
    const filteredInstalled = installed.filter((rec) => rec.name.toLowerCase().includes((state.librarySearch || '').trim().toLowerCase()));
    const libList = $('#libList');
    libList.innerHTML = '';

    if (!filteredInstalled.length) {
      libList.innerHTML = `<div class="empty-note">${t('emptyLibrary')}</div>`;
      return;
    }

    filteredInstalled.forEach((rec, i) => {
      const row = document.createElement('div');
      row.className = `lib-row ${rec.enabled ? '' : 'disabled'}`;
      row.style.setProperty('--i', Math.min(i, 20));
      const prev = previewUrl(rec.categoryId, rec.preview);
      const fileNames = rec.files.filter((f) => f.root === 'lang').map((f) => f.relPath);
      row.innerHTML = `
        ${prev && !isVideo(prev) ? `<img class="lib-thumb" src="${esc(prev)}" loading="lazy" alt="">` : `<div class="lib-thumb"></div>`}
        <div class="lib-info">
          <div class="lib-name">${esc(rec.name)}${rec.styleLabel ? ` <span style="color:var(--primary-soft);font-size:12px">(${esc(rec.styleLabel)})</span>` : ''}</div>
          <div class="lib-meta">
            <span>${esc(catName(rec.categoryId))}</span>
            ${fileNames.length ? `<span>${esc(fileNames.slice(0, 3).join(', '))}${fileNames.length > 3 ? '…' : ''}</span>` : ''}
            <span>${new Date(rec.installedAt).toLocaleDateString(getLang() === 'en' ? 'en-US' : 'ru')}</span>
          </div>
        </div>
        <div class="lib-actions">
          ${['fonts', 'cursors'].includes(rec.categoryId)
            ? `<span style="font-size:11.5px;color:var(--text-muted)">${t('alwaysActive')}</span>`
            : `<button class="toggle ${rec.enabled ? 'on' : ''}" data-id="${rec.id}" role="switch" aria-checked="${rec.enabled}" aria-label="${t('installed')}"></button>`}
          <button class="btn btn-sm btn-danger" data-del="${rec.id}">${t('delete')}</button>
        </div>
      `;

      row.querySelectorAll('.toggle').forEach((t) => {
        t.addEventListener('click', async () => {
          const rec = installed.find((m) => m.id === t.dataset.id);
          const r = await window.api.mods.setEnabled(rec.id, !rec.enabled);
          if (r.error) toast(r.error, 'error');
          renderLibrary();
          refreshInstalledIndex();
        });
      });

      row.querySelectorAll('[data-del]').forEach((b) => {
        b.addEventListener('click', async () => {
          const rec = installed.find((m) => m.id === b.dataset.del);
          if (!await confirmDialog(t('removeConfirm').replace('{name}', rec.name))) return;
          const r = await window.api.mods.remove(rec.id);
          if (r.error) toast(r.error, 'error');
          else toast(`${rec.name} ${t('removed')}`);
          renderLibrary();
          refreshInstalledIndex();
        });
      });

      libList.appendChild(row);
    });
  }

  updateLibraryList();

  $('#librarySearchInput')?.addEventListener('input', (e) => {
    state.librarySearch = e.target.value;
    updateLibraryList();
  });
  $('#enableAllBtn').addEventListener('click', () => bulkToggle(installed, true));
  $('#disableAllBtn').addEventListener('click', () => bulkToggle(installed, false));
  const removeAllBtn = $('#removeAllModsBtn');
  removeAllBtn.disabled = !installed.length;
  removeAllBtn.addEventListener('click', async () => {
    if (!installed.length) return;
    if (!await confirmDialog(t('removeAllConfirm'), { okLabel: t('removeAllMods') })) return;
    let removed = 0;
    let failed = 0;
    for (const rec of installed) {
      const r = await window.api.mods.remove(rec.id);
      if (r?.error) failed += 1;
      else removed += 1;
    }
    if (failed) toast(t('removeAllResult').replace('{removed}', removed).replace('{failed}', failed), 'warn');
    else toast(t('removeAllDone').replace('{count}', removed), 'ok');
    renderLibrary();
    refreshInstalledIndex();
  });
  $('#openFolderBtn2').addEventListener('click', () => window.api.misc.openLangFolder());

  if (external.length) {
    const extList = $('#extList');
    for (const f of external) {
      const row = document.createElement('div');
      row.className = `lib-row ${f.enabled ? '' : 'disabled'}`;
      row.innerHTML = `
        <div class="lib-thumb"></div>
        <div class="lib-info">
          <div class="lib-name">${esc(f.name)}</div>
          <div class="lib-meta"><span>${fmtMB(f.size)} MB</span><span>${t('externalFile')}</span></div>
        </div>
        <div class="lib-actions">
          <button class="toggle ${f.enabled ? 'on' : ''}" data-ext="${esc(f.name)}" role="switch" aria-checked="${f.enabled}"></button>
          <button class="btn btn-sm btn-danger" data-extdel="${esc(f.name)}">${t('delete')}</button>
        </div>
      `;
      extList.appendChild(row);
    }
    extList.querySelectorAll('.toggle').forEach((t) => {
      t.addEventListener('click', async () => {
        const f = external.find((x) => x.name === t.dataset.ext);
        await window.api.mods.externalSetEnabled(f.name, !f.enabled);
        renderLibrary();
      });
    });
    extList.querySelectorAll('[data-extdel]').forEach((b) => {
      b.addEventListener('click', async () => {
        if (!await confirmDialog(t('removeFileConfirm').replace('{name}', b.dataset.extdel))) return;
        await window.api.mods.externalRemove(b.dataset.extdel);
        renderLibrary();
      });
    });
  }
}

async function bulkToggle(installed, enabled) {
  for (const rec of installed) {
    if (['fonts', 'cursors'].includes(rec.categoryId)) continue;
    if (rec.enabled !== enabled) await window.api.mods.setEnabled(rec.id, enabled);
  }
  renderLibrary();
  refreshInstalledIndex();
}

// ===== Presets =====

async function renderPresets() {
  const presets = await window.api.presets.list();
  const { installed } = await window.api.mods.list();
  const byId = new Map(installed.map((m) => [m.id, m]));

  viewRoot.innerHTML = `
    <div class="view-header"><h1 class="view-title">${t('presetsTitle')}</h1></div>
    <div style="color:var(--text-muted);font-size:13px;margin-bottom:14px">
      ${t('presetDescription')}
    </div>
    <div class="preset-new">
      <input class="input" id="presetName" placeholder="${t('presetNamePlaceholder')}">
      <button class="btn btn-primary" id="savePresetBtn"><span class="ms">save</span>${t('savePreset')}</button>
    </div>
    <div id="presetList">
      ${presets.length ? '' : `<div class="empty-note">${t('presetEmpty')}</div>`}
    </div>
  `;

  const list = $('#presetList');
  presets.forEach((p, i) => {
    const names = p.modIds.map((id) => byId.get(id)?.name).filter(Boolean);
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.style.setProperty('--i', i);
    card.innerHTML = `
      <div class="preset-head">
        <div class="preset-name">${esc(p.name)}</div>
        <span style="font-size:12px;color:var(--text-muted)">${names.length} ${plural(names.length, 'мод', 'мода', 'модов', 'mod', 'mods')}</span>
        <button class="btn btn-sm btn-primary" data-apply="${p.id}">${t('apply')}</button>
        <button class="btn btn-sm btn-danger" data-pdel="${p.id}">${t('delete')}</button>
      </div>
      <div class="preset-mods">${names.length ? esc(names.join(' · ')) : t('emptyPreset')}</div>
    `;
    list.appendChild(card);
  });

  $('#savePresetBtn').addEventListener('click', async () => {
    const name = $('#presetName').value.trim();
    if (!name) { toast(t('enterPackName'), 'warn'); return; }
    await window.api.presets.save(name);
    toast(`${t('presetsTitle')} «${name}» ${t('save')?.toLowerCase() || 'saved'}`);
    renderPresets();
  });

  list.querySelectorAll('[data-apply]').forEach((b) => {
    b.addEventListener('click', async () => {
      const r = await window.api.presets.apply(b.dataset.apply);
      if (r.error) toast(r.error, 'error', 6000);
      else toast(`${t('presetsTitle')} ${t('apply').toLowerCase()} ${t('ready')}`);
      refreshInstalledIndex();
    });
  });
  list.querySelectorAll('[data-pdel]').forEach((b) => {
    b.addEventListener('click', async () => {
      const p = presets.find((x) => x.id === b.dataset.pdel);
      if (!await confirmDialog(t('removePresetConfirm').replace('{name}', p?.name || ''))) return;
      await window.api.presets.delete(b.dataset.pdel);
      renderPresets();
    });
  });
}

// ===== Authors =====

function collectAuthors() {
  const mods = Object.values(state.catalog?.mods?.modsData || {})
    .flatMap((entry) => Array.isArray(entry) ? entry : (entry?.groups ? [] : []))
    .filter(Boolean);

  const allMods = [];
  for (const category of Object.values(state.catalog?.mods?.modsData || {})) {
    if (Array.isArray(category)) {
      allMods.push(...category);
    }
  }

  const authors = new Map();
  for (const mod of allMods) {
    const author = (mod.author || mod.authorName || '').toString().trim();
    if (!author) continue;
    const key = author.toLowerCase();
    if (!authors.has(key)) authors.set(key, { name: author, count: 0 });
    authors.get(key).count += 1;
  }

  return [...authors.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function getAuthorVisibleMods(author) {
  const mods = [...(author.mods || [])];
  const search = (state.authors?.search || '').trim().toLowerCase();
  const sort = state.authors?.sort || 'default';

  const filtered = search
    ? mods.filter((mod) => (mod.name || '').toLowerCase().includes(search))
    : mods;

  const withDate = filtered.map((mod) => ({
    ...mod,
    _dateValue: (() => {
      const raw = getModDateValue(mod);
      if (!raw) return null;
      const parsed = parseDateValue(raw);
      return parsed ? parsed / 1000 : null;
    })(),
  }));

  if (sort === 'date') {
    withDate.sort((a, b) => {
      const aDate = a._dateValue ?? 0;
      const bDate = b._dateValue ?? 0;
      return bDate - aDate;
    });
  } else if (sort === 'date-asc') {
    withDate.sort((a, b) => {
      const aDate = a._dateValue ?? 0;
      const bDate = b._dateValue ?? 0;
      return aDate - bDate;
    });
  } else if (sort === 'name') {
    withDate.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ru', { sensitivity: 'base' }));
  } else if (sort === 'name-desc') {
    withDate.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'ru', { sensitivity: 'base' }));
  }

  return withDate.map(({ _dateValue, ...mod }) => mod);
}

function getAuthorModsFromCatalog(author) {
  const authorKey = (author.displayName || author.id || '').toString().trim().toLowerCase();
  if (!authorKey) return [];
  const result = [];
  for (const categoryData of Object.values(state.catalog?.mods?.modsData || {})) {
    const mods = Array.isArray(categoryData)
      ? categoryData
      : (categoryData.groups ? categoryData.groups.flatMap((g) => g.mods || []) : []);
    for (const mod of mods) {
      const modAuthor = ((mod.author || mod.sender || mod.authorName || '').toString().trim()).toLowerCase();
      if (modAuthor === authorKey) {
        result.push({ ...mod, categoryId: mod.categoryId || mod.category || 'other' });
      }
    }
  }
  return result;
}

function renderAuthorMods(author) {
  const modsFromProfile = getAuthorVisibleMods(author);
  const fallbackMods = getAuthorModsFromCatalog(author);
  const merged = [...new Map(
    [...modsFromProfile, ...fallbackMods].map((m) => [keyOf(m.categoryId || 'other', m.name, null), m])
  ).values()];
  const grid = $('#authorModsGrid');
  const meta = $('.author-profile-meta');
  if (meta) {
    meta.textContent = `${merged.length} ${plural(merged.length, 'мод', 'мода', 'модов', 'mod', 'mods')}`;
  }
  if (!grid) return;
  grid.innerHTML = merged.length
    ? merged.map((m, i) => cardHtml({ ...m, _cat: m.categoryId || 'other' }, i, true)).join('')
    : `<div class="empty-note">${t('noAuthorMods')}</div>`;
  bindCards(viewRoot, merged.map((m) => ({ ...m, _cat: m.categoryId || 'other' })));
}

function renderAuthors() {
  const authors = state.catalog?.constants?.AUTHOR_PROFILES || [];
  const selectedAuthor = state.authors?.selected || null;

  function countAuthorMods(author) {
    const profileMods = author.mods || [];
    const catalogMods = getAuthorModsFromCatalog(author);
    return [...new Map(
      [...profileMods, ...catalogMods].map((m) => [keyOf(m.categoryId || m.category || 'other', m.name, null), m])
    ).values()].length;
  }

  if (selectedAuthor) {
    const author = authors.find((entry) => entry.id === selectedAuthor) || null;
    if (!author) {
      state.authors = { selected: null, search: '', sort: 'default' };
      return renderAuthors();
    }

    viewRoot.innerHTML = `
      <div class="view-header">
        <button class="btn btn-ghost" id="authorBackBtn"><span class="ms">arrow_back</span>${t('backToAuthors')}</button>
      </div>
      <div class="author-profile">
        <div class="author-profile-card">
          <div class="author-profile-avatar">${author.avatarUrl ? `<img src="${esc(author.avatarUrl)}" alt="${esc(author.displayName)}">` : '<span class="ms">person</span>'}</div>
          <div class="author-profile-info">
            <h1 class="view-title">${esc(author.displayName)}</h1>
            <div class="author-profile-meta"></div>
            <div class="author-links">
              ${Object.entries(author.links || {}).filter(([, url]) => url).map(([type, url]) => `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(type)}</a>`).join('')}
              ${author.authorLink ? `<a href="${esc(author.authorLink)}" target="_blank" rel="noreferrer">${t('authorSite')}</a>` : ''}
            </div>
          </div>
        </div>
        <div class="author-profile-tools">
          <label class="author-profile-search" for="authorSearchInput">
            <span class="ms">search</span>
            <input class="input" id="authorSearchInput" placeholder="${t('authorSearchPlaceholder')}" value="${esc(state.authors?.search || '')}">
          </label>
          <select class="input" id="authorSortSelect">
            <option value="default" ${state.authors?.sort === 'default' ? 'selected' : ''}>${getLang() === 'en' ? 'Default' : 'По умолчанию'}</option>
            <option value="date" ${state.authors?.sort === 'date' ? 'selected' : ''}>${getLang() === 'en' ? 'Newest first' : 'По дате новее'}</option>
            <option value="date-asc" ${state.authors?.sort === 'date-asc' ? 'selected' : ''}>${getLang() === 'en' ? 'Oldest first' : 'По дате старше'}</option>
            <option value="name" ${state.authors?.sort === 'name' ? 'selected' : ''}>${getLang() === 'en' ? 'Name A-Z' : 'По названию от А-Я'}</option>
            <option value="name-desc" ${state.authors?.sort === 'name-desc' ? 'selected' : ''}>${getLang() === 'en' ? 'Name Z-A' : 'По названию от Я-А'}</option>
          </select>
        </div>
        <div class="grid" id="authorModsGrid"></div>
      </div>
    `;

    $('#authorBackBtn')?.addEventListener('click', () => {
      state.authors = { selected: null, search: '', sort: 'default' };
      renderAuthors();
    });
    $('#authorSearchInput')?.addEventListener('input', (e) => {
      state.authors = { ...state.authors, search: e.target.value };
      renderAuthorMods(author);
    });
    $('#authorSortSelect')?.addEventListener('change', (e) => {
      state.authors = { ...state.authors, sort: e.target.value };
      renderAuthorMods(author);
    });
    renderAuthorMods(author);
    return;
  }

  viewRoot.innerHTML = `
    <div class="view-header"><h1 class="view-title">${t('authorsTitle')}</h1></div>
    ${authors.length ? `
      <div class="tool-grid">
        ${authors.map((author, i) => {
          const count = countAuthorMods(author);
          return `
          <div class="tool-card author-card" style="--i:${i}" data-author-id="${esc(author.id)}">
            <div class="author-card-avatar">${author.avatarUrl ? `<img src="${esc(author.avatarUrl)}" alt="${esc(author.displayName)}">` : '<span class="ms">person</span>'}</div>
            <div class="tool-name">${esc(author.displayName)}</div>
            <div style="color:var(--text-muted);font-size:12px">${count} ${plural(count, 'мод', 'мода', 'модов', 'mod', 'mods')}</div>
          </div>`;
        }).join('')}
      </div>` : `<div class="empty-note">${t('noAuthorsFound')}</div>`}
  `;

  viewRoot.querySelectorAll('.author-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.authors = { selected: card.dataset.authorId, search: '', sort: 'default' };
      renderAuthors();
    });
  });
}

// ===== Tools =====

async function renderTools() {
  const tools = state.catalog?.mods?.modsData?.tools || [];
  const { installed } = await window.api.mods.list();
  const toolRecs = new Map(installed.filter((m) => m.categoryId === 'tools').map((m) => [m.name, m]));

  viewRoot.innerHTML = `
    <div class="view-header"><h1 class="view-title">${t('tools')}</h1></div>
    <div class="tool-grid">
      ${tools.map((t, i) => {
        const dl = t.file && /\.(zip|exe)$/i.test(t.file);
        const rec = toolRecs.get(t.name);
        return `
        <div class="tool-card" style="--i:${i}">
          <div class="tool-name">${esc(t.name)}</div>
          <div class="tool-actions">
            ${dl ? (rec
              ? `<button class="btn btn-sm btn-primary" data-run="${esc(rec.files[0]?.relPath || '')}"><span class="ms">play_arrow</span>${t('run')}</button>
                 <button class="btn btn-sm" data-open="${esc(rec.files[0]?.relPath || '')}">${t('folder')}</button>
                 <button class="btn btn-sm btn-danger" data-tdel="${rec.id}">${t('delete')}</button>`
              : `<button class="btn btn-sm btn-primary" data-get="${i}"><span class="ms">download</span>${t('download')}</button>`)
              : (t.file ? `<button class="btn btn-sm" data-url="${esc(t.file)}"><span class="ms">open_in_new</span>${t('openSite')}</button>` : '')}
            ${t.guideId && state.catalog?.guides?.[t.guideId] ? `<button class="btn btn-sm btn-ghost" data-guide="${esc(t.guideId)}">${t('guide')}</button>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  viewRoot.querySelectorAll('[data-get]').forEach((b) => {
    b.addEventListener('click', async () => {
      const t = tools[Number(b.dataset.get)];
      b.disabled = true;
      b.textContent = t('downloading');
      const r = await window.api.mods.install({ categoryId: 'tools', name: t.name, styleLabel: null, fileRef: t.file, preview: t.preview });
      if (r.error && !r.already) toast(`${t.name}: ${r.error}`, 'error', 6000);
      else toast(`${t.name} ${t('ready')}`);
      renderTools();
    });
  });
  viewRoot.querySelectorAll('[data-run]').forEach((b) => {
    b.addEventListener('click', async () => {
      const r = await window.api.misc.runTool(b.dataset.run);
      if (r.error) toast(r.error, 'error');
    });
  });
  viewRoot.querySelectorAll('[data-open]').forEach((b) => {
    b.addEventListener('click', () => window.api.misc.openToolsFolder(b.dataset.open));
  });
  viewRoot.querySelectorAll('[data-tdel]').forEach((b) => {
    b.addEventListener('click', async () => {
      await window.api.mods.remove(b.dataset.tdel);
      renderTools();
    });
  });
  viewRoot.querySelectorAll('[data-url]').forEach((b) => {
    b.addEventListener('click', () => window.api.misc.openExternal(b.dataset.url));
  });
}

// ===== Guides =====

function renderGuideSteps(steps) {
  let html = '<ol>';
  for (const s of steps) {
    if (typeof s === 'string') {
      html += `<li>${s}</li>`; // guide content is trusted repo HTML (code/spans)
    } else if (s && s.text) {
      html += `</ol><div class="g-info ${s.icon === 'error' || s.icon === 'warning' ? 'g-warn' : ''}">${s.text}</div><ol>`;
    }
  }
  html += '</ol>';
  return html.replace(/<ol><\/ol>/g, '');
}

function renderGuides() {
  const guides = state.catalog?.guides || {};
  viewRoot.innerHTML = `
    <div class="view-header"><h1 class="view-title">${t('guides')}</h1></div>
    <div style="color:var(--text-muted);font-size:13px;margin-bottom:16px">
      ${getLang() === 'en' ? 'Guides from the Dota2PornFx repository. The manager automates most steps — guides are useful for manual install and troubleshooting.' : 'Гайды из репозитория Dota2PornFx. Менеджер делает бóльшую часть шагов автоматически — гайды пригодятся для ручной установки и решения проблем.'}
    </div>
    ${Object.entries(guides).map(([id, g]) => {
      const content = g.content?.ru || g.content?.en || [];
      return `
      <div class="guide-card" data-guide="${esc(id)}">
        <div class="guide-title">
          <span class="ms chev">chevron_right</span>
          ${esc(g.title)}
        </div>
        <div class="guide-body">
          ${content.map((block) => `
            ${block.info && block.infoPosition !== 'bottom' ? `<div class="g-info">${block.info}</div>` : ''}
            ${block.steps ? renderGuideSteps(block.steps) : ''}
            ${block.warning ? `<div class="g-info g-warn">${block.warning}</div>` : ''}
            ${block.info && block.infoPosition === 'bottom' ? `<div class="g-info">${block.info}</div>` : ''}
          `).join('')}
        </div>
      </div>`;
    }).join('')}
  `;

  viewRoot.querySelectorAll('.guide-title').forEach((t) => {
    t.addEventListener('click', () => t.closest('.guide-card').classList.toggle('open'));
  });
  viewRoot.querySelectorAll('.guide-body a[href]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.api.misc.openExternal(a.href);
    });
  });
}

// ===== About =====

async function renderAbout() {
  const appVersion = await window.api.update.version();

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${t('about')}</h1>
    </div>

    <div class="settings-block about-hero">
      <div class="about-hero-head">
        <div class="about-hero-badge">Dota2skins Manager</div>
        <span class="about-hero-version">v${esc(appVersion)}</span>
      </div>
      <p>${t('aboutHeroIntro')}</p>
      <p>${t('aboutHeroBody')}</p>
    </div>

    <div class="settings-block" style="animation-delay:60ms">
      <h3>${t('community')}</h3>
      <div class="about-community-grid">
        <a class="about-community-card about-community-card--discord" href="https://discord.gg/UfNeE4Dy36" target="_blank" rel="noopener noreferrer">
          <div class="about-community-icon">D</div>
          <div class="about-community-copy">
            <div class="about-community-title">${t('discordTitle')}</div>
            <div class="about-community-desc">${t('discordDesc')}</div>
          </div>
          <span class="about-community-action">${t('discordAction')}</span>
        </a>
        <a class="about-community-card about-community-card--telegram" href="https://t.me/dota2skins_official" target="_blank" rel="noopener noreferrer">
          <div class="about-community-icon">T</div>
          <div class="about-community-copy">
            <div class="about-community-title">${t('telegramTitle')}</div>
            <div class="about-community-desc">${t('telegramDesc')}</div>
          </div>
          <span class="about-community-action">${t('telegramAction')}</span>
        </a>
      </div>
    </div>

    <div class="settings-block" style="animation-delay:120ms">
      <h3>${t('thirdPartySoftware')}</h3>
      <div class="about-third-party-body">
        ${getLang() === 'en' ? 'This launcher contains code based on' : 'Этот лаунчер содержит код, основанный на'}
        <strong>Dota 2 Mod Manager</strong> by TheFleece.<br>
        ${getLang() === 'en' ? 'Licensed under GNU GPL v3.0.' : 'Лицензировано по GNU GPL v3.0.'}<br>
        ${getLang() === 'en' ? 'Original project:' : 'Оригинальный проект:'}
        <a href="https://github.com/TheFleece/dota2-mod-manager">https://github.com/TheFleece/dota2-mod-manager</a>
      </div>
    </div>
  `;

  viewRoot.querySelectorAll('a[href]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.api.misc.openExternal(a.href);
    });
  });
}

// ===== Settings =====

async function renderSettings() {
  const s = await window.api.settings.get();
  state.settings = s;
  document.documentElement.lang = s.appLanguage || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
  const cacheSize = await window.api.misc.cacheSize();
  const appVersion = await window.api.update.version();

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${t('settingsTitle')}</h1>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:var(--text-muted);font-size:13px">${t('languageLabel')}</span>
        <select class="input" id="uiLangSelect" style="min-width:140px">
          <option value="ru" ${s.appLanguage === 'ru' ? 'selected' : ''}>${t('russian')}</option>
          <option value="en" ${s.appLanguage === 'en' ? 'selected' : ''}>${t('english')}</option>
        </select>
      </div>
    </div>

    <div class="settings-block">
      <h3>${t('dotaPath')}</h3>
      <div class="settings-row">
        <span class="mono" style="flex:1">${esc(s.dotaGamePath || (getLang() === 'en' ? 'not found' : 'не найден'))}</span>
        <span class="dot ${s.dotaPathValid ? 'ok' : 'bad'}"></span>
      </div>
      <div class="settings-row">
        <button class="btn btn-sm" id="detectBtn">${t('detectAutomatically')}</button>
        <button class="btn btn-sm" id="browseBtn">${t('browseManually')}</button>
      </div>
    </div>

    <div class="settings-block" style="animation-delay:60ms">
      <h3>${t('langFolder')} и ${t('steamLaunchOption')}</h3>
      <div class="settings-row">
        <span class="settings-label">${t('langFolder')}</span>
        <div class="select-wrap">
          <span class="ms">folder</span>
          <select class="input" id="langSelect" style="padding-left:30px">
            ${['123', 'minify', 'russian', 'test'].map((v) => `<option value="${v}" ${s.langSuffix === v ? 'selected' : ''}>dota_${v}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="settings-row">
        <span class="settings-label">${t('steamLaunchOption')}</span>
        <span class="launch-code">-language ${esc(s.langSuffix)}
          <button class="btn btn-sm" id="copyLaunchBtn">${t('copy')}</button>
        </span>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted);margin-top:8px">
        ${t('settingsSteamNote')}
      </div>
      <div class="modal-note" style="margin-top:10px">
        ${t('settingsSteamWarning')}
      </div>
    </div>

    <div class="settings-block" style="animation-delay:120ms">
      <h3>${t('cacheSize')}</h3>
      <div class="settings-row">
        <span class="settings-label">${t('cacheSize')}</span>
        <span style="font-variant-numeric:tabular-nums">${fmtMB(cacheSize)} MB</span>
        <button class="btn btn-sm" id="clearCacheBtn">${t('clearCache')}</button>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted)">
        ${t('cacheInfoNote')}
      </div>
    </div>

    <div class="settings-block" style="animation-delay:180ms">
      <h3>${t('catalogTitle')}</h3>
      <div class="settings-row">
        <span class="settings-label">${t('updated')}</span>
        <span>${state.catalog?.fetchedAt ? new Date(state.catalog.fetchedAt).toLocaleString(getLang() === 'en' ? 'en-US' : 'ru') : '—'}</span>
        <button class="btn btn-sm" id="refreshCatBtn2">${t('refreshNow')}</button>
      </div>
      <div class="settings-row">
        <span class="settings-label">${t('source')}</span>
        <a style="color:var(--primary-soft);cursor:pointer;font-size:12.5px" id="srcLink">dota2skins.vercel.app</a>
      </div>
    </div>

  `;
  $('#detectBtn').addEventListener('click', async () => {
    const found = await window.api.settings.detectDota();
    if (found) toast(t('foundDota') + found);
    else toast(t('autoDetectFailed'), 'warn');
    renderSettings();
    refreshSidebarStatus();
  });
  $('#browseBtn').addEventListener('click', async () => {
    const r = await window.api.settings.browseDota();
    if (r?.error) toast(r.error, 'error');
    if (r?.path) toast(t('pathSaved'));
    renderSettings();
    refreshSidebarStatus();
  });
  $('#langSelect').addEventListener('change', async (e) => {
    await window.api.settings.set('langSuffix', e.target.value);
    toast(t('modsFolderHint').replace('{lang}', e.target.value), 'warn', 6000);
    renderSettings();
    refreshSidebarStatus();
  });
  $('#uiLangSelect').addEventListener('change', async (e) => {
    await window.api.settings.set('appLanguage', e.target.value);
    toast(t('appLanguageSaved'), 'success');
    renderSettings();
  });
  $('#copyLaunchBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(`-language ${s.langSuffix}`);
    toast(t('copiedToClipboard'));
  });
  $('#clearCacheBtn').addEventListener('click', async () => {
    await window.api.misc.clearCache();
    toast(t('cacheCleared'));
    renderSettings();
  });
  $('#refreshCatBtn2').addEventListener('click', async () => {
    await loadCatalog(true);
    renderSettings();
  });
  $('#srcLink').addEventListener('click', () => window.api.misc.openExternal('https://dota2skins.vercel.app/'));
  $('#checkUpdateBtn')?.addEventListener('click', async () => {
    const result = await window.api.update.check();
    if (result?.ok) {
      toast(t('checkingUpdates'), 'ok', 4000);
    } else {
      toast(result?.error || t('failedUpdates'), 'warn', 5000);
    }
  });
}

function removeUpdateBar() {
  document.querySelectorAll('.update-bar').forEach((bar) => bar.remove());
}

// ---------- status bar ----------

async function refreshSidebarStatus() {
  const s = await window.api.settings.get();
  state.settings = s;
  const dotEl = $('#dotaStatusDot');
  const txtEl = $('#dotaStatusText');
  if (s.dotaPathValid) {
    dotEl.className = 'dot ok';
    txtEl.textContent = `${t('dotaConnected')} · dota_${s.langSuffix} · ${t('steamLaunchOption')}: -language ${s.langSuffix}`;
  } else {
    dotEl.className = 'dot bad';
    txtEl.textContent = t('dotaNotFound');
  }
}

// ---------- progress ----------

let progressHideTimer = null;
window.api.onProgress((evt) => {
  const bar = $('#progressBar');
  if (evt.type === 'download') {
    bar.classList.remove('hidden');
    $('#progressLabel').textContent = t('downloadingProgress').replace('{label}', evt.label);
    if (evt.total > 0) {
      $('#progressSize').textContent = `${fmtMB(evt.loaded)} / ${fmtMB(evt.total)} MB`;
      $('#progressFill').style.width = `${(evt.loaded / evt.total) * 100}%`;
    } else {
      $('#progressSize').textContent = `${fmtMB(evt.loaded)} MB`;
      $('#progressFill').style.width = '40%';
    }
    clearTimeout(progressHideTimer);
  } else if (evt.type === 'stage') {
    $('#progressLabel').textContent = t('stageProgress').replace('{label}', evt.label).replace('{stage}', evt.stage);
    $('#progressFill').style.width = '95%';
  } else if (evt.type === 'done' || evt.type === 'error') {
    $('#progressFill').style.width = '100%';
    clearTimeout(progressHideTimer);
    progressHideTimer = setTimeout(() => bar.classList.add('hidden'), 800);
  }
});

// ---------- auto-update ----------

window.api.update.onUpdate((evt) => {
  removeUpdateBar();
  if (evt.type === 'available') {
    const bar = document.createElement('div');
    bar.className = 'update-bar';
    bar.innerHTML = `
      <span class="ms">system_update_alt</span>
      <span>${t('updateAvailable')} <b>v${esc(evt.version)}</b>. ${t('downloadingAutomatically')}</span>
      <button class="btn btn-sm btn-ghost" id="updateLaterBtn">${t('later')}</button>`;
    document.body.appendChild(bar);
    bar.querySelector('#updateLaterBtn').addEventListener('click', () => bar.remove());
  } else if (evt.type === 'downloaded') {
    const bar = document.createElement('div');
    bar.className = 'update-bar';
    bar.innerHTML = `
      <span class="ms">system_update_alt</span>
      <span>${t('updateReady')} <b>v${esc(evt.version)}</b></span>
      <button class="btn btn-sm btn-primary" id="updateNowBtn">${t('restartAndUpdate')}</button>
      <button class="btn btn-sm btn-ghost" id="updateLaterBtn">${t('later')}</button>`;
    document.body.appendChild(bar);
    bar.querySelector('#updateNowBtn').addEventListener('click', () => window.api.update.install());
    bar.querySelector('#updateLaterBtn').addEventListener('click', () => bar.remove());
  } else if (evt.type === 'not-available') {
    toast(t('noUpdates'), 'ok', 4000);
  } else if (evt.type === 'error') {
    toast(evt.message || t('failedUpdates'), 'warn', 5000);
  }
});

// ---------- boot ----------

async function loadCatalog(force = false) {
  if (force) toast(t('refreshingCatalog'));
  state.catalog = null;
  if (state.view === 'catalog') renderCatalog();
  state.catalog = await window.api.catalog.load(force);
  if (!state.catalog.error) buildModIndex();
  if (state.view === 'catalog') renderCatalog();
  else render();
  if (force && !state.catalog.error) toast(t('catalogUpdated'));
}

(async function boot() {
  const maxed = await window.api.win.isMaximized();
  if (maxed) $('#winMax').innerHTML = '<svg viewBox="0 0 12 12" width="12" height="12"><rect x="2" y="3.5" width="6.5" height="6.5" fill="none" stroke="currentColor" stroke-width="1.1" rx="1"/><path d="M4 3.5V2.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
  await refreshSidebarStatus();
  await refreshInstalledIndex();
  // On Linux, force catalog refresh at startup to avoid stale/empty catalog issues
  const isLinux = (typeof process !== 'undefined' && process.platform === 'linux') || (navigator.platform || '').toLowerCase().includes('linux');
  await loadCatalog(isLinux);
})();
