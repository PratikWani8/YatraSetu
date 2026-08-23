import MissingPerson from "../models/MissingPerson.js";

const generateMissingReportId = async () => {
  const year = new Date().getFullYear();

  const latest = await MissingPerson.findOne()
    .sort({ createdAt: -1 })
    .select("reportId");

  let nextNumber = 1;

  if (latest?.reportId) {
    const parts = latest.reportId.split("-");

    nextNumber = parseInt(parts[2]) + 1;
  }

  return `MIS-${year}-${String(nextNumber).padStart(6, "0")}`;
};

export default generateMissingReportId;