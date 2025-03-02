export function isRecordStringAny(variable: any): variable is Record<string, any> {
  return (
    typeof variable === 'object' &&
    variable !== null &&
    !Array.isArray(variable) &&
    Object.keys(variable).every((key) => typeof key === 'string')
  );
}

function isRecordStringAnyArray(variable: any): variable is Record<string, any>[] {
  return (
    Array.isArray(variable) &&
    variable.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        !Array.isArray(item) &&
        Object.keys(item).every((key) => typeof key === 'string')
    )
  );
}
