const REGIONS = [
  {
    id: 'paris',
    name: 'Paris',
    subtitle: 'The capital — greetings & everyday life',
    flag: '🗼',
    masteryReq: 0,
    categories: ['greetings', 'numbers', 'house'],
    mapX: 50, mapY: 32,
  },
  {
    id: 'normandy',
    name: 'Normandy',
    subtitle: 'Rolling countryside — verbs & the home',
    flag: '🏰',
    masteryReq: 10,
    categories: ['house', 'verbs'],
    mapX: 32, mapY: 22,
  },
  {
    id: 'brittany',
    name: 'Brittany',
    subtitle: 'Wild coast — family & traditions',
    flag: '⚓',
    masteryReq: 20,
    categories: ['family', 'greetings'],
    mapX: 18, mapY: 40,
  },
  {
    id: 'provence',
    name: 'Provence',
    subtitle: 'Markets & sunshine — food & flavours',
    flag: '🌻',
    masteryReq: 35,
    categories: ['food', 'family'],
    mapX: 65, mapY: 75,
  },
  {
    id: 'alps',
    name: 'The Alps',
    subtitle: 'Summit challenge — master all words',
    flag: '🏔️',
    masteryReq: 50,
    categories: ['greetings', 'numbers', 'house', 'food', 'family', 'verbs'],
    mapX: 76, mapY: 58,
  },
];

function getMasteredCount() {
  const strengths = getLocal('strengths') || {};
  return Object.values(strengths).filter(e => e.strength >= 80).length;
}

function getUnlockableRegions(masteredCount, alreadyUnlockedIds) {
  return REGIONS.filter(r =>
    !alreadyUnlockedIds.includes(r.id) && masteredCount >= r.masteryReq
  );
}

function getRegionWords(regionId) {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return [];
  return VOCABULARY.filter(w => region.categories.includes(w.category));
}
