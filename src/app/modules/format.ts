import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
dayjs.extend(relativeTime);

export const formatTimeAgo = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

export const formatDate = (dateString: string) => {
  return dayjs(dateString).format("DD/MM/YYYY");
};
