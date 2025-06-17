const { Op } = require("sequelize");

function parsePaginationQuery(query = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    orderBy = "createdAt",
    orderType = "DESC",
    all = false,
  } = query;

  const pageNumber = parseInt(page);
  const pageSize = all || parseInt(limit) === 0 ? null : parseInt(limit);
  const offset = pageSize ? (pageNumber - 1) * pageSize : null;

  return {
    pageNumber,
    pageSize,
    offset,
    search,
    order: [[orderBy, orderType.toUpperCase()]],
    all: all === "true" || all === true,
  };
}

function buildWhereClause({ search = "", fields = [], extra = {} }) {
  const where = { ...extra };

  if (search && fields.length) {
    where[Op.or] = fields.map(field => ({
      [field]: { [Op.like]: `%${search}%` },
    }));
  }

  return where;
}

function formatPaginationResponse({ rows, count }, { pageNumber, pageSize, all }) {
  return {
    data: rows,
    meta: all
      ? null
      : {
          totalData: count,
          totalPages: Math.ceil(count / pageSize),
          page: pageNumber,
          pageSize,
        },
  };
}

module.exports = {
  parsePaginationQuery,
  buildWhereClause,
  formatPaginationResponse,
};
