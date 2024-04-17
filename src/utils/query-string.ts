import qs, { type IStringifyOptions } from "qs";
const qsOptions = {
  strictNullHandling: true,
  ignoreQueryPrefix: true,
  parseArrays: true,
  comma: true,
};

export const parseQueryString = () =>
  qs.parse(decodeURIComponent(location.search.slice(1)), qsOptions);

export const updateQs = (latest: object, options?: IStringifyOptions) => {
  return qs.stringify(
    {
      ...qs.parse(decodeURIComponent(location.search), {
        ignoreQueryPrefix: true,
      }),
      ...latest,
    },
    { indices: false, arrayFormat: "comma", ...options }
  );
};

export const updateURLState = (latest: object) => {
  return history.pushState({}, "", `${location.pathname}?${updateQs(latest)}`);
};
