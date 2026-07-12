const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;

  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  return {
    contactType: type,
    isFavourite: parseBoolean(isFavourite),
  };
};
