import { BatchDetails } from "../../components/extraCalcs/Trials";

function calculateAdjunctAmount(
  volume: number,
  stockSolutionConcentration: number
) {
  return Math.round(volume * stockSolutionConcentration * 10 ** 6) / 10 ** 8;
}

function calculateAdjunctConcentration(
  adjunctAmount: number,
  totalVolume: number
) {
  return Math.round((adjunctAmount / totalVolume) * 10 ** 6) / 10 ** 6;
}

function scaleAdjunctConcentration(
  adjunctConcentration: number,
  units: string
) {
  return units === "gallon"
    ? Math.round(adjunctConcentration * 37850000) / 10 ** 4
    : Math.round(adjunctConcentration * 10 ** 4) / 10;
}

function calculateScaledBatch(scaledAdjunct: number, batchSize: number) {
  return Math.round(scaledAdjunct * batchSize * 10 ** 4) / 10 ** 4;
}

export function calculateAdjunctValues(
  volume: number,
  batchDetails: BatchDetails
) {
  const { stockSolutionConcentration, sampleSize, units, batchSize } =
    batchDetails;

  const adjunctAmount = calculateAdjunctAmount(
    volume,
    stockSolutionConcentration
  );
  const adjunctConcentration = calculateAdjunctConcentration(
    adjunctAmount,
    sampleSize + volume
  );
  const scaledAdjunct = scaleAdjunctConcentration(adjunctConcentration, units);
  const scaledBatch = calculateScaledBatch(scaledAdjunct, batchSize);

  return {
    adjunctAmount,
    adjunctConcentration: adjunctConcentration * 10 ** 6,
    scaledAdjunct,
    scaledBatch,
  };
}
