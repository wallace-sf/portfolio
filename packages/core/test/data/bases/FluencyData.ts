import { Fluency, FluencyValue } from '../../../src';

export class FluencyData {
  static valid(): FluencyValue {
    return Fluency.LEVELS[0] as FluencyValue;
  }
}
