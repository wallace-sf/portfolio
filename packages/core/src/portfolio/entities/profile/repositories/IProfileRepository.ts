import { Profile } from '../model/Profile';

export interface IProfileRepository {
  find(): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
}
