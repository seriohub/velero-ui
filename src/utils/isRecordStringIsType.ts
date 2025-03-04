export function isRecordStringAny(variable: any): variable is Record<string, any> {
  return (
    typeof variable === 'object' &&
    variable !== null &&
    !Array.isArray(variable) &&
    Object.keys(variable).every((key) => typeof key === 'string')
  );
}
