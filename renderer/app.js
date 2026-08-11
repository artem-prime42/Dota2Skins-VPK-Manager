/* Dota2skins mod manager — renderer */
'use strict';

const RAW_BASE = 'https://dota2skins.vercel.app';

const CAT_LABELS = {
  ru: {
    heroes: 'Герои', 'item-effects': 'Эффекты предметов', 'hero-items': 'Предметы героев',
    backgrounds: 'Фоны меню', cursors: 'Курсоры', 'mega-kill': 'Мега-килл', shaders: 'Шейдеры',
    couriers: 'Курьеры', terrains: 'Ландшафты', creeps: 'Крипы', trees: 'Деревья', river: 'Речка',
    'ti-bp-effects': 'Паки эффектов', emblems: 'Эмблемы', 'creep-deny': 'Денай крипов',
    music: 'Музыка', 'hero-sounds': 'Звуки героев', sounds: 'Звуки', 'ranged-attack': 'Дальние атаки',
    other: 'Разное', ranks: 'Ранги', 'item-icons': 'Иконки предметов', 'versus-screens': 'Versus Screen',
    announcers: 'Анонсеры', wards: 'Варды', pedestal: 'Пьедесталы', huds: 'HUD',
    herofx: 'Эффекты героев', pings: 'Пинги', packs: 'Versus Screen', optimization: 'Оптимизация',
    tormentor: 'Торментор', 'high-five': 'Дай пять', ancient: 'Древние', roshan: 'Рошан',
    towers: 'Башни', fonts: 'Шрифты', sites: 'Сайты', guides: 'Гайды', news: 'Новости',
  },
  en: {
    heroes: 'Heroes', 'item-effects': 'Item effects', 'hero-items': 'Hero items',
    backgrounds: 'Menu backgrounds', cursors: 'Cursors', 'mega-kill': 'Mega kill', shaders: 'Shaders',
    couriers: 'Couriers', terrains: 'Terrains', creeps: 'Creeps', trees: 'Trees', river: 'River',
    'ti-bp-effects': 'Effect packs', emblems: 'Emblems', 'creep-deny': 'Deny creeps',
    music: 'Music', 'hero-sounds': 'Hero sounds', sounds: 'Sounds', 'ranged-attack': 'Ranged attacks',
    other: 'Other', ranks: 'Ranks', 'item-icons': 'Item icons', 'versus-screens': 'Versus Screen',
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
    ['Интерфейс', ['backgrounds', 'huds', 'emblems', 'versus-screens', 'item-icons', 'ranks', 'pings', 'cursors']],
    ['Звук', ['announcers', 'mega-kill', 'music', 'sounds']],
    ['Прочее', ['packs', 'optimization', 'other', 'sites']],
  ],
  en: [
    ['Heroes', ['heroes', 'hero-items', 'herofx', 'hero-sounds']],
    ['World', ['terrains', 'trees', 'river', 'creeps', 'towers', 'roshan', 'ancient', 'tormentor', 'wards', 'couriers', 'pedestal', 'creep-deny']],
    ['Effects', ['shaders', 'ti-bp-effects', 'item-effects', 'ranged-attack', 'high-five']],
    ['Interface', ['backgrounds', 'huds', 'emblems', 'versus-screens', 'item-icons', 'ranks', 'pings', 'cursors']],
    ['Audio', ['announcers', 'mega-kill', 'music', 'sounds']],
    ['Other', ['packs', 'optimization', 'other', 'sites']],
  ],
};

const CATALOG_EXCLUDE = ['tools'];

const TOP_SECTION_CATEGORIES = {
  heroes: ['heroes'],
  world: ['couriers', 'terrains', 'trees', 'roshan', 'ancient', 'creeps', 'river', 'tormentor', 'wards', 'towers', 'high-five', 'emblems'],
  interface: ['packs', 'versus-screens', 'announcers', 'ranks', 'sounds', 'huds', 'mega-kill', 'wards', 'cursors', 'backgrounds'],
  effects: ['item-effects', 'shaders', 'creep-deny', 'ranged-attack'],
  other: ['pedestal', 'optimization', 'item-icons', 'other', 'hero-sounds'],
  tools: [],
};

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

const HERO_ATTRIBUTE_MAP = {
  alchemist: 'strength',
  axe: 'strength',
  bristleback: 'strength',
  centaur: 'strength',
  chaos_knight: 'strength',
  clockwerk: 'strength',
  dawnbreaker: 'strength',
  doom: 'strength',
  dragon_knight: 'strength',
  earth_spirit: 'strength',
  earthshaker: 'strength',
  elder_titan: 'strength',
  huskar: 'strength',
  kunkka: 'strength',
  largo: 'strength',
  legion_commander: 'strength',
  lifestealer: 'strength',
  lycan: 'strength',
  mars: 'strength',
  night_stalker: 'strength',
  ogre_magi: 'strength',
  omniknight: 'strength',
  phoenix: 'strength',
  primal_beast: 'strength',
  pudge: 'strength',
  slardar: 'strength',
  spirit_breaker: 'strength',
  sven: 'strength',
  tidehunter: 'strength',
  timbersaw: 'strength',
  tiny: 'strength',
  treant_protector: 'strength',
  tusk: 'strength',
  underlord: 'strength',
  undying: 'strength',
  wraith_king: 'strength',
  anti_mage: 'agility',
  bloodseeker: 'agility',
  bounty_hunter: 'agility',
  broodmother: 'agility',
  clinkz: 'agility',
  drow_ranger: 'agility',
  ember_spirit: 'agility',
  faceless_void: 'agility',
  gyrocopter: 'agility',
  hoodwink: 'agility',
  juggernaut: 'agility',
  kez: 'agility',
  lone_druid: 'agility',
  luna: 'agility',
  medusa: 'agility',
  meepo: 'agility',
  mirana: 'agility',
  monkey_king: 'agility',
  morphling: 'agility',
  naga_siren: 'agility',
  phantom_assassin: 'agility',
  phantom_lancer: 'agility',
  razor: 'agility',
  riki: 'agility',
  shadow_fiend: 'agility',
  slark: 'agility',
  sniper: 'agility',
  spectre: 'agility',
  templar_assassin: 'agility',
  terrorblade: 'agility',
  troll_warlord: 'agility',
  ursa: 'agility',
  vengeful_spirit: 'agility',
  viper: 'agility',
  weaver: 'agility',
  ancient_apparition: 'intelligence',
  bane: 'universal',
  batrider: 'universal',
  chen: 'intelligence',
  crystal_maiden: 'intelligence',
  dark_seer: 'intelligence',
  dark_willow: 'intelligence',
  disruptor: 'intelligence',
  enchantress: 'intelligence',
  enigma: 'universal',
  grimstroke: 'intelligence',
  invoker: 'intelligence',
  jakiro: 'intelligence',
  keeper_of_the_light: 'intelligence',
  leshrac: 'intelligence',
  lich: 'intelligence',
  lina: 'intelligence',
  lion: 'intelligence',
  muerta: 'intelligence',
  necrophos: 'intelligence',
  outworld_devourer: 'intelligence',
  puck: 'intelligence',
  pugna: 'intelligence',
  queen_of_pain: 'intelligence',
  ringmaster: 'intelligence',
  rubick: 'intelligence',
  shadow_demon: 'intelligence',
  shadow_shaman: 'intelligence',
  silencer: 'intelligence',
  skywrath_mage: 'intelligence',
  storm_spirit: 'intelligence',
  tinker: 'intelligence',
  oracle: 'intelligence',
  warlock: 'intelligence',
  witch_doctor: 'intelligence',
  zeus: 'intelligence',
  abaddon: 'universal',
  arc_warden: 'universal',
  beastmaster: 'universal',
  batrider: 'universal',
  brewmaster: 'universal',
  dazzle: 'universal',
  death_prophet: 'universal',
  enigma: 'universal',
  io: 'universal',
  magnus: 'universal',
  marci: 'universal',
  nature_prophet: 'universal',
  nyx_assassin: 'universal',
  pangolier: 'universal',
  sand_king: 'universal',
  snapfire: 'universal',
  techies: 'universal',
  venomancer: 'universal',
  visage: 'universal',
  void_spirit: 'universal',
  windranger: 'universal',
  winter_wyvern: 'intelligence',
};

function getHeroAttribute(slug) {
  if (!slug) return null;
  return HERO_ATTRIBUTE_MAP[String(slug).toLowerCase()] || null;
}

function heroFilterLabel(filterKey) {
  switch (filterKey) {
    case 'favorites': return getLang() === 'en' ? 'Favorites' : 'Избранные';
    case 'count':
    case 'most-mods': return getLang() === 'en' ? 'Most mods' : 'С наибольшим числом модов';
    case 'popular': return getLang() === 'en' ? 'Popular' : 'Популярные';
    case 'anime': return getLang() === 'en' ? 'Anime' : 'Anime';
    case 'arcana': return getLang() === 'en' ? 'Arcana' : 'Arcana';
    case 'immortal': return getLang() === 'en' ? 'Immortal' : 'Immortal';
    case 'universal': return getLang() === 'en' ? 'Universal' : 'Универсал';
    case 'strength': return getLang() === 'en' ? 'Strength' : 'Сила';
    case 'agility': return getLang() === 'en' ? 'Agility' : 'Ловкость';
    case 'intelligence': return getLang() === 'en' ? 'Intelligence' : 'Интеллект';
    default: return getLang() === 'en' ? 'All' : 'Все';
  }
}

function getHeroFilterGroups() {
  const lang = getLang();
  return [
    { title: lang === 'en' ? 'Parameters' : 'Параметры', icon: 'tune', keys: ['all', 'strength', 'agility', 'intelligence', 'universal'] },
    { title: lang === 'en' ? 'Rarity' : 'Редкость', icon: 'star', keys: ['all', 'immortal', 'arcana'] },
    { title: lang === 'en' ? 'Additional' : 'Дополнительно', icon: 'movie', keys: ['all', 'anime'] },
    { title: lang === 'en' ? 'Quick filters' : 'Быстрые фильтры', icon: 'bolt', keys: ['all', 'favorites', 'most-mods', 'popular'] },
  ];
}

function heroHasAnime(hero) {
  const heroMods = getHeroModsForSlug(hero.slug);
  return heroMods.some((mod) => modHasAnimeTag(mod));
}

function heroHasRarity(hero, rarity) {
  const heroMods = getHeroModsForSlug(hero.slug);
  return heroMods.some((mod) => getModBadgeType(mod) === rarity || normalizeTags(mod.tags).some((tag) => String(tag).toLowerCase() === rarity));
}

function getHeroPopularity(hero) {
  return getHeroModsForSlug(hero.slug).reduce((sum, mod) => {
    const downloads = Number(mod.downloads ?? mod.downloadCount ?? mod.downloadsCount ?? 0);
    return sum + (Number.isFinite(downloads) ? downloads : 0);
  }, 0);
}

const FAVORITE_HEROES_KEY = 'favoriteHeroes';
function loadFavoriteHeroes() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITE_HEROES_KEY) || '[]').map((slug) => String(slug).toLowerCase()));
  } catch {
    return new Set();
  }
}
function saveFavoriteHeroes() {
  localStorage.setItem(FAVORITE_HEROES_KEY, JSON.stringify([...state.favorites]));
}
function toggleFavoriteHero(slug) {
  if (!slug) return;
  const key = String(slug).toLowerCase();
  if (state.favorites.has(key)) state.favorites.delete(key);
  else state.favorites.add(key);
  saveFavoriteHeroes();
  renderCatalog();
}

const COURIER_EFFECT_MODS = new Set([
  'pudgling',
  'gingerbread baby roshan',
  'golden doomling',
  'golden huntling',
  'onibi',
  'honey heist baby roshan',
  'strongback the swift',
  'nian courier',
  'golden flopjaw the boxhound',
  'dark moon baby roshan',
  'baby roshan 2018',
  'jade baby roshan',
  'aghanims baby roshan radiant',
  'aghanims baby roshan dire',
  'baby roshan 2017',
  'desert sands baby roshan',
  'golden seekling',
  'golden venoling',
  'jadehoof',
]);

const COURIER_EFFECT_NOTICE = {
  ru: 'Этот курьер имеет эффекты. Чтобы они работали, необходимо выбрать курьера `Dollfart` и `Roshinante Scholar Edition` — его дают за выполнение заданий обучения 1 разряд.\n\nЕсли у вас нет этого курьера, выберите стандартного курьера, но он будет без эффектов.',
  en: 'This courier has effects. To make them work, you need to select the courier `Dollfart` and `Roshinante Scholar Edition` — it is awarded for completing training missions at rank 1.\n\nIf you do not have this courier, select the default courier, but it will be without effects.',
};

const UI_TEXT = {
  ru: {
    appTitle: 'Dota2skins',
    appSubtitle: 'Dota 2',
    searchPlaceholder: 'Поиск модов…',
    clear: 'Очистить',
    minimize: 'Свернуть',
    closeWindow: 'Закрыть',
    home: 'Главная',
    modsButton: 'Моды',
    heroesSection: 'Герои',
    worldSection: 'Мир',
    interfaceSection: 'Интерфейс',
    effectsSection: 'Эффекты',
    otherSection: 'Остальное',
    catalog: 'Каталог',
    library: 'Библиотека',
    presets: 'Пресеты',
    authors: 'Авторы',
    tools: 'Инструменты',
    toolsSection: 'Инструменты',
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
    browsePath: 'Обзор',
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
    basedOnProject: 'Основано на коде проекта',
    appearance: 'Внешний вид',
    developerRole: 'Разработчик и контрибьютор',
    version: 'Версия',
    checkUpdates: 'Проверить обновление',
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
    filters: 'Фильтры',
    addToFavorites: 'Добавить в избранное',
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
    enableSelected: 'Включить выбранные',
    disableSelected: 'Отключить выбранные',
    mergeSelectedMods: 'Объединить выбранные',
    removeSelectedMods: 'Удалить выбранные',
    removeSelectedConfirm: 'Удалить выбранные моды?',
    mergeSelectedConfirm: 'Объединить выбранные моды?',
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
    toolsInDevelopment: 'Вкладка пока в разработке — некоторые функции могут быть недоступны.',
    installNoteFonts: 'Шрифт ставится в файлы игры (game\\dota\\panorama\\fonts) — параметр запуска не нужен. Оригиналы сохраняются автоматически.',
    installNoteCursors: 'Курсор ставится в game\\dota\\resource\\cursor — параметр запуска не нужен. Оригиналы сохраняются автоматически.',
    settingsSteamNote: 'Steam → Библиотека → ПКМ по Dota 2 → Свойства → Параметры запуска → вставь строку выше. Моды (кроме шрифтов и курсоров) работают только с этим параметром.',
    settingsSteamWarning: 'В Dota2 теперь требуется указывать допустимый язык, поэтому такие параметры, как -language minify, -language foo, больше не работают. Вместо этого используйте другой допустимый язык.',
    cacheInfoNote: 'Скачанные архивы модов. Нужны для быстрой переустановки — удаление ничего не сломает.',
    autoUpdate: 'Авто обновление',
    enabled: 'Включено',
    disabled: 'Выключено',
    developer: 'Разработчик',
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
    reviews: 'Отзывы',
    noReviews: 'Отзывы пока отсутствуют',
    leaveReview: 'Оставьте свой отзыв',
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
    modsButton: 'Mods',
    heroesSection: 'Heroes',
    worldSection: 'World',
    interfaceSection: 'Interface',
    effectsSection: 'Effects',
    otherSection: 'Other',
    catalog: 'Catalog',
    library: 'Library',
    presets: 'Presets',
    authors: 'Authors',
    tools: 'Tools',
    toolsSection: 'Tools',
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
    browsePath: 'Open folder',
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
    basedOnProject: 'Based on the project',
    appearance: 'Appearance',
    developerRole: 'Developer and contributor',
    version: 'Version',
    checkUpdates: 'Check for updates',
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
    filters: 'Filters',
    addToFavorites: 'Add to favorites',
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
    enableSelected: 'Enable selected',
    disableSelected: 'Disable selected',
    mergeSelectedMods: 'Merge selected',
    removeSelectedMods: 'Remove selected',
    removeSelectedConfirm: 'Delete selected mods?',
    mergeSelectedConfirm: 'Merge selected mods?',
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
    autoUpdate: 'Auto update',
    enabled: 'Enabled',
    disabled: 'Disabled',
    developer: 'Developer',
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
    reviews: 'Reviews',
    noReviews: 'No reviews yet',
    leaveReview: 'Leave a review',
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
  topSection: 'heroes',
  activeCategory: 'heroes',
  search: '',
  searchType: '',
  searchActive: false,
  searchKeepFocus: false,
  filters: { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '', heroFilter: new Set() },
  heroFiltersOpen: false,
  heroSearchKeepFocus: false,
  selectedModKey: null,
  dashboardSlide: 0,
  favorites: loadFavoriteHeroes(),
  librarySearch: '',
  librarySection: 'all',
  librarySort: 'default',
  installedIndex: new Map(),
  installing: new Set(),
  modIndex: new Map(),
  authors: { selected: null, search: '', sort: 'default' },
};

const $ = (sel) => document.querySelector(sel);
const viewRoot = $('#view-root');

function isExternalLinkUrl(url) {
  const normalized = String(url || '').trim();
  return /^https?:\/\//i.test(normalized) || /^mailto:/i.test(normalized);
}

function bindExternalLinkHandlers(root = document) {
  if (!root || root.__externalLinkBound) return;
  root.addEventListener('click', (event) => {
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || !isExternalLinkUrl(href)) return;
    event.preventDefault();
    event.stopPropagation();
    window.api?.misc?.openExternal?.(href);
  }, true);
  root.__externalLinkBound = true;
}

bindExternalLinkHandlers(document);

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const ARCANA_MOD_NAMES = new Set([
  'drow ranger arcana',
  'drow ranger arcana style 2 dark carnival',
  'drow ranger stranger arcana',
  'earthshaker arcana style 2',
  'faceless void arcana',
  'vengeful spirit arcana',
  'faceless void arcana style 2',
  'monkey king arcana',
  'monkey king arcana water',
  'monkey king arcana death',
  'monkey king arcana fire',
  'spectre arcana',
  'spectre arcana style 2',
  'bloody spectre',
  'terrorblade immortal arcana',
  'terrorblade black arcana',
  'terrorblade fractal horns of inner red',
  'terrorblade fractal horns of inner white',
  'terrorblade green fractal horns',
  'terrorblade fractal horns of inner white v2',
  'zeus arcana',
  'wraith king arcana',
  'phantom assassin arcana gothic whisper',
  'skywrath mage arcana i',
  'skywrath mage arcana ii',
  'shadow fiend arcana',
]);
const IMMORTAL_MOD_NAMES = new Set([
  'golden basher of mage skulls',
  'golden offhand basher of mage skulls',
  'origins of faith',
  'orbuculum equinox dire delight',
  'axe custom unleashed',
  'eternal radiance blades',
  'thirst of eztzhok blade',
  'thirst of eztzhok off hand',
  'bloodseeker eztzhok',
  'tines of tybara',
  'hunter\'s hoard',
  'lion cannonroar confessor',
  'mulctant pall crimson',
  'tyrian mulctant pall',
  'beastmaster primal paean',
  'beastmaster primal peacemaker',
  'beastmaster primal peacemaker crimson',
  'immortal beastmaster',
  'infernal cavalcade',
  'infernal chieftain',
  'infernal chieftain of the crimson witness',
  'golden infernal chieftain',
  'infernal cavalcade of the crimson witness',
  'infernal menace',
  'yulsaria\'s glacier',
  'yulsaria\'s mantle',
  'ice blossom',
  'golden ice blossom',
  'golden bracers of forlorn precipice',
  'bracers of forlorn precipice',
  'gates of nothl',
  'gates of nothl crimson',
  'disruptor tandem storm',
  'mace of aeons',
  'mace of aeons oathbreaker',
  'mace of aeons usurper',
  'magus apex',
  'dark artistry cape',
  'magus accord',
  'dark artistry belt',
  'dark artistry pauldrons',
  'dark artistry bracers',
  'mulctant pall',
  'lion fin kings charm',
  'fin king\'s charm of eminent revival',
  'fin kings charm of eminent revival exceptional',
  'hell-spar anathema crimson',
  'hell-spar anathema',
  'hell-spar anathema obsidian blight',
  'cauldron of xahryx retro v2',
  'claws of nuranu',
  'twilight schism',
  'golden twilight schism',
  'twilight schism of the crimson witness',
  'moonfall',
  'golden moonfall',
  'eyes of ardenok',
  'eyes of ardenok crimson',
  'shock of the anvil',
  'progenitor\'s bane',
  'crimson progenitor\'s bane',
  'staff of gun-yu',
  'golden staff of gun-yu',
  '10th anniversary staff of gun-yu',
  'staff of gun-yu of the crimson witness',
  'immortal necrophos',
  'codicil of the veiled ones',
  'avowance of the veiled ones',
  'avowance of the crimson witness',
  'concord reversion',
  'concord dominion',
  'concord dominion of the crimson witness',
  'tyrian phantom concord',
  'immortal puck',
  'queen of pain immortal',
  'arms of desolation',
  'immortal slardar',
  'slark immortal v2',
  'dragonclaw hook',
  'mirana photax fluttercat',
  'rapier of the burning god',
  'rapier of the burning god offhand',
  'phantom lancer fire',
  'slark shadow in the deep',
  'savage mettle',
  'lightning orchid',
  'the lightning orchid of eminent revival',
  'the lightning orchid of eminent revival exceptional',
  'whale blade',
  'kunkka whale blade of eminent revival exceptional',
  'serrakura',
  'io madame scrio',
  'dark artistry hair',
  'invoker dark artistry',
  'immortal ancient apparition',
  'tinker interstellar astrarium',
  'sniper ardalan interdictor',
  'oracle immortal silence',
  'cosmic immortal tinker',
  'snapfire immortal',
  'immortal medusa',
  'ember spirit set 1',
  'immortal phantom lancer v2',
  'anti mage immortal',
  'immortal lina',
  'axe immortal set',
  'phantom lancer immortal',
  'storm spirit gold',
  'anonymous ember',
  'void spirit hidden vector',
  'stormborn',
  'golden mandate of the stormborn',
  'immortal templar assassin',
  'rollermawster',
  'tiny majesty of the colossus',
  'the hallows within',
  'swift claw',
  'underlord immortal ravenous',
  'soul shredder',
  'invoker immortal',
  'shadow fiend immortal',
  'doom sematary spells + ultimate song',
]);

function normalizeBadgeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function getModBadgeType(mod, styleLabel = '') {
  const name = normalizeBadgeName(mod?.name);
  const label = normalizeBadgeName(styleLabel);
  const fullName = normalizeBadgeName(`${name} ${label}`);
  const rawTags = Array.isArray(mod?.tags)
    ? mod.tags
    : (typeof mod?.tags === 'object' && mod?.tags !== null
      ? Object.entries(mod.tags).filter(([, value]) => Boolean(value)).map(([key]) => key)
      : []);
  const tags = rawTags.map((tag) => normalizeBadgeName(tag));
  if (ARCANA_MOD_NAMES.has(fullName) || ARCANA_MOD_NAMES.has(name) || ARCANA_MOD_NAMES.has(label) || tags.includes('arcana')) return 'arcana';
  if (IMMORTAL_MOD_NAMES.has(fullName) || IMMORTAL_MOD_NAMES.has(name) || IMMORTAL_MOD_NAMES.has(label) || tags.includes('immortal')) return 'immortal';
  return null;
}

function badgeLabelForType(type) {
  return type === 'arcana' ? 'Arcana' : type === 'immortal' ? 'Immortal' : '';
}

function isSearchTypeMatch(mod, searchType) {
  if (!searchType) return true;
  return getModBadgeType(mod) === searchType;
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
function getCatalogSearchPlaceholder() {
  const placeholders = {
    ru: {
      heroes: 'Поиск героя...',
      world: 'Поиск предметов мира...',
      interface: 'Поиск элементов интерфейса...',
      effects: 'Поиск эффектов...',
      other: 'Поиск элементов...'
    },
    en: {
      heroes: 'Search hero...',
      world: 'Search world items...',
      interface: 'Search interface elements...',
      effects: 'Search effects...',
      other: 'Search other items...'
    }
  };
  return placeholders[getLang()]?.[state.topSection] || placeholders.ru?.heroes || 'Search mods...';
}
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
  if (/^file:\/\//i.test(preview)) return preview;
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
  if (/^(https?:\/\/|file:\/\/\/?)+/i.test(picked) || /^[A-Za-z]:[\\/]/.test(picked) || picked.startsWith('/')) return picked;
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
  if (/^file:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `file://${encodeURI(url)}`;
  return `${RAW_BASE}/${url.split('/').map(encodeURIComponent).join('/')}`;
}

function resolvePreviewAction(categoryId, mod) {
  const videoField = typeof mod?.video === 'string' && mod.video.trim() ? mod.video.trim() : null;
  if (videoField) {
    const resolvedVideo = resolveUrl(videoField);
    if (isMedia(resolvedVideo)) return { kind: isAudio(resolvedVideo) ? 'audio' : 'media', url: resolvedVideo };
    const embedUrl = getEmbedUrl(videoField);
    if (embedUrl) return { kind: 'embed', url: embedUrl, rawUrl: videoField };
  }

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
  let normalizedUrl = '';
  let posterUrl = null;
  if (typeof url === 'object' && url !== null) {
    normalizedUrl = typeof url.url === 'string' ? url.url.trim() : '';
    posterUrl = typeof url.poster === 'string' ? url.poster.trim() : null;
  } else {
    normalizedUrl = typeof url === 'string' ? url.trim() : '';
  }
  if (!normalizedUrl) {
    return `<div class="noimg"><span class="ms" style="font-size:36px">image</span></div>`;
  }
  if (isVideo(normalizedUrl)) {
    const type = normalizedUrl.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
    return `<video ${controls ? 'controls' : 'muted'} loop playsinline preload="${autoplay ? 'auto' : 'none'}" ${autoplay ? 'autoplay' : ''} ${posterUrl ? `poster="${esc(posterUrl)}"` : ''} ${hoverPlay ? 'data-hoverplay="1"' : ''}>
      <source src="${esc(normalizedUrl)}" type="${type}">
      ${t('videoNotSupported') || 'Your browser does not support this video.'}
    </video>`;
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
            : `<video autoplay playsinline preload="auto"><source src="${esc(url)}" type="${isVideo(url) ? (url.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4') : 'video/mp4'}"></video>`}
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
  const result = await window.api.mods.list();
  const installed = Array.isArray(result?.installed) ? result.installed : [];
  state.installedIndex.clear();
  for (const rec of installed) {
    if (rec && rec.categoryId && rec.name) {
      state.installedIndex.set(keyOf(rec.categoryId, rec.name, rec.styleLabel), rec);
    }
  }
  const libCountEl = $('#libCount');
  if (libCountEl) {
    libCountEl.textContent = installed.length ? String(installed.length) : '';
  }
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

function formatHeroLabelFromSlug(slug) {
  return String(slug || '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function getHeroSlugForMod(mod) {
  const fromHero = (mod?.hero || '').toString().trim().toLowerCase();
  if (fromHero) return fromHero;
  const fromLabel = (mod?.heroLabel || '').toString().trim().toLowerCase();
  if (fromLabel) return fromLabel.replace(/\s+/g, '_');
  return '';
}

function getHeroCatalogEntries() {
  const catalogHeroes = Array.isArray(state.catalog?.constants?.HERO_CATALOG) ? state.catalog.constants.HERO_CATALOG : [];
  const heroMods = Array.isArray(state.catalog?.mods?.modsData?.heroes)
    ? state.catalog.mods.modsData.heroes.filter((m) => m && (getHeroSlugForMod(m) || m.categoryId === 'heroes'))
    : [];
  const grouped = new Map();
  for (const mod of heroMods) {
    const slug = getHeroSlugForMod(mod);
    if (!slug) continue;
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug).push(mod);
  }

  const entries = catalogHeroes
    .map((hero) => {
      const slug = (hero?.slug || hero?.id || '').toString().trim().toLowerCase();
      if (!slug) return null;
      const mods = grouped.get(slug) || [];
      return {
        ...hero,
        slug,
        name: hero?.name || formatHeroLabelFromSlug(slug),
        modsCount: mods.length,
        slots: [...new Set(mods.map((m) => m.slot || 'default').filter(Boolean))],
      };
    })
    .filter(Boolean);

  for (const [slug, mods] of grouped.entries()) {
    if (entries.some((entry) => entry.slug === slug)) continue;
    entries.push({
      id: slug,
      slug,
      name: formatHeroLabelFromSlug(slug),
      preview: null,
      modsCount: mods.length,
      slots: [...new Set(mods.map((m) => m.slot || 'default').filter(Boolean))],
    });
  }

  return entries
    .sort((a, b) => (b.modsCount || 0) - (a.modsCount || 0) || (a.name || '').localeCompare(b.name || ''));
}

function getHeroModsForSlug(slug) {
  const heroSlug = (slug || '').toString().trim().toLowerCase();
  if (!heroSlug) return [];
  return (state.catalog?.mods?.modsData?.heroes || []).filter((mod) => {
    const candidate = getHeroSlugForMod(mod);
    return candidate === heroSlug || (mod?.heroLabel || '').toString().trim().toLowerCase() === heroSlug;
  });
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

const HIDDEN_TAGS = new Set(['immortal', 'arcana', 'anime']);

const HIDDEN_ANIME_MOD_NAMES = new Set([
  'bane komeiji koishi',
  'chen lelouch',
  'invoker patchouli',
  'jakiro kiyohime',
  'io histoire',
  'natures prophet saya',
  'doom jeanne alter',
  'kez zangetsu',
]);

function normalizeModName(name) {
  return String(name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function modHasAnimeTag(mod) {
  if (!mod) return false;
  const tagValues = Array.isArray(mod.tags)
    ? mod.tags
    : (typeof mod.tags === 'object' ? Object.entries(mod.tags).filter(([, v]) => v).map(([k]) => k) : []);
  const hasExplicitAnimeTag = tagValues.some((tag) => String(tag || '').trim().toLowerCase() === 'anime');
  if (hasExplicitAnimeTag) return true;
  return HIDDEN_ANIME_MOD_NAMES.has(normalizeModName(mod.name));
}

function normalizeTags(tags) {
  if (!tags) return [];
  const rawTags = Array.isArray(tags)
    ? tags
    : (typeof tags === 'object' ? Object.entries(tags).filter(([, v]) => v).map(([k]) => k) : []);
  return rawTags
    .map((t) => String(t || '').trim())
    .filter((t) => t && !HIDDEN_TAGS.has(t.toLowerCase()));
}

function isInstalled(categoryId, m) {
  return state.installedIndex.has(keyOf(categoryId, m.name, null)) ||
    (m.styles || []).some((s) => state.installedIndex.has(keyOf(categoryId, m.name, s.label)));
}

// ---------- filtering / sorting ----------

function collectTags(mods) {
  const tags = new Map(); // tag -> count
  for (const m of mods) {
    for (const tag of normalizeTags(m.tags)) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
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

function matchesHeroFilter(mod, heroFilter) {
  const value = String(heroFilter || '').trim().toLowerCase();
  if (!value) return true;
  const heroSlug = (mod.hero || '').toString().trim().toLowerCase();
  const heroLabel = (mod.heroLabel || '').toString().trim().toLowerCase();
  const normalizedFilter = value.replace(/[_-]+/g, ' ');
  const normalizedHeroLabel = heroLabel.replace(/[_-]+/g, ' ');
  const heroSlugVariants = new Set([
    value,
    value.replace(/[_\s]+/g, '_'),
    value.replace(/[_\s]+/g, '-'),
    normalizedFilter,
  ]);
  return heroSlugVariants.has(heroSlug) || heroSlugVariants.has(heroLabel) || heroSlugVariants.has(normalizedHeroLabel);
}

function applyFilters(mods, catForInstalled) {
  const f = state.filters;
  let out = mods;
  if (f.group) out = out.filter((m) => m._group === f.group);
  if (f.hero) out = out.filter((m) => matchesHeroFilter(m, f.hero));
  if (f.tags.size) {
    out = out.filter((m) => {
      const normalized = new Set(normalizeTags(m.tags));
      return [...f.tags].every((t) => normalized.has(t));
    });
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
$('#winFull')?.addEventListener('click', () => window.api.win.toggleFullscreen());
$('#winClose')?.addEventListener('click', () => window.api.win.close());

// ---------- navigation ----------

document.querySelectorAll('.side-tab').forEach((btn) => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

document.querySelectorAll('.top-tab').forEach((btn) => {
  btn.addEventListener('click', () => setTopSection(btn.dataset.top));
});

function updateTopTabsState() {
  const isTopView = state.view === 'catalog' || state.view === 'tools';
  document.querySelectorAll('.top-tab').forEach((btn) => {
    btn.classList.toggle('active', isTopView && btn.dataset.top === state.topSection);
  });
}

function resetCatalogState() {
  state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '', heroFilter: new Set() };
  state.heroFiltersOpen = false;
  state.heroSearchKeepFocus = false;
  state.selectedModKey = null;
  state.search = '';
  state.searchType = '';
  state.searchActive = false;
}

function setTopSection(section) {
  if (!TOP_SECTION_CATEGORIES[section]) return;
  state.topSection = section;
  resetCatalogState();
  if (section === 'heroes') {
    state.activeCategory = 'heroes';
  } else {
    state.activeCategory = 'all';
  }
  const button = document.querySelector(`.top-tab[data-top="${section}"]`);
  if (button) {
    button.classList.remove('is-animating');
    window.requestAnimationFrame(() => {
      button.classList.add('is-animating');
      window.setTimeout(() => button.classList.remove('is-animating'), 320);
    });
  }
  if (section === 'tools') {
    switchView('tools');
  } else {
    switchView('catalog');
  }
}

function sectionSubnavCategories() {
  const sectionCats = TOP_SECTION_CATEGORIES[state.topSection] || [];
  if (state.topSection === 'heroes') return sectionCats;
  return ['all', ...sectionCats];
}

function shouldShowSectionSubnav() {
  const sectionCats = sectionSubnavCategories();
  const visibleSectionCats = sectionCats.filter((id) => id === 'all' || categoryMods(id).length > 0);
  return visibleSectionCats.length > 1;
}

function switchView(view) {
  closeModal();
  closeSlotModals();
  document.querySelectorAll('.side-tab').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  state.view = view;
  if ($('#catRail')) $('#catRail').classList.toggle('hidden', view !== 'catalog');
  updateTopTabsState();
  void refreshSidebarStatus();
  render();
}

function renderSectionSubnav() {
  const container = $('#sectionSubnav');
  if (!container) return;
  if (state.view === 'home' || !shouldShowSectionSubnav() || state.view !== 'home' && state.view !== 'catalog') {
    container.innerHTML = '';
    return;
  }
  const sectionCats = sectionSubnavCategories();
  const visibleSectionCats = sectionCats.filter((id) => id === 'all' || categoryMods(id).length > 0);
  const labelFor = (id) => {
    if (id === 'all') return getLang() === 'en' ? 'All' : 'Все';
    if (id === 'packs') return getLang() === 'en' ? 'Versus Screen' : 'Versus Screen';
    return catName(id);
  };
  container.innerHTML = visibleSectionCats.map((id) => `
    <button class="section-chip ${state.activeCategory === id ? 'active' : ''}" data-cat="${esc(id)}" type="button">
      ${esc(labelFor(id))}
    </button>
  `).join('');
  container.querySelectorAll('.section-chip').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCategory = button.dataset.cat;
      render();
      $('#main').scrollTop = 0;
    });
  });
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

function restoreGlobalSearchFocus() {
  if (!state.searchKeepFocus) return;
  const input = $('#globalSearchInput');
  if (!input) return;
  if (document.activeElement === input) return;
  requestAnimationFrame(() => {
    if (!state.searchKeepFocus) return;
    input.focus();
    const len = input.value.length;
    input.setSelectionRange(len, len);
  });
}

function bindGlobalSearch() {
  const input = $('#globalSearchInput');
  const clearBtn = $('#globalSearchClear');
  if (!input) return;
  if (input.dataset.bound === '1') return;
  input.dataset.bound = '1';
  input.value = state.search || '';
  const applySearch = (value) => {
    state.search = value;
    if (value.trim()) {
      state.searchActive = true;
    } else {
      state.searchActive = false;
      state.searchType = '';
    }
    renderCatalog();
  };
  input.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    state.searchKeepFocus = true;
    searchTimer = setTimeout(() => applySearch(e.target.value), 180);
    input.placeholder = getCatalogSearchPlaceholder();
  });
  input.addEventListener('focus', () => {
    state.searchKeepFocus = true;
    input.placeholder = getCatalogSearchPlaceholder();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      state.searchKeepFocus = false;
      input.blur();
    }
  });
  clearBtn?.addEventListener('click', () => {
    input.value = '';
    state.searchKeepFocus = true;
    applySearch('');
    requestAnimationFrame(() => input.focus());
  });
  input.placeholder = getCatalogSearchPlaceholder();
}

// ---------- views ----------

function render() {
  let renderer = renderCatalog;
  switch (state.view) {
    case 'home': renderer = renderDashboard; break;
    case 'catalog': renderer = renderCatalog; break;
    case 'library': renderer = renderLibrary; break;
    case 'authors': renderer = renderAuthors; break;
    case 'tools': renderer = renderTools; break;
    case 'settings': renderer = renderSettings; break;
  }
  const viewRoot = $('#view-root');
  if (viewRoot) {
    viewRoot.classList.remove('view-animating');
    void viewRoot.offsetWidth;
    viewRoot.classList.add('view-animating');
  }
  renderer();
  renderSectionSubnav();
  bindGlobalSearch();
  restoreGlobalSearchFocus();
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
      state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '', heroFilter: new Set() };
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

function getLatestMods(limit = 40) {
  const modsData = state.catalog?.mods?.modsData;
  if (!modsData) {
    return (state.catalog?.mods?.recentlyAddedMods || [])
      .slice(0, limit)
      .map((m) => ({ ...m, _cat: m._cat || m.categoryId || m.category || 'other' }));
  }

  const mods = [];
  for (const cat of visibleCategories()) {
    for (const mod of categoryMods(cat.id)) {
      const ts = parseDateValue(getModDateValue(mod));
      if (!ts) continue;
      mods.push({ ...mod, _cat: cat.id, _dateTs: ts });
    }
  }
  return mods.sort((a, b) => b._dateTs - a._dateTs).slice(0, limit);
}

function getPopularMods(limit = 5) {
  const mods = [];
  for (const cat of visibleCategories()) {
    for (const mod of categoryMods(cat.id)) {
      const downloads = Number(mod.downloads ?? mod.downloadCount ?? mod.downloadsCount ?? 0);
      mods.push({
        ...mod,
        _cat: cat.id,
        _downloads: Number.isFinite(downloads) ? downloads : 0,
      });
    }
  }
  return mods.sort((a, b) => b._downloads - a._downloads || String(a.name || '').localeCompare(String(b.name || ''))).slice(0, limit);
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

  if ($('#catRail')) renderRail();

  const searching = state.search.trim().length > 0 || state.searchType || state.searchActive;
  if (searching) {
    renderSearchResults();
  } else if (state.activeCategory === 'all') {
    renderSectionAll();
  } else {
    renderCategory(state.activeCategory);
  }
  bindGlobalSearch();
  restoreGlobalSearchFocus();
}

// --- home (landing) ---

function renderDashboard() {
  const cats = visibleCategories();
  const totalMods = cats.reduce((n, c) => n + categoryMods(c.id).length, 0);
  const totalAuthors = 14;
  const categoriesCount = cats.length;
  const installedModsCount = state.installedIndex.size || parseInt($('#libCount')?.textContent || '0') || 0;
  const recentMods = getLatestMods(6);
  const heroEntries = getHeroCatalogEntries()
    .filter((h) => (h.modsCount || 0) > 0)
    .slice(0, 4);
  const heroSlidePool = ['invoker', 'juggernaut', 'pudge', 'rubick', 'storm_spirit', 'tidehunter'];
  const updateItems = (getLang() === 'en' ? [
    {
      title: 'Version 1.1.8',
      date: '2026-08-03',
      heroSlug: 'invoker',
      meta: 'Launcher update',
      changes: [
        'Switching language in Settings automatically migrates managed mod files to the new language folder.',
        'Improved merge button behavior and validation for safer merges.',
        'Various bug fixes and stability improvements.'
      ],
    },
    {
      title: '1.1.7 launcher update',
      date: '2026-08-03',
      heroSlug: 'abaddon',
      meta: 'Launcher improvements and catalog navigation',
      changes: [
        'Fully refreshed the launcher home page.',
        'Fixed found issues and improved overall stability.',
        'Added video preview support for mods in the Hero Sounds category.',
        'Added new filters in Heroes to find mods faster.',
        'Added ability to view Arcana and Immortal mods separately in the general catalog.'
      ],
    },
    {
      title: '1.1.1 launcher bug fix',
      date: '2026-07-29',
      heroSlug: 'invoker',
      meta: 'Bug fix',
      changes: [
        'Fixed launcher issues related to mod installation naming for certain categories.'
      ],
    },
    {
      title: '1.1.0 launcher update',
      date: '2026-07-28',
      heroSlug: 'juggernaut',
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
      heroSlug: 'pudge',
      meta: 'Bug fix',
      changes: [
        'Bug fix'
      ],
    },
    {
      title: '1.0.8 launcher polish',
      date: '2026-07-26',
      heroSlug: 'rubick',
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
      heroSlug: 'storm_spirit',
      meta: 'New home dashboard, clearer navigation, and smoother library controls.',
      changes: [
        'Added a refreshed home dashboard with launcher statistics and recent mods.',
        'Improved category browsing and the launcher search experience.',
        'Added support for switching language from Settings without restarting the app.'
      ],
    },
  ] : [
    {
      title: 'Версия 1.1.8',
      date: '2026-08-03',
      heroSlug: 'invoker',
      meta: 'Обновление лаунчера',
      changes: [
        'При смене языка в настройках управляемые файлы модов автоматически мигрируются в новую папку.',
        'Улучшена кнопка объединения модов: валидация и поведение стали безопаснее.',
        'Различные исправления и повышение стабильности.'
      ],
    },
    {
      title: 'Версия 1.1.7',
      date: '2026-08-03',
      heroSlug: 'abaddon',
      meta: 'Обновление лаунчера',
      changes: [
        'Полностью обновлена главная страница лаунчера.',
        'Исправлены найденные ошибки и улучшена стабильность работы.',
        'Добавлен предпросмотр видео для модов в категории «Звуки героев».',
        'Добавлены новые фильтры в категории «Герои», чтобы быстрее находить нужные моды.',
        'В общем каталоге появилась возможность отдельно просматривать Arcana и Immortal предметы.'
      ],
    },
    {
      title: 'Версия 1.1.2',
      date: '2026-07-29',
      heroSlug: 'invoker',
      meta: 'Баг фикс',
      changes: [
        'Исправлены проблемы с названиями устанавливаемых модов во всех категориях.'
      ],
    },
    {
      title: 'Версия 1.1.1',
      date: '2026-07-29',
      heroSlug: 'juggernaut',
      meta: 'Баг фикс',
      changes: [
        'Исправлены проблемы с названиями устанавливаемых модов в некоторых категориях.'
      ],
    },
    {
      title: 'Версия 1.1.0',
      date: '2026-07-28',
      heroSlug: 'pudge',
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
      heroSlug: 'rubick',
      meta: 'Баг фикс',
      changes: [
        'Баг фикс'
      ],
    },
    {
      title: 'Обновление 1.0.8',
      date: '2026-07-26',
      heroSlug: 'storm_spirit',
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
      heroSlug: 'tidehunter',
      meta: 'Новый стартовый экран, понятнее навигация и удобнее управление библиотекой.',
      changes: [
        'Добавлен обновлённый главный экран с новостями, статистикой и новыми модами.',
        'Улучшено переключение категорий и поиск по лаунчеру.',
        'Добавлена возможность менять язык в настройках без перезапуска.'
      ],
    },
  ]);
  const currentSlideIndex = Number.isInteger(state.dashboardSlide) ? state.dashboardSlide : 0;
  const slideItems = updateItems.map((item, index) => ({
    ...item,
    heroSlug: item.heroSlug || heroSlidePool[index % heroSlidePool.length],
  }));
  const activeSlide = slideItems[currentSlideIndex % slideItems.length] || slideItems[0];
  const resolveSlideArt = (slug) => {
    const hero = getHeroCatalogEntries().find((entry) => (entry.slug || '').toLowerCase() === (slug || '').toLowerCase());
    if (!hero) return null;
    const preview = resolveHeroPreview(hero);
    return preview ? previewUrl('heroes', preview) : null;
  };
  const slideArt = resolveSlideArt(activeSlide.heroSlug) || resolveSlideArt('invoker');
  const heroRows = heroEntries.map((hero, index) => {
    const preview = resolveHeroPreview(hero);
    const previewHtml = preview ? `<div class="dashboard-hero-portrait">${mediaHtml(previewUrl('heroes', preview), { hoverPlay: false })}</div>` : `<div class="dashboard-hero-portrait placeholder"><span class="ms">sports_esports</span></div>`;
    const maxCount = heroEntries[0]?.modsCount || 1;
    const percent = Math.max(16, Math.round(((hero.modsCount || 0) / maxCount) * 100));
    return `
      <button class="dashboard-hero-row" type="button" data-hero="${esc(hero.slug || hero.id || hero.name || '')}" style="--i:${Math.min(index, 12)}">
        ${previewHtml}
        <div class="dashboard-hero-info">
          <div class="dashboard-hero-name">${esc(hero.name)}</div>
          <div class="dashboard-hero-count">${hero.modsCount || 0} ${plural(hero.modsCount || 0, 'мод', 'мода', 'модов', 'mod', 'mods')}</div>
          <div class="dashboard-hero-meter"><span style="width:${percent}%"></span></div>
        </div>
      </button>`;
  }).join('');

  const popularMods = getPopularMods(5);
  const popularRows = popularMods.map((m, i) => cardHtml(m, i, true)).join('');

  const statsCards = [
    { value: totalMods, label: t('modsCount'), icon: 'extension' },
    { value: totalAuthors, label: t('authorsCount'), icon: 'person' },
    { value: categoriesCount, label: t('categoriesCount'), icon: 'apps' },
    { value: installedModsCount, label: t('installedMods'), icon: 'download_done' },
  ];
  const communityCards = [
    { name: 'Telegram', icon: 'send', hint: getLang() === 'en' ? 'Project channel' : 'Канал проекта', url: 'https://t.me/dota2skins_official' },
    { name: 'Discord', icon: 'forum', hint: getLang() === 'en' ? 'Live discussions' : 'Живые обсуждения', url: 'https://discord.gg/Cb2cQhaANY' },
  ];

  viewRoot.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-main">
        <section class="dashboard-popular">
          <div class="dashboard-section-head">
            <div>
              <div class="dashboard-eyebrow">${getLang() === 'en' ? 'Popular mods' : 'Популярные моды'}</div>
              <h2 class="dashboard-title">${getLang() === 'en' ? 'Most popular mods' : 'Топ 5 модов'}</h2>
            </div>
          </div>
          <div class="dashboard-recent-track dashboard-popular-list">
            ${popularRows || `<div class="empty-note">${t('noResults')}</div>`}
          </div>
        </section>

        <section class="dashboard-recent">
          <div class="dashboard-section-head recent-section-head">
            <div>
              <div class="dashboard-eyebrow">${getLang() === 'en' ? 'New arrivals' : 'Недавние релизы'}</div>
              <h2 class="dashboard-title">${t('recentlyAdded')}</h2>
            </div>
            <button class="btn btn-ghost recent-all-btn" id="recentWeekBtn" type="button">${t('viewAll')}</button>
          </div>
          <div class="dashboard-recent-track">
            ${recentMods.length ? recentMods.map((m, i) => cardHtml(m, i, true)).join('') : `<div class="empty-note">${t('noResults')}</div>`}
          </div>
        </section>
      </div>

      <aside class="dashboard-side">
        <section class="dashboard-stats">
          <div class="dashboard-section-head">
            <div>
              <div class="dashboard-eyebrow">${getLang() === 'en' ? 'Launcher overview' : 'Обзор лаунчера'}</div>
              <h2 class="dashboard-title">${t('dashboardStatsTitle')}</h2>
            </div>
          </div>
          <div class="dashboard-stats-grid">
            ${statsCards.map((item) => `
              <div class="dashboard-stat-card">
                <div class="dashboard-stat-icon"><span class="ms">${esc(item.icon)}</span></div>
                <div>
                  <div class="dashboard-stat-value">${esc(String(item.value))}</div>
                  <div class="dashboard-stat-label">${esc(item.label)}</div>
                </div>
              </div>`).join('')}
          </div>
        </section>

        <section class="dashboard-heroes dashboard-compact-heroes">
          <div class="dashboard-section-head">
            <div>
              <div class="dashboard-eyebrow">${getLang() === 'en' ? 'Hero roster' : 'Состав героев'}</div>
              <h2 class="dashboard-title">${getLang() === 'en' ? 'Heroes with the most mods' : 'Герои с самым большим количеством модов'}</h2>
            </div>
          </div>
          <div class="dashboard-hero-list">${heroRows}</div>
        </section>

        <section class="dashboard-community">
          <div class="dashboard-section-head">
            <div>
              <div class="dashboard-eyebrow">${getLang() === 'en' ? 'Community' : 'Сообщество'}</div>
              <h2 class="dashboard-title">${getLang() === 'en' ? 'Stay connected' : 'Оставайтесь на связи'}</h2>
            </div>
          </div>
          <div class="dashboard-community-list">
            ${communityCards.map((card) => `
              <button class="dashboard-community-card" type="button">
                <span class="dashboard-community-left">
                  <span class="dashboard-community-icon"><span class="ms">${esc(card.icon)}</span></span>
                  <span>
                    <span class="dashboard-community-name">${esc(card.name)}</span>
                    <span class="dashboard-community-hint">${esc(card.hint)}</span>
                  </span>
                </span>
                <span class="dashboard-community-arrow"><span class="ms">arrow_forward</span></span>
              </button>`).join('')}
          </div>
        </section>
      </aside>
    </div>`;

  $('#recentWeekBtn')?.addEventListener('click', () => renderRecentWeekPage());
  viewRoot.querySelectorAll('.dashboard-carousel-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const dir = Number(button.dataset.dir || 0);
      const nextIndex = ((Number.isInteger(state.dashboardSlide) ? state.dashboardSlide : 0) + dir + slideItems.length) % slideItems.length;
      state.dashboardSlide = nextIndex;
      renderDashboard();
    });
  });
  viewRoot.querySelectorAll('.dashboard-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      state.dashboardSlide = Number(dot.dataset.slide || 0);
      renderDashboard();
    });
  });
  viewRoot.querySelectorAll('.dashboard-hero-row').forEach((heroButton) => {
    heroButton.addEventListener('click', () => {
      const heroSlug = heroButton.dataset.hero;
      if (heroSlug) {
        state.view = 'catalog';
        state.activeCategory = 'heroes';
        state.search = '';
        state.filters.hero = heroSlug;
        state.filters.tags = new Set();
        state.filters.installedOnly = false;
        state.filters.group = '';
        state.filters.heroSearch = '';
        render();
      }
    });
  });
  viewRoot.querySelectorAll('.dashboard-community-card').forEach((button, index) => {
    const card = [{ url: 'https://t.me/dota2skins_official' }, { url: 'https://discord.gg/Cb2cQhaANY' }][index];
    if (card && card.url) {
      button.addEventListener('click', () => window.api.misc.openExternal(card.url));
    }
  });
  viewRoot.querySelectorAll('.dashboard-banner-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const title = button.dataset.newsTitle || '';
      const rawDate = button.dataset.newsDate || '';
      const meta = button.dataset.newsMeta || '';
      const changes = (button.dataset.newsChanges || '').split(' | ').filter(Boolean);
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

function renderSectionAll() {
  const sectionCats = TOP_SECTION_CATEGORIES[state.topSection] || [];
  const allMods = sectionCats.flatMap((catId) => categoryMods(catId).map((m) => ({ ...m, _cat: catId })));
  const tags = collectTags(allMods);
  const groups = [];
  const mods = applyFilters(allMods);
  const title = getLang() === 'en' ? 'All' : 'Все';

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${esc(title)}</h1>
      <span class="view-sub">${mods.length} ${plural(mods.length, 'мод', 'мода', 'модов', 'mod', 'mods')}</span>
    </div>
    ${toolbarHtml(mods.length, { tags, groups, categoryId: 'all' })}
    <div class="grid" id="modGrid">${mods.length ? mods.map((m, i) => cardHtml(m, i)).join('') : `<div class="empty-note">${t('noFilteredMods')}</div>`}</div>
  `;
  bindToolbar();
  bindCards(viewRoot, mods);
}

function renderHome() {
  const sectionCats = (TOP_SECTION_CATEGORIES[state.topSection] || []).filter(Boolean);
  const cats = visibleCategories().filter((c) => sectionCats.includes(c.id) || !sectionCats.length);

  viewRoot.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">${t('home')}</h1>
        <div class="view-sub">${t('categories')}</div>
      </div>
      <button class="btn btn-primary" id="homeModsBtn" type="button"><span class="ms">apps</span>${getLang() === 'en' ? 'Mods' : 'Моды'}</button>
    </div>
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

  $('#homeModsBtn')?.addEventListener('click', () => {
    state.activeCategory = 'all';
    state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '', heroFilter: new Set() };
    renderCatalog();
    $('#main').scrollTop = 0;
  });

  viewRoot.querySelectorAll('.cat-tile').forEach((t) => {
    t.addEventListener('click', () => {
      state.activeCategory = t.dataset.cat;
      state.filters = { sort: 'default', tags: new Set(), installedOnly: false, group: '', hero: '', heroSearch: '', heroFilter: new Set() };
      renderCatalog();
      $('#main').scrollTop = 0;
    });
  });
  bindCards(viewRoot);
}

// --- search results ---

function getCatalogSearchScopeCategories() {
  const sectionCats = (TOP_SECTION_CATEGORIES[state.topSection] || []).filter(Boolean);
  const visibleIds = new Set(visibleCategories().map((c) => c.id));
  const scopedCats = sectionCats.filter((id) => visibleIds.has(id));

  if (!scopedCats.length) {
    return visibleCategories().map((c) => c.id);
  }

  if (state.activeCategory && state.activeCategory !== 'all' && scopedCats.includes(state.activeCategory)) {
    return [state.activeCategory];
  }

  return scopedCats;
}

function renderSearchResults() {
  const q = state.search.trim().toLowerCase();
  const cats = getCatalogSearchScopeCategories();
  const allMods = [];
  for (const catId of cats) {
    for (const m of categoryMods(catId)) {
      if (m.name && m.name.toLowerCase().includes(q)) allMods.push({ ...m, _cat: catId });
    }
  }
  const mods = applyFilters(allMods);

  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${t('searchText')} <span class="accent">${esc(state.search.trim())}</span></h1>
      <span class="view-sub">${mods.length} ${plural(mods.length, 'мод', 'мода', 'модов', 'mod', 'mods')}</span>
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
    ? getHeroCatalogEntries().filter((h) => (h.modsCount || 0) > 0)
    : [];
  const mods = applyFilters(all, categoryId);

  const grouped = isGrouped(categoryId) && !state.filters.group && state.filters.sort === 'default';

  let gridHtml = '';
  if (categoryId === 'heroes') {
    const selectedHero = state.filters.hero || '';
    const heroFilters = state.filters.heroFilter || new Set();
    const heroSearch = (state.filters.heroSearch || '').toLowerCase();
    const heroDates = new Map();
    heroes.forEach((hero) => {
      const slug = (hero.slug || '').toLowerCase();
      const heroMods = all.filter((m) => (m.hero || '').toLowerCase() === slug);
      const latestDate = heroMods.reduce((max, m) => Math.max(max, parseDateValue(getModDateValue(m)) || 0), 0);
      heroDates.set(slug, latestDate);
    });
    let filteredHeroes = (heroSearch
      ? heroes.filter((h) => h.name.toLowerCase().includes(heroSearch))
      : heroes)
      .slice();
    const filtersKeys = [...heroFilters];
    const hasFavorites = heroFilters.has('favorites');
    const hasMostMods = heroFilters.has('most-mods') || heroFilters.has('count');
    const hasPopular = heroFilters.has('popular');
    const hasAnime = heroFilters.has('anime');
    const attributeFilters = filtersKeys.filter((key) => ['strength', 'agility', 'intelligence', 'universal'].includes(key));
    const rarityFilters = filtersKeys.filter((key) => ['immortal', 'arcana'].includes(key));

    if (hasFavorites) {
      filteredHeroes = filteredHeroes.filter((h) => state.favorites.has((h.slug || '').toLowerCase()));
    }
    if (attributeFilters.length) {
      const attributeSet = new Set(attributeFilters);
      filteredHeroes = filteredHeroes.filter((h) => attributeSet.has(getHeroAttribute(h.slug)));
    }
    if (rarityFilters.length) {
      const raritySet = new Set(rarityFilters);
      filteredHeroes = filteredHeroes.filter((h) => raritySet.has('immortal') && heroHasRarity(h, 'immortal') || raritySet.has('arcana') && heroHasRarity(h, 'arcana'));
    }
    if (hasAnime) {
      filteredHeroes = filteredHeroes.filter((h) => heroHasAnime(h));
    }
    if (hasPopular) {
      filteredHeroes.sort((a, b) => getHeroPopularity(b) - getHeroPopularity(a) || (a.name || '').localeCompare(b.name || ''));
    } else if (hasMostMods) {
      filteredHeroes.sort((a, b) => (b.modsCount || 0) - (a.modsCount || 0) || (a.name || '').localeCompare(b.name || ''));
    } else {
      filteredHeroes.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ru', { sensitivity: 'base' }));
    }
    
    if (selectedHero) {
      const heroEntry = heroes.find((h) => h.slug === selectedHero || h.name === selectedHero);
      const items = heroEntry ? getHeroModsForSlug(heroEntry.slug) : [];
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
        const favActive = state.favorites.has((hero.slug || '').toLowerCase()) ? 'active' : '';
        return `
          <div class="card hero-card" data-hero="${esc(hero.slug)}">
            ${previewHtml}
            <button class="hero-fav-btn ${favActive}" type="button" data-fav-hero="${esc(hero.slug)}" aria-label="${t('addToFavorites')}"><span class="ms">favorite</span></button>
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
      const heroEntry = getHeroCatalogEntries().find((h) => h.slug === selectedHero || h.name === selectedHero);
      if (heroEntry) {
        const items = getHeroModsForSlug(heroEntry.slug);
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
      viewRoot.querySelectorAll('.hero-fav-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavoriteHero(btn.dataset.favHero);
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
      <div class="toolbar-search">
        <span class="ms">search</span>
        <input type="text" id="globalSearchInput" placeholder="${getCatalogSearchPlaceholder()}" value="${esc(state.search || '')}">
        <button class="toolbar-search-clear" id="globalSearchClear" type="button" aria-label="${t('clear')}"><span class="ms">close</span></button>
      </div>
    `);
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
        <input type="text" id="heroSearchInput" placeholder="${getCatalogSearchPlaceholder()}" value="${esc(f.heroSearch || '')}">
      </div>`);
  }

  if (isHeroes && !f.hero) {
    toolbarParts.push(`
      <div class="hero-filter-panel ${state.heroFiltersOpen ? 'open' : ''}" id="heroFilterPanel">
        ${getHeroFilterGroups().map((group) => `
          <div class="hero-filter-group">
            <div class="hero-filter-group-title">
              <span>${esc(group.title)}</span>
              <span class="ms hero-filter-group-icon">${esc(group.icon || 'filter_alt')}</span>
            </div>
            <div class="hero-filter-group-wrap">
              ${group.keys.map((key) => `
                <button class="fchip ${(!f.heroFilter.size && key === 'all') || f.heroFilter.has(key) ? 'active' : ''}" data-hero-filter="${key}">
                  ${esc(heroFilterLabel(key))}
                </button>`).join('')}
            </div>
          </div>
        `).join('')}
        <button class="hero-filter-reset" id="heroFilterReset" type="button" data-hero-filter-reset="true">${t('clear')}</button>
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
      state.filters.heroSearch = e.target.value;
      state.heroSearchKeepFocus = true;
      heroSearchTimer = setTimeout(() => {
        renderCatalog();
      }, 180);
    });
    heroSearchInput.addEventListener('focus', () => {
      state.heroSearchKeepFocus = true;
    });
  }
  if (heroSearchInput && state.heroSearchKeepFocus && document.activeElement !== heroSearchInput) {
    requestAnimationFrame(() => {
      heroSearchInput.focus();
      const len = heroSearchInput.value.length;
      heroSearchInput.setSelectionRange(len, len);
    });
  }
  $('#installedChip')?.addEventListener('click', () => {
    state.filters.installedOnly = !state.filters.installedOnly;
    renderCatalog();
  });
  $('#heroFilterToggle')?.addEventListener('click', () => {
    state.heroFiltersOpen = !state.heroFiltersOpen;
    renderCatalog();
  });
  $('#heroFilterPanel')?.addEventListener('click', (e) => {
    if (e.target.closest('.fchip')) {
      state.heroFiltersOpen = true;
    }
  });
  document.querySelectorAll('.fchip[data-hero-filter]').forEach((c) => {
    c.addEventListener('click', () => {
      const filter = c.dataset.heroFilter || '';
      if (!state.filters.heroFilter) state.filters.heroFilter = new Set();
      if (filter === 'all') {
        state.filters.heroFilter = new Set();
      } else {
        if (state.filters.heroFilter.has(filter)) {
          state.filters.heroFilter.delete(filter);
        } else {
          state.filters.heroFilter.add(filter);
        }
      }
      renderCatalog();
    });
  });
  $('#heroFilterReset')?.addEventListener('click', () => {
    state.filters.heroFilter = new Set();
    state.heroFiltersOpen = false;
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
  const previewAction = resolvePreviewAction(cat, m);
  const previewCandidate = m.preview || m.imageUrl || m.thumbnail || (m.styles?.[0]?.preview);
  const previewImageUrl = previewCandidate ? previewUrl(cat, previewCandidate) : null;
  const prev = previewAction?.kind === 'media'
    ? (isVideo(previewAction.url) ? { url: previewAction.url, poster: previewImageUrl } : previewAction.url)
    : previewUrl(cat, previewCandidate);
  const installed = isInstalled(cat, m);
  const isPack = m.type === 'pack';
  const external = !installTarget(m) && !m.styles && !isPack;
  const tags = normalizeTags(m.tags).slice(0, 3);
  const author = (m.author || m.sender || '').trim();
  const hideAuthor = author && ['Unknown', 'Anonymous'].includes(author);
  const authorProfile = (state.catalog?.constants?.AUTHOR_PROFILES || []).find((entry) => entry.displayName.toLowerCase() === author.toLowerCase() || entry.id.toLowerCase() === author.toLowerCase());
  const authorAvatar = authorProfile?.avatarUrl ? `<img class="author-chip-avatar" src="${esc(authorProfile.avatarUrl)}" alt="${esc(author)}">` : '<span class="ms">person</span>';
  const badgeType = getModBadgeType(m);
  const badgeHtml = badgeType ? `<div class="card-badge card-badge-${badgeType}">${esc(badgeLabelForType(badgeType))}</div>` : '';
  const key = keyOf(cat, m.name, null);
  const isSelected = state.selectedModKey && state.selectedModKey === key;
  const cardClass = `card${installed ? ' has-installed' : ''}${isSelected ? ' is-selected' : ''}`;
  const installedIcon = installed ? `<span class="card-installed" aria-label="${t('installed')}"><span class="ms">check_circle</span></span>` : '';
  const packCount = Array.isArray(m.mods)
    ? m.mods.length
    : (typeof m.mods === 'number' && Number.isFinite(m.mods) ? m.mods : null);
  const packTagHtml = isPack && Number.isFinite(packCount) && packCount > 0
    ? `<span class="mtag">${t('pack') || 'Pack'} · ${packCount}</span>`
    : '';
  const tagChips = [packTagHtml, m._custom ? `<span class="mtag custom">${t('customPack')}</span>` : '', external ? `<span class="mtag">${t('link') || 'Link'}</span>` : '', ...tags.map((t) => `<span class="mtag">${esc(tagLabel(cat, t))}</span>`)].filter(Boolean).join('');
  const mediaTagsHtml = tagChips ? `<div class="media-tags">${tagChips}</div>` : '';
  const downloadCount = Number(m.downloads ?? m.downloadCount ?? m.downloadsCount ?? 0);
  const downloadHtml = Number.isFinite(downloadCount) && downloadCount > 0
    ? `<span class="card-meta-pill"><span class="ms">cloud_download</span>${esc(downloadCount.toLocaleString(getLang()))}</span>`
    : '';
  const dateValue = getModDateValue(m);
  return `
    <div class="${cardClass}" data-key="${esc(key)}" style="--i:${Math.min(i, 28)}">
      <div class="card-media">
        ${mediaHtml(prev, { hoverPlay: true })}
        ${badgeHtml}
        ${installedIcon}
        ${previewAction ? `<button class="card-preview-btn" data-play="${esc(previewAction.url)}" data-kind="${esc(previewAction.kind)}" data-title="${esc(m.name)}" aria-label="${t('preview')}"><span class="ms">visibility</span></button>` : ''}
        ${mediaTagsHtml}
        ${m.styles ? `
          <div class="media-swatches">
            ${m.styles.slice(0, 5).map((s) => `<span class="swatch-dot" style="background:${esc(s.color || '#a78bfa')}"></span>`).join('')}
          </div>` : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${esc(m.name)}</div>
        <div class="card-info">
          ${author && !hideAuthor ? `<button class="author-chip ${authorProfile ? 'clickable' : ''}" data-author-id="${esc(authorProfile?.id || '')}" type="button">${authorAvatar}${esc(author)}</button>` : '<span class="card-info-empty"></span>'}
          <div class="card-meta">
            ${dateValue ? `<span class="card-meta-pill card-meta-date"><span class="ms">event</span>${esc(fmtDate(dateValue))}</span>` : ''}
            ${downloadHtml}
          </div>
        </div>
      </div>
    </div>`;
}

function bindCards(root, modsList) {
  root.querySelectorAll('.card[data-key]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.author-chip') || e.target.closest('.card-preview-btn')) return;
      state.selectedModKey = card.dataset.key;
      root.querySelectorAll('.card[data-key]').forEach((item) => {
        item.classList.toggle('is-selected', item === card);
      });
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

const AUTHOR_REVIEWS = {
  arthas: [
    { reviewer: 'Frusy', rating: 5, date: '21 июля', text: 'Попросил у него сделать скин на тинкера, сделал все быстро и четко, отзывчивый чел, быстро отвечает, показал все на демке и сделал все так, как надо. Спасибо ему большое!' },
    { reviewer: 'Anonymous', rating: 5, date: '29 июля', text: 'спасибо , просто братик зашел решил проблему все отлично , просто 5⭐️' },
    { reviewer: 'cvrsxd', rating: 4, date: '2 августа', text: 'спасибо огромное этому человеку , однозначно + реп за то что создал скин мечты советую брать ,потом куплю еще' },
    { reviewer: 'wwq', rating: 4.5, date: '11 августа', text: 'все ахуенно сделал братик, пасиба' }
  ],
  tenkay: [
    { reviewer: 'Anonymous', rating: 4.5, date: '9 августа', text: 'красавчик сделал сет фастом, спасибо большое типу, советую' },
    { reviewer: 'Игорь', rating: 5, date: '12 июля', text: 'Попросил парня сделать мне аркану на войда с иморталками , сделал все быстро и четко  ,все работает идеально . спасибо за работу .' }
  ],
  senop: [
    { reviewer: 'Anonymous', rating: 4.5, date: '', text: 'Хороший человек, быстро все сделал! В будущем буду покупать еще. Покупайте не пожалеете.' }
  ],
  ceomods: [
    { reviewer: 'crysumi', rating: 5, date: '9 августа', text: 'Заказал одного из своих любимых чаров, а именно кримсон минералку, не в первый раз заказываю кастом сет и все как обично -> на высоте, хз пацы обращайтесь к дикарю, точно не пожалеете)\n\ngl' },
    { reviewer: 'Anonymous', rating: 5, date: '11 августа', text: '+rep Лучший мододел, очень быстро,+ приватка с топ сетами бонусом' },
    { reviewer: 'Indiffirent', rating: 5, date: '10 августа', text: 'Быстро ответил, быстро выполнил работу, все качество и чётко, цена не большая. Приобрёл 1 сетик, плюсом получил доступ к кастомным приватный сетам' }
  ],
  mopsyara: [
    { reviewer: 'Игорь', rating: 4, date: '20 июля', text: 'Очень отзывчивый , делает сеты быстро , если нужно что то поменять сразу это делает , сеты выглядят шикарно, спасибо большое' },
    { reviewer: 'Самыйдобрый', rating: 4, date: '31 июля', text: 'Отзывчивый быстро чёт сделал не багается есле нужно что то поменять меняет' },
    { reviewer: 'Игорь', rating: 5, date: '4 августа', text: 'Сделал сет красиво , хоть он и был довольно таким трудным в исполнении , сделал все четенько , красиво , в свой тайминг  ,при мини проблеме сразу ответил и помог .' }
  ]
};

function getAuthorReviews(author) {
  if (!author) return [];
  const staticReviews = AUTHOR_REVIEWS[author.id] || AUTHOR_REVIEWS[author.displayName?.toLowerCase()];
  const authorReviews = Array.isArray(author.reviews) ? author.reviews : [];
  return [...authorReviews, ...(staticReviews || [])];
}

function getAuthorReviewsLabel(author) {
  const count = getAuthorReviews(author).length;
  return `${t('reviews')} (${count})`;
}

function renderReviewStars(rating = 0) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating - fullStars >= 0.5;
  let stars = Array.from({ length: 5 }, (_, index) => {
    if (index < fullStars) return '<span class="star filled">★</span>';
    if (index === fullStars && hasHalf) return '<span class="star half">★</span>';
    return '<span class="star empty">★</span>';
  }).join('');
  return `<span class="review-stars">${stars}</span>`;
}

function openAuthorReviewsModal(author) {
  if (!author) return;
  const reviews = getAuthorReviews(author);
  const modalHtml = `
    <div class="review-modal">
      <div class="review-modal-header">
        <div class="review-modal-title">${t('reviews')}</div>
        <button class="modal-close" id="reviewModalClose" aria-label="${t('close')}"><span class="ms">close</span></button>
      </div>
      <div class="review-modal-list">
        ${reviews.length ? reviews.map((review) => {
          const reviewer = review.reviewer || 'Anonymous';
          const dateText = review.date ? `<span class="review-date">${esc(review.date)}</span>` : '';
          return `
            <div class="author-review-row">
              <div class="author-review-avatar"><span class="ms">person</span></div>
              <div class="author-review-body">
                <div class="author-review-topline">
                  <div class="author-review-meta">
                    <span class="author-review-name">${esc(reviewer)}</span>
                    ${renderReviewStars(review.rating)}
                    ${dateText}
                  </div>
                </div>
                <div class="author-review-text">${esc(review.text || '')}</div>
              </div>
            </div>
          `;
        }).join('') : `<div class="empty-note">${t('noReviews')}</div>`}
      </div>
      <div class="review-modal-footer">
        <button class="btn btn-primary review-submit-btn" type="button" data-review-link="https://discord.gg/yaB9PF7zFC">${t('leaveReview')}</button>
      </div>
    </div>
  `;

  $('#modalContent').innerHTML = modalHtml;
  $('#modalOverlay').classList.remove('hidden');
  $('#reviewModalClose')?.addEventListener('click', closeModal);
  const submitBtn = $('#modalContent .review-submit-btn');
  submitBtn?.addEventListener('click', () => {
    const reviewLink = submitBtn.dataset.reviewLink || 'https://discord.gg/yaB9PF7zFC';
    window.open(reviewLink, '_blank', 'noopener,noreferrer');
  });
  $('#modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === $('#modalOverlay')) closeModal();
  });
}

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
  const showCourierNotice = COURIER_EFFECT_MODS.has((mod?.name || '').trim().toLowerCase());
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
  const previewImageUrl = cur.preview || mod.preview ? previewUrl(categoryId, cur.preview || mod.preview) : null;
  const mediaUrl = previewAction?.kind === 'media' || previewAction?.kind === 'audio'
    ? (isVideo(previewAction.url) ? { url: previewAction.url, poster: previewImageUrl } : previewAction.url)
    : previewUrl(categoryId, cur.preview || mod.preview);

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
  const badgeType = getModBadgeType(mod, styleLabel);
  const modalBadge = badgeType ? `<div class="modal-badge modal-badge-${badgeType}">${esc(badgeLabelForType(badgeType))}</div>` : '';
  const downloadCount = Number(mod.downloads ?? mod.downloadCount ?? mod.downloadsCount ?? 0);
  const downloadOverlay = Number.isFinite(downloadCount) && downloadCount > 0
    ? `<div class="modal-downloads"><span class="ms">cloud_download</span>${esc(downloadCount.toLocaleString(getLang()))}</div>`
    : '';

  // pack contents (with per-session exclusions)
  if (isPack && !modalState.packExcluded) modalState.packExcluded = new Set();
  const members = isPack ? packMembers(mod) : [];
  const activeCount = isPack ? members.filter((x) => !modalState.packExcluded.has(x.name)).length : 0;

  $('#modalContent').innerHTML = `
    <div class="modal-media">
      ${mediaHtml(mediaUrl, { autoplay: true })}
      ${modalBadge}
      ${downloadOverlay}
      <button class="modal-close" id="modalCloseBtn" aria-label="Закрыть"><span class="ms">close</span></button>
      ${previewAction ? `
        <button class="preview-toggle" id="previewPlayBtn">
          <span class="ms">play_circle</span>${t('preview')}
        </button>` : ''}
    </div>
    <div class="modal-body">
      <div class="modal-title-row">
        <div class="modal-title">${esc(mod.name)}</div>
        ${showCourierNotice ? `<button class="btn btn-sm btn-ghost" id="courierInfoBtn" type="button" title="${esc(t('tools'))}"><span class="ms">help_outline</span></button>` : ''}
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
  const courierInfoBtn = $('#courierInfoBtn');
  if (courierInfoBtn) {
    courierInfoBtn.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-box" style="max-width:560px">
          <div class="modal-header">
            <h2 class="modal-title">${esc(t('tools'))}</h2>
            <button class="modal-close" aria-label="${t('close')}"><span class="ms">close</span></button>
          </div>
          <div class="modal-body">
            <div class="modal-note" style="white-space:pre-line;line-height:1.6">${esc(COURIER_EFFECT_NOTICE[getLang()] || COURIER_EFFECT_NOTICE.en)}</div>
          </div>
        </div>`;
      overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    });
  }
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
  const selectedLibrary = new Set();
  const librarySort = state.librarySort || 'default';
  const librarySections = [
    { id: 'all', label: getLang() === 'en' ? 'All' : 'Все' },
    { id: 'heroes', label: getLang() === 'en' ? 'Heroes' : 'Герои' },
    { id: 'world', label: getLang() === 'en' ? 'World' : 'Мир' },
    { id: 'interface', label: getLang() === 'en' ? 'Interface' : 'Интерфейс' },
    { id: 'effects', label: getLang() === 'en' ? 'Effects' : 'Эффекты' },
    { id: 'other', label: getLang() === 'en' ? 'Other' : 'Остальное' },
  ];
  const getSectionCategoryIds = (sectionId) => {
    switch (sectionId) {
      case 'heroes': return ['heroes'];
      case 'world': return ['couriers', 'terrains', 'trees', 'roshan', 'ancient', 'creeps', 'river', 'tormentor', 'wards', 'towers', 'high-five', 'emblems'];
      case 'interface': return ['packs', 'versus-screens', 'announcers', 'ranks', 'sounds', 'huds', 'mega-kill', 'wards', 'cursors', 'backgrounds'];
      case 'effects': return ['item-effects', 'shaders', 'creep-deny', 'ranged-attack'];
      case 'other': return ['pedestal', 'optimization', 'item-icons', 'other', 'hero-sounds'];
      default: return [];
    }
  };
  viewRoot.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">${t('library')}</h1>
    </div>
    <div class="lib-toolbar">
      <input class="input lib-search" id="librarySearchInput" placeholder="${t('searchHeroes')}" value="${esc(state.librarySearch || '')}">
      <span class="lib-stats">${installed.length} ${plural(installed.length, 'мод', 'мода', 'модов', 'mod', 'mods')} · ${enabledCount} ${getLang() === 'en' ? 'enabled' : 'включено'}</span>
      <div class="select-wrap lib-sort-wrap">
        <span class="ms">sort</span>
        <select id="librarySortSelect">
          <option value="default" ${librarySort === 'default' ? 'selected' : ''}>${getLang() === 'en' ? 'Default' : 'По умолчанию'}</option>
          <option value="name" ${librarySort === 'name' ? 'selected' : ''}>${getLang() === 'en' ? 'Name A-Z' : 'По имени А-Я'}</option>
          <option value="name-desc" ${librarySort === 'name-desc' ? 'selected' : ''}>${getLang() === 'en' ? 'Name Z-A' : 'По имени Я-А'}</option>
          <option value="date" ${librarySort === 'date' ? 'selected' : ''}>${getLang() === 'en' ? 'Newest first' : 'Сначала новые'}</option>
        </select>
      </div>
      <button class="btn btn-sm" id="enableSelectedBtn" disabled>${t('enableSelected')}</button>
      <button class="btn btn-sm" id="disableSelectedBtn" disabled>${t('disableSelected')}</button>
      <button class="btn btn-sm" id="mergeSelectedModsBtn" disabled>${t('mergeSelectedMods')}</button>
      <button class="btn btn-sm btn-danger" id="removeSelectedModsBtn" disabled>${t('removeSelectedMods')}</button>
      <button class="btn btn-sm" id="enableAllBtn">${t('enableAll')}</button>
      <button class="btn btn-sm" id="disableAllBtn">${t('disableAll')}</button>
      <button class="btn btn-sm btn-danger" id="removeAllModsBtn">${t('removeAllMods')}</button>
      <button class="btn btn-sm" id="openFolderBtn2"><span class="ms">folder_open</span>${t('openModsFolder')}</button>
    </div>
    <div class="section-subnav" id="librarySectionSubnav">
      ${librarySections.map((section) => `<button class="section-chip ${(state.librarySection || 'all') === section.id ? 'active' : ''}" data-library-section="${esc(section.id)}" type="button">${esc(section.label)}</button>`).join('')}
    </div>
    <div class="lib-list" id="libList"></div>
    ${external.length ? `
      <div class="section-h" style="margin-top:26px"><span class="ms">folder_zip</span>${t('externalFiles')}</div>
      <div style="color:var(--text-muted);font-size:12.5px;margin-bottom:10px">${t('externalFilesNote')}</div>
      <div class="lib-list" id="extList"></div>` : ''}
  `;

  function sortLibraryMods(list) {
    const sorted = [...list];
    switch (state.librarySort || 'default') {
      case 'name': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'date': return sorted.sort((a, b) => (b.installedAt || 0) - (a.installedAt || 0));
      default: return sorted;
    }
  }

  function updateLibraryList() {
    const query = (state.librarySearch || '').trim().toLowerCase();
    const currentSection = state.librarySection || 'all';
    const sectionCategoryIds = new Set(getSectionCategoryIds(currentSection));
    let filteredInstalled = installed.filter((rec) => {
      const matchesQuery = !query || rec.name.toLowerCase().includes(query);
      const matchesSection = currentSection === 'all' || sectionCategoryIds.has(rec.categoryId);
      return matchesQuery && matchesSection;
    });
    filteredInstalled = sortLibraryMods(filteredInstalled);
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
        <div class="lib-select">
          <input type="checkbox" class="lib-checkbox" data-id="${rec.id}" ${selectedLibrary.has(rec.id) ? 'checked' : ''}>
        </div>
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

      row.querySelectorAll('.lib-checkbox').forEach((cb) => {
        cb.addEventListener('change', () => {
          const id = cb.dataset.id;
          if (cb.checked) selectedLibrary.add(id);
          else selectedLibrary.delete(id);
          updateToolbarState();
        });
      });

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

  function updateToolbarState() {
    const selectedCount = selectedLibrary.size;
    $('#enableSelectedBtn').disabled = !selectedCount;
    $('#disableSelectedBtn').disabled = !selectedCount;
    $('#mergeSelectedModsBtn').disabled = selectedCount < 2;
    $('#removeSelectedModsBtn').disabled = !selectedCount;
  }

  $('#librarySearchInput')?.addEventListener('input', (e) => {
    state.librarySearch = e.target.value;
    updateLibraryList();
  });
  $('#librarySortSelect')?.addEventListener('change', (e) => {
    state.librarySort = e.target.value;
    updateLibraryList();
  });
  document.querySelectorAll('#librarySectionSubnav .section-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.librarySection = chip.dataset.librarySection || 'all';
      updateLibraryList();
      document.querySelectorAll('#librarySectionSubnav .section-chip').forEach((btn) => btn.classList.toggle('active', btn === chip));
    });
  });
  $('#enableSelectedBtn').addEventListener('click', () => {
    const selected = installed.filter((rec) => selectedLibrary.has(rec.id));
    bulkToggle(selected, true);
  });
  $('#disableSelectedBtn').addEventListener('click', () => {
    const selected = installed.filter((rec) => selectedLibrary.has(rec.id));
    bulkToggle(selected, false);
  });
  $('#mergeSelectedModsBtn').addEventListener('click', async () => {
    const selected = installed.filter((rec) => selectedLibrary.has(rec.id));
    if (!selected.length) return;
    if (!await confirmDialog(t('mergeSelectedConfirm'))) return;
    const r = await window.api.mods.mergeSelected(selected.map((rec) => rec.id));
    if (r.error) toast(r.error, 'error');
    else toast('Объединено', 'ok');
    renderLibrary();
    refreshInstalledIndex();
  });
  $('#removeSelectedModsBtn').addEventListener('click', async () => {
    const selected = installed.filter((rec) => selectedLibrary.has(rec.id));
    if (!selected.length) return;
    if (!await confirmDialog(t('removeSelectedConfirm'))) return;
    let removed = 0;
    let failed = 0;
    for (const rec of selected) {
      const r = await window.api.mods.remove(rec.id);
      if (r?.error) failed += 1;
      else {
        removed += 1;
        selectedLibrary.delete(rec.id);
      }
    }
    if (failed) toast(t('removeAllResult').replace('{removed}', removed).replace('{failed}', failed), 'warn');
    else toast(t('removeAllDone').replace('{count}', removed), 'ok');
    renderLibrary();
    refreshInstalledIndex();
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
  updateToolbarState();

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
            <div class="author-name-row">
              <h1 class="view-title">${esc(author.displayName)}</h1>
              <button id="authorReviewsBtn" class="btn btn-sm btn-ghost author-reviews-btn" type="button" data-author-id="${esc(author.id)}">${getAuthorReviewsLabel(author)}</button>
            </div>
            <div class="author-profile-meta"></div>
            <div class="author-links">
              ${Object.entries(author.links || {}).filter(([, url]) => url).map(([type, url]) => `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(type)}</a>`).join('')}
              ${(author.authorLink && author.id !== 'nahuitosay') ? `<a href="${esc(author.authorLink)}" target="_blank" rel="noreferrer">${t('authorSite')}</a>` : ''}
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
    $('#authorReviewsBtn')?.addEventListener('click', () => {
      openAuthorReviewsModal(author);
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

  // sort authors by mod count (descending)
  const sortedAuthors = [...authors].sort((a, b) => countAuthorMods(b) - countAuthorMods(a));

  viewRoot.innerHTML = `
    <div class="view-header"><h1 class="view-title">${t('authorsTitle')}</h1></div>
    ${sortedAuthors.length ? `
      <div class="tool-grid">
        ${sortedAuthors.map((author, i) => {
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
    <div class="tool-note">${t('toolsInDevelopment')}</div>
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
      <p style="margin-top:10px;color:var(--text-muted);font-size:13px">Dota2Skins Manager создан и развивается одним разработчиком</p>
      <div style="margin-top:12px">
        <button id="papapodzaborniyBtn" class="btn btn-ghost" style="display:flex;align-items:center;padding:6px 10px">
          <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/papapodzaborniy.jpg" alt="papapodzaborniy" style="width:28px;height:28px;border-radius:6px;margin-right:8px;object-fit:cover">
          Papapodzaborniy
        </button>
      </div>
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

  // Papapodzaborniy button handler — opens modal with links
  const papBtn = document.getElementById('papapodzaborniyBtn');
  if (papBtn) {
    papBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const content = `
        <div class="author-modal" style="padding:18px;max-width:420px;min-width:260px">
          <button class="modal-close" aria-label="${t('close')}"><span class="ms">close</span></button>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
            <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/papapodzaborniy.jpg" style="width:56px;height:56px;border-radius:10px;object-fit:cover">
            <div>
              <div style="font-weight:800">Papapodzaborniy</div>
              <div style="font-size:13px;color:var(--text-muted)">Разработчик и контрибьютор</div>
            </div>
          </div>
          <div class="social-grid">
            <a class="social-btn" href="https://t.me/papapodzaborniy2" target="_blank" rel="noopener noreferrer">
              <span class="social-icon">✈</span>
              <span>Telegram</span>
            </a>
            <a class="social-btn" href="https://www.youtube.com/@papapodzaborniy" target="_blank" rel="noopener noreferrer">
              <span class="social-icon">▶</span>
              <span>YouTube</span>
            </a>
            <a class="social-btn" href="https://github.com/artem-prime42" target="_blank" rel="noopener noreferrer">
              <span class="social-icon"></span>
              <span>GitHub</span>
            </a>
          </div>
        </div>`;
      const overlay = document.getElementById('modalOverlay');
      const modalContent = document.getElementById('modalContent');
      if (overlay && modalContent) {
        modalContent.innerHTML = content;
        overlay.classList.remove('hidden');
        // attach close handler
        overlay.querySelector('.modal-close')?.addEventListener('click', () => overlay.classList.add('hidden'));
      } else {
        window.api.misc.openExternal('https://t.me/papapodzaborniy2');
      }
    });
  }
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
    </div>

    <div class="settings-block">
      <h3>${t('dotaPath')}</h3>
      <div class="settings-row">
        <span class="mono" style="flex:1">${esc(s.dotaGamePath || (getLang() === 'en' ? 'not found' : 'не найден'))}</span>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          <button class="btn btn-sm" id="browsePathBtn">${t('browsePath')}</button>
          <span class="dot ${s.dotaPathValid ? 'ok' : 'bad'}"></span>
        </div>
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
            <!-- options populated dynamically -->
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

    <div class="settings-grid" style="display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); margin-top:4px;">
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
    </div>

    <div class="settings-grid" style="display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); margin-top:4px;">
      <div class="settings-block" style="animation-delay:240ms">
        <h3>${t('appearance')}</h3>
        <div class="settings-row">
          <span class="settings-label">${t('languageLabel')}</span>
          <select class="input" id="uiLangSelect2" style="min-width:140px">
            <option value="ru" ${s.appLanguage === 'ru' ? 'selected' : ''}>${t('russian')}</option>
            <option value="en" ${s.appLanguage === 'en' ? 'selected' : ''}>${t('english')}</option>
          </select>
        </div>
        <div class="settings-row" style="justify-content:space-between;align-items:center;">
          <span class="settings-label">${t('autoUpdate')}</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:12px;color:${s.autoUpdateEnabled !== false ? 'var(--primary-soft)' : 'var(--text-muted)'}">${s.autoUpdateEnabled !== false ? t('enabled') : t('disabled')}</span>
            <button class="toggle ${s.autoUpdateEnabled !== false ? 'on' : ''}" id="autoUpdateToggle" type="button" aria-pressed="${s.autoUpdateEnabled !== false}"></button>
          </div>
        </div>
      </div>

      <div class="settings-block" style="animation-delay:300ms">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px">
          <h3 style="margin:0">${t('about')}</h3>
          <span class="about-hero-version">v${esc(appVersion)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px">
          <span style="color:var(--text-muted);font-size:13px">${t('developer')}</span>
          <button id="papapodzaborniyBtn" class="btn btn-sm">Papapodzaborniy</button>
        </div>
        <p style="margin-top:6px;color:var(--text-muted);font-size:13px">${t('basedOnProject')} <a href="https://github.com/TheFleece/dota2-mod-manager" target="_blank" rel="noopener noreferrer">Dota 2 Mod Manager</a></p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
          <button id="checkUpdatesBtn" class="btn btn-sm">${t('checkUpdates')}</button>
        </div>
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
  $('#uiLangSelect2')?.addEventListener('change', async (e) => {
    await window.api.settings.set('appLanguage', e.target.value);
    renderSettings();
  });
  $('#autoUpdateToggle')?.addEventListener('click', async () => {
    const enabled = !($('#autoUpdateToggle').classList.contains('on'));
    $('#autoUpdateToggle').classList.toggle('on', enabled);
    $('#autoUpdateToggle').setAttribute('aria-pressed', String(enabled));
    await window.api.settings.set('autoUpdateEnabled', enabled);
    renderSettings();
  });
  $('#checkUpdatesBtn')?.addEventListener('click', async () => {
    try {
      const result = await window.api.update.check();
      if (result?.ok) toast(t('checkingUpdates'), 'ok', 4000);
      else toast(result?.error || t('failedUpdates'), 'warn', 5000);
    } catch (err) {
      toast(t('failedUpdates'), 'warn', 5000);
    }
  });
  $('#papapodzaborniyBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const content = `
      <div class="author-modal" style="padding:18px;max-width:420px;min-width:260px">
        <button class="modal-close" aria-label="${t('close')}"><span class="ms">close</span></button>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
          <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/papapodzaborniy.jpg" style="width:56px;height:56px;border-radius:10px;object-fit:cover">
          <div>
            <div style="font-weight:800">Papapodzaborniy</div>
            <div style="font-size:13px;color:var(--text-muted)">${t('developerRole')}</div>
          </div>
        </div>
        <div class="social-grid">
          <a class="social-btn" href="https://t.me/papapodzaborniy2" target="_blank" rel="noopener noreferrer">
            <span class="social-icon">✈</span>
            <span>Telegram</span>
          </a>
          <a class="social-btn" href="https://www.youtube.com/@papapodzaborniy" target="_blank" rel="noopener noreferrer">
            <span class="social-icon">▶</span>
            <span>YouTube</span>
          </a>
          <a class="social-btn" href="https://github.com/artem-prime42" target="_blank" rel="noopener noreferrer">
            <span class="social-icon"></span>
            <span>GitHub</span>
          </a>
        </div>
      </div>`;
    const overlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    if (overlay && modalContent) {
      modalContent.innerHTML = content;
      overlay.classList.remove('hidden');
      overlay.querySelector('.modal-close')?.addEventListener('click', () => overlay.classList.add('hidden'));
    }
  });
  const pickDotaPath = async () => {
    const r = await window.api.settings.browseDota();
    if (r?.error) toast(r.error, 'error');
    if (r?.path) toast(t('pathSaved'));
    renderSettings();
    refreshSidebarStatus();
  };
  const openDotaPath = async () => {
    const p = state.settings?.dotaGamePath;
    if (!p) {
      toast(t('notFoundSettings'), 'warn');
      return;
    }
    const result = await window.api.misc.openPath(p);
    if (result?.error) toast(result.error, 'error');
  };
  $('#browsePathBtn')?.addEventListener('click', openDotaPath);
  $('#browseBtn').addEventListener('click', pickDotaPath);
  // populate language folder options dynamically
  (async () => {
    const listRes = await window.api.misc.listLangFolders();
    const select = $('#langSelect');
    if (!select) return;
    // clear existing
    select.innerHTML = '';
    const folders = Array.isArray(listRes?.folders) ? listRes.folders : [];
    const defaults = folders.length ? folders : ['russian', 'english', 'minify', 'test'];
    for (const v of defaults) {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = `dota_${v}`;
      if (s.langSuffix === v) opt.selected = true;
      select.appendChild(opt);
    }
    if (folders.length === 0) {
      // ensure current setting is present
      if (s.langSuffix && !defaults.includes(s.langSuffix)) {
        const opt = document.createElement('option');
        opt.value = s.langSuffix;
        opt.textContent = `dota_${s.langSuffix}`;
        opt.selected = true;
        select.appendChild(opt);
      }
    }
  })();
  $('#langSelect')?.addEventListener('change', async (e) => {
    await window.api.settings.set('langSuffix', e.target.value);
    toast(t('modsFolderHint').replace('{lang}', e.target.value), 'warn', 6000);
    renderSettings();
    refreshSidebarStatus();
  });
  $('#uiLangSelect')?.addEventListener('change', async (e) => {
    await window.api.settings.set('appLanguage', e.target.value);
    toast(t('appLanguageSaved'), 'success');
    renderSettings();
  });
  $('#copyLaunchBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(`-language ${s.langSuffix}`);
    toast(t('copiedToClipboard'));
  });
  $('#clearCacheBtn')?.addEventListener('click', async () => {
    try {
      const res = await window.api.misc.clearCache();
      toast(t('cacheCleared'));
      renderSettings();
    } catch (err) {
      toast(t('failedUpdates'), 'warn');
    }
  });
  $('#refreshCatBtn2')?.addEventListener('click', async () => {
    try {
      await loadCatalog(true);
      renderSettings();
    } catch (err) {
      toast(t('catalogLoadError'), 'warn');
    }
  });
  $('#srcLink')?.addEventListener('click', () => window.api.misc.openExternal('https://dota2skins.vercel.app/'));
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
  const dotEl = $('#dotaStatusDot');
  const txtEl = $('#dotaStatusText');
  if (!dotEl || !txtEl) return;

  try {
    const s = await window.api.settings.get();
    state.settings = s;
    if (s?.dotaPathValid) {
      dotEl.className = 'dot ok';
      txtEl.textContent = `${t('dotaConnected')} · dota_${s.langSuffix || 'english'}`;
    } else {
      dotEl.className = 'dot bad';
      txtEl.textContent = t('dotaNotFound');
    }
  } catch (e) {
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

window.api.update.onUpdate(async (evt) => {
  removeUpdateBar();
  if (evt.type === 'available') {
    try {
      await refreshInstalledIndex();
      if (state.view === 'library') renderLibrary();
      else if (state.view === 'catalog') renderCatalog();
      else render();
    } catch {
      /* noop */
    }
    const bar = document.createElement('div');
    bar.className = 'update-bar';
    bar.innerHTML = `
      <span class="ms">system_update_alt</span>
      <span>${t('updateAvailable')} <b>v${esc(evt.version)}</b>. ${t('downloadingAutomatically')}</span>
      <button class="btn btn-sm btn-ghost" id="updateLaterBtn">${t('later')}</button>`;
    document.body.appendChild(bar);
    bar.querySelector('#updateLaterBtn').addEventListener('click', () => bar.remove());
  } else if (evt.type === 'downloaded') {
    try {
      await refreshInstalledIndex();
      if (state.view === 'library') renderLibrary();
      else if (state.view === 'catalog') renderCatalog();
      else render();
    } catch {
      /* noop */
    }
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
    try {
      await refreshInstalledIndex();
      if (state.view === 'library') renderLibrary();
      else if (state.view === 'catalog') renderCatalog();
      else render();
    } catch {
      /* noop */
    }
    toast(t('noUpdates'), 'ok', 4000);
  } else if (evt.type === 'error') {
    try {
      await refreshInstalledIndex();
      if (state.view === 'library') renderLibrary();
      else if (state.view === 'catalog') renderCatalog();
      else render();
    } catch {
      /* noop */
    }
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
