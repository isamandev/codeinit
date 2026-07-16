import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export function toJalali(date?: string | number | Date | null) {
  if (!date) return "";
  try {
    return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
  } catch {
    return String(date);
  }
}

export default dayjs;
