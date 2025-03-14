import * as yaml from 'js-yaml';

export function convertJsonToYaml(jsonObject: Record<string, any>): string {
  return yaml.dump(jsonObject, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
  });
}
