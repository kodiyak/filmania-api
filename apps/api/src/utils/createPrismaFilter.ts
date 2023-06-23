export const createPrismaFilter = async (
  query: any,
  { where, skip, take, ...rest }: any = {}
) => {
  const totalItems = await query.count({
    where,
  });

  const result = await query.findMany({
    where,
    skip,
    take,
    ...rest,
  });

  return {
    result,
    meta: { totalItems },
  };
};
