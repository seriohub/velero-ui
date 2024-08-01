import { useAppState } from '@/contexts/AppStateContext';

// Interface
interface BooleanState {
  getUiURL: boolean;
  getApiURL: boolean;
  checkApiReacheable: boolean;
  getArchitecture: boolean;
  getOrigins: boolean;
  validateOrigins: boolean;
  getWatchdogInfo: boolean;
  getClusterHealth: boolean;
  getUiApiVerCompatibility: boolean;
}

// Class
export class AgentStateManager {
  private appValues = useAppState();

  public uiURL: string;
  public apiURL: string;
  public k8sHealth: any;
  public apiOrigins: string[];
  public arch: string;
  public watchdog: string;
  public compatibility: string;

  private booleanState: BooleanState;
  public allTrue: boolean;
  public hasWarnings: boolean;

  constructor() {
    this.uiURL = '';
    this.apiURL = '';
    this.k8sHealth = {};
    this.apiOrigins = [];
    this.arch = '';
    this.watchdog = '';
    this.compatibility = '';

    this.booleanState = {
      getUiURL: false,
      getApiURL: false,
      checkApiReacheable: false,
      getArchitecture: false,
      getOrigins: false,
      validateOrigins: false,
      getWatchdogInfo: false,
      getClusterHealth: false,
      getUiApiVerCompatibility: false, // only for agent now
    };
    this.allTrue = false;
    this.hasWarnings = false;
  }

  public setVariable(varName: keyof BooleanState, value: boolean): void {
    this.booleanState[varName] = value;
    this.updateGlobalStates();
  }

  private updateGlobalStates(): void {
    this.allTrue = Object.values(this.booleanState).every((v) => v === true);
  }

  public getVariable(varName: keyof BooleanState): boolean {
    return this.booleanState[varName];
  }

  private maskDomain(url: string): string {
    // use regex to identify domain in URL
    const urlPattern = /^(https?:\/\/)([^\/]+)(.*)$/;
    const maskedDomain = '###.###.###';

    // regex apply
    const result = url.match(urlPattern);

    if (result) {
      const protocol = result[1];
      const domain = result[2];
      const path = result[3];

      // replace domain with mask
      return `${protocol}${maskedDomain}${path}`;
    } else {
      return url;
    }
  }

  public generateMarkdownReport(): string {
    let markdown = '';
    markdown += `# Agent State Manager Report**\n\n`;

    markdown += `- Backend info\n`;
    markdown += `  - app_name: **${this.appValues?.backendInfo?.app_name}**;\n`;
    markdown += `  - helm_app_version: **${this.appValues?.backendInfo?.helm_app_version}**;\n`;
    markdown += `  - helm_version: **${this.appValues?.backendInfo?.helm_version}**;\n`;
    markdown += `  - helm_api: **${this.appValues?.backendInfo?.helm_api}**;\n`;
    markdown += `  - helm_ui: **${this.appValues?.backendInfo?.helm_ui}**;\n`;
    markdown += `  - api_release_version: **${this.appValues?.backendInfo?.api_release_version}**;\n`;
    markdown += `  - helm_watchdog: **${this.appValues?.backendInfo?.helm_watchdog}**;\n`;

    markdown += `- UI URL: **${this.maskDomain(this.uiURL)}**\n`;
    markdown += `- API URL: **${this.maskDomain(this.apiURL)}**\n`;

    markdown += `- K8s Health\n`;
    markdown += `  - cluster online: **${this.k8sHealth?.cluster_online}**\n`;
    markdown += `  - nodes:\n`;
    markdown += `    - total: **${this.k8sHealth?.nodes?.total}**;\n`;
    markdown += `    - in error: **${this.k8sHealth?.nodes?.in_error}**;\n`;

    markdown += `- API Origins\n`;
    markdown += this.apiOrigins.map((origin) => `  - ${origin};`).join('\n') + '\n';

    markdown += `- Architecture: **${this.arch}**\n`;
    markdown += `- Watchdog: **${this.watchdog}**\n`;
    markdown += `- Compatibility: **${this.compatibility}**\n`;

    markdown += `- Boolean State\n`;
    for (const [key, value] of Object.entries(this.booleanState)) {
      markdown += `  - ${key}: **${value}**;\n`;
    }

    return markdown;
  }
}
