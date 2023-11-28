import moment from "moment-timezone";

export const isJsonString = (str) => {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};

export function rangeDesc(start, end) {
  return Array(start - end + 1)
    .fill()
    .map((_, idx) => start - idx);
}

export const today = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
