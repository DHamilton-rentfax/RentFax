export function computeConfidence({
  fieldCompleteness,
  mapboxConfidence,
  idQuality,
  matchingScore,
}: any) {
  return Math.round(
    fieldCompleteness * 0.25 +
      mapboxConfidence * 0.25 +
      idQuality * 0.25 +
      matchingScore * 0.25
  );
}