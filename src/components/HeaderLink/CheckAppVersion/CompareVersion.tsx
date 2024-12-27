export function compareVersions(app: string, lastRelease: string): string {
  if (app == undefined || lastRelease == undefined) {
    // console.log ('app', app, 'lastRelease', lastRelease);
    return '';
  }

  const [major1, minor1, patch1] = app.substring(1).split('.').map(Number);
  const [major2, minor2, patch2] = lastRelease.substring(1).split('.').map(Number) || '';

  if (major1 > major2) {
    return 'app';
  } else if (major1 < major2) {
    return 'githubRelease';
  } else {
    if (minor1 > minor2) {
      return 'app';
    } else if (minor1 < minor2) {
      return 'githubRelease';
    } else {
      if (patch1 > patch2) {
        return 'app';
      } else if (patch1 < patch2) {
        return 'githubRelease';
      } else {
        return 'Versions are identical.';
      }
    }
  }
}
