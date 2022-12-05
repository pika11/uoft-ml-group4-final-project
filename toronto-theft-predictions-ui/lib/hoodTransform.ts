// Map due to one hot encoding and removal / adding of neighbourhoods in the city of Toronto

export const hoodTransform = (hood: number): number => {
  let remove = 0;

  if (hood >= 137) {
    remove++;
  }

  if (hood >= 131) {
    remove++;
  }

  if (hood >= 132) {
    remove++;
  }

  if (hood >= 117) {
    remove++;
  }

  if (hood >= 45) {
    remove++;
  }

  if (hood >= 51) {
    remove++;
  }

  if (hood >= 26) {
    remove++;
    remove++;
  }

  if (hood >= 127) {
    remove++;
  }

  if (hood >= 14) {
    remove++;
  }

  if (hood >= 82) {
    remove++;
  }

  if (hood >= 77) {
    remove++;
  }

  if (hood >= 75) {
    remove++;
  }

  if (hood >= 76) {
    remove++;
  }

  if (hood >= 93) {
    remove++;
  }

  if (hood >= 104) {
    remove++;
  }

  return hood - remove;
};
