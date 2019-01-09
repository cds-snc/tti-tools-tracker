function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

export const calculateDelta = (after, before) => {
  return roundToTwo(
    (after.audits.interactive.rawValue - before.audits.interactive.rawValue) /
      1000
  );
};
