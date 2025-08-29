export function toISO(dateStr, timeStr) {
    const [h = "00", m = "00"] = (timeStr || "").split(":");
    const d = new Date(dateStr);
    if (isNaN(d.getTime()))
        return "";
    d.setHours(Number(h), Number(m), 0, 0);
    return d.toISOString();
}
