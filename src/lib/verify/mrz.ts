export function parseMRZ(mrz: string) {
  const lines = mrz.split("\n");

  return {
    documentType: lines[0]?.substring(0, 1),
    country: lines[0]?.substring(2, 5),
    lastName: lines[0]?.substring(5).split("<<")[0],
    firstName: lines[0]?.substring(5).split("<<")[1]?.replace(/</g, " "),
    passportNumber: lines[1]?.substring(0, 9).replace(/</g, ""),
    nationality: lines[1]?.substring(10, 13),
    dob: lines[1]?.substring(13, 19),
    sex: lines[1]?.substring(20, 21),
  };
}
