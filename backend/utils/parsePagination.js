const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function parsePagination(query, { defaultLimit = DEFAULT_LIMIT } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const requestedLimit = parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.max(1, Math.min(MAX_LIMIT, requestedLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function buildPagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}
