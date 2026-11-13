export const ENTITIES = {
  clothing: 'clothing',
  wishlist: 'wishlist',
  outfit: 'outfit',
  profile: 'profile',
};

export const ACTIONS = {
  create: 'create',
  get_one: 'get_one',
  get_all: 'get_all',
  update: 'update',
  delete: 'delete',
  mark_as_bought: 'mark_as_bought',
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

export const ACTIONS_REQUIRING_ID = [
  'get_one',
  'update',
  'delete',
  'mark_as_bought',
];

export const FIELDS = {
  clothing: {
    required: ['name', 'category'],
    optional: ['photo', 'brand', 'size', 'style', 'notes'],
    summary: ['id', 'name', 'category', 'photo', 'brand', 'style', 'size'],
  },
  wishlist: {
    required: ['name', 'category'],
    optional: ['photo', 'brand', 'size', 'style', 'notes', 'price', 'store_link', 'priority'],
    summary: ['id', 'name', 'category', 'photo', 'brand', 'style', 'price', 'priority', 'size'],
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
  'version'
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
  'Baggy',
];

export const PRIORITIES = ['low', 'medium', 'high'];

export const PRIORITY_LABELS = { low: 'Baixa', medium: 'Média', high: 'Alta' };

export const ID_PREFIXES = {
  clothing: 'c_',
  wishlist: 'w_',
  outfit: 'o_',
  profile: 'u_',
};

export const RESPONSE_CODES = {
  ok: 200,
  bad_request: 400,
  not_found: 404,
  method_not_allowed: 405,
  server_error: 500,
};

export const RESPONSE_FIELDS = ['code', 'success', 'message', 'data'];

export const CATEGORY_GROUPS = {
  tops: ['Camisa', 'Camiseta', 'Blusa', 'Casaco', 'Vestido'],
  bottoms: ['Calça', 'Shorts', 'Bermuda', 'Jorts', 'Saia'],
  shoes: ['Sapato', 'Tênis', 'Chinelo', 'Bota', 'Sandália']
};

export const COLORS = {
  background: '#FAF7FB',
  card: '#FFFFFF',
  border: '#E8E0EE',
  text: '#241B2F',
  mutedText: '#7C7288',
  primary: '#5B2A86',
  primarySoft: '#EFE8F5',
  accent: '#FF7A59',
  danger: '#D64545',
  dangerSoft: '#FDECEC',
  white: '#FFFFFF',
};