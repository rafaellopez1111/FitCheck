// config/config.js

export const ENTITIES = {
  CLOTHING: 'clothing',
  WISHLIST: 'wishlist',
  OUTFIT: 'outfit',
  PROFILE: 'profile',
};

export const ACTIONS = {
  CREATE: 'create',
  GET_ONE: 'get_one',
  GET_ALL: 'get_all',
  UPDATE: 'update',
  DELETE: 'delete',
  MARK_AS_BOUGHT: 'mark_as_bought',
};

export const ALLOWED_ACTIONS = {
  clothing: ['create', 'get_one', 'get_all', 'update', 'delete'],
  wishlist: ['create', 'get_one', 'get_all', 'update', 'delete', 'mark_as_bought'],
  outfit: ['create', 'get_one', 'get_all', 'update', 'delete'],
  profile: ['create', 'get_one', 'update', 'delete'],
};

export const ACTIONS_REQUIRING_DATA = [
  'create',
  'get_one',
  'update',
  'delete',
  'mark_as_bought',
];

export const FIELDS = {
  clothing: {
    required: ['name', 'category'],
    optional: ['photo', 'brand', 'size', 'style', 'notes'],
    summary: ['id', 'name', 'category', 'photo', 'brand'],
  },
  wishlist: {
    required: ['name', 'category'],
    optional: ['photo', 'brand', 'size', 'style', 'notes', 'price', 'store_link', 'priority'],
    summary: ['id', 'name', 'category', 'photo', 'price', 'priority'],
  },
  outfit: {
    required: ['name', 'item_ids'],
    optional: ['occasion', 'notes'],
    summary: ['id', 'name', 'occasion', 'item_ids'],
  },
  profile: {
    required: ['name'],
    optional: ['photo'],
    summary: ['id', 'name', 'photo'],
  },
};

export const PROTECTED_FIELDS = [
  'id',
  'user_id',
  'created_on',
  'created_by',
  'updated_on',
  'updated_by',
];

export const CATEGORIES = [
  'Camisa',
  'Camiseta',
  'Blusa',
  'Casaco',
  'Calça',
  'Shorts',
  'Bermuda',
  'Jorts',
  'Vestido',
  'Saia',
  'Sapato',
  'Tênis',
  'Chinelo',
  'Bota',
  'Sandália',
  'Acessórios',
];

export const STYLES = [
  'Casual',
  'Formal',
  'Esportivo',
  'Social',
  'Streetwear',
  'Festa',
  'Praia',
  'Oversized',
  'Vintage',
  'Boho',
  'Skinny',
  'Baggy'
];

export const PRIORITIES = ['low', 'medium', 'high'];

export const ID_PREFIXES = {
  clothing: 'c_',
  wishlist: 'w_',
  outfit: 'o_',
  profile: 'u_',
};

export const STORAGE_KEYS = {
  clothing: 'wardrobe:clothing',
  wishlist: 'wardrobe:wishlist',
  outfit: 'wardrobe:outfit',
  profile: 'wardrobe:profile',
};

export const RESPONSE_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  SERVER_ERROR: 500,
};

export const RESPONSE_FIELDS = ['code', 'success', 'message', 'data'];

export const COLORS = {
};