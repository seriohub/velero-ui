// Interface
interface BooleanState {
  UiURL: boolean;
  ApiURL: boolean;
  APIReacheable: boolean;
  GetArchitecture: boolean;
  GetOrigins: boolean;
  ValidateOrigins: boolean;
  Watchdog: boolean;
  Cluster: boolean;
  Compatibility: boolean;
}

// Class
export class StateManager {
  private booleanState: BooleanState;
  public allTrue: boolean;
  public hasWarnings: boolean;

  constructor() {
    this.booleanState = {
      UiURL: false,
      ApiURL: false,
      APIReacheable: false,
      GetArchitecture: false,
      GetOrigins: false,
      ValidateOrigins: false,
      Watchdog: false,
      Cluster: false,
      Compatibility: false,
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

/*// Example
const stateManager = new StateManager();

stateManager.setVariable('UiURL', true);
stateManager.setVariable('UiAPI', true);
stateManager.setVariable('APIReacheable', true);
stateManager.setVariable('GetArchitecture', true);
stateManager.setVariable('GetOrigins', true);
stateManager.setVariable('ValidateOrigins', true);
stateManager.setVariable('Watchdog', true);
stateManager.setVariable('Cluster', true);

console.log(stateManager.allTrue);         // false
console.log(stateManager.firstThreeTrue);  // true


console.log(stateManager.allTrue);         // true
*/
