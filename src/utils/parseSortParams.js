const SORT_ORDER = ['asc', 'desc'];
const SORT_BY = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = SORT_BY.includes(sortBy) ? sortBy : '_id';
  const parsedSortOrder = SORT_ORDER.includes(sortOrder) ? sortOrder : 'asc';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
