import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";

const handleCompareDate = (date: Date) => {
    return formatDistance(date || new Date(), new Date(), { locale: vi, addSuffix: true });
};

export default handleCompareDate;
