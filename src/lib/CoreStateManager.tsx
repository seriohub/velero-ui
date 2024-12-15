// Interface
interface BooleanState {
  getUiURL: boolean;
  getApiURL: boolean;
  checkApiReacheable: boolean;
  getArchitecture: boolean;
  getOrigins: boolean;
  validateOrigins: boolean;
  getClusterHealth: boolean;
  getUiApiVerCompatibility: boolean;
}

// Class
export class CoreStateManager {
  private booleanState: BooleanState;
  public allTrue: boolean;
  public hasWarnings: boolean;

  constructor() {
    this.booleanState = {
      getUiURL: false,
      getApiURL: false,
      checkApiReacheable: false,
      getArchitecture: false,
      getOrigins: false,
      validateOrigins: false,
      getClusterHealth: false,
      getUiApiVerCompatibility: false,
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
}
