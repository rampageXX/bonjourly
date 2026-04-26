const AVATAR_ITEMS = [
  // Common — point milestones
  { id: 'beret',        name: 'Beret',          emoji: '🎩', slot: 'hat',       rarity: 'common',    costPts: 500,   streakReq: null },
  { id: 'striped_top',  name: 'Breton Stripe',  emoji: '👕', slot: 'top',       rarity: 'common',    costPts: 1000,  streakReq: null },
  { id: 'baguette',     name: 'Baguette',       emoji: '🥖', slot: 'accessory', rarity: 'common',    costPts: 1500,  streakReq: null },
  { id: 'beret_red',    name: 'Red Beret',      emoji: '🎭', slot: 'hat',       rarity: 'common',    costPts: 2000,  streakReq: null },
  { id: 'espadrilles',  name: 'Espadrilles',    emoji: '👡', slot: 'shoes',     rarity: 'common',    costPts: 2500,  streakReq: null },

  // Rare — higher milestones
  { id: 'waiter_top',   name: 'Café Apron',     emoji: '🥗', slot: 'top',       rarity: 'rare',      costPts: 5000,  streakReq: null },
  { id: 'beret_gold',   name: 'Gold Beret',     emoji: '⭐', slot: 'hat',       rarity: 'rare',      costPts: 8000,  streakReq: null },
  { id: 'french_coat',  name: 'French Coat',    emoji: '🧥', slot: 'top',       rarity: 'rare',      costPts: 10000, streakReq: null },
  { id: 'croissant_bag',name: 'Croissant Bag',  emoji: '🥐', slot: 'accessory', rarity: 'rare',      costPts: 12000, streakReq: null },
  { id: 'scarf',        name: 'Silk Scarf',     emoji: '🎀', slot: 'accessory', rarity: 'rare',      costPts: 15000, streakReq: null },

  // Legendary — very high pts or streak milestones
  { id: 'eiffel_hat',   name: 'Eiffel Tower Hat',emoji: '🗼', slot: 'hat',      rarity: 'legendary', costPts: 25000, streakReq: null },
  { id: 'mime_outfit',  name: 'Mime Outfit',    emoji: '🤡', slot: 'top',       rarity: 'legendary', costPts: 20000, streakReq: null },
  { id: 'champagne',    name: 'Champagne',      emoji: '🥂', slot: 'accessory', rarity: 'legendary', costPts: 18000, streakReq: null },
  // Streak milestone rewards
  { id: 'streak7',      name: '7-Day Champion', emoji: '🏅', slot: 'accessory', rarity: 'legendary', costPts: null,  streakReq: 7  },
  { id: 'streak30',     name: '30-Day Legend',  emoji: '🏆', slot: 'hat',       rarity: 'legendary', costPts: null,  streakReq: 30 },
];

function getItemById(id) {
  return AVATAR_ITEMS.find(item => item.id === id) || null;
}

function getUnlockableItems(totalPoints, currentStreak, unlockedIds) {
  return AVATAR_ITEMS.filter(item => {
    if (unlockedIds.includes(item.id)) return false;
    if (item.costPts !== null  && totalPoints  >= item.costPts)   return true;
    if (item.streakReq !== null && currentStreak >= item.streakReq) return true;
    return false;
  });
}
