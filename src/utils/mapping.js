export const mappingMiniLeagueOption = (data) =>
  data?.map((item) => ({
    label: item?.name,
    value: item?._id,
  }));

export const mappingOptionSelect = (
  data,
  labelKey = "name",
  valueKey = "_id"
) =>
  data?.map((item) => ({
    label: item?.[labelKey],
    value: item?.[valueKey],
  }));
