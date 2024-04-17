export const sizeOption = [
  { label: "Small", value: "small" },
  { label: "TRUE TO SIZE - Cup", value: "true-to-size" },
  { label: "Large", value: "large" },
];
export const bandOption = [
  { label: "Tight ", value: "tight" },
  { label: "TRUE TO SIZE - BAND", value: "true-to-band" },
  { label: "Loose", value: "loose" },
];
export const recentOption = [
  { label: "Sort", value: "sort" },
  { label: "Most Recent", value: "most-recent" },
  { label: "Highest Rating", value: "highest-rating" },
  { label: "Lowest Rating", value: "lowest-rating" },
  { label: "Most Helpful", value: "most-helpful" },
];

export const MATCH_EMAIL = new RegExp(
  /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/
);

export const MATCH_TEXT = new RegExp(/^[a-zA-Z ]+$/);

export const MATCH_STRING = new RegExp(/^[a-zA-Z0-9 ]+$/);

export const MATCH_ZIPCODE = new RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/);

export const MATCH_PHONENUMBER = new RegExp(/((^(\+)(\d){12}$)|(^\d{11}$))/);
