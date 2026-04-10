import { Profile } from '~/portfolio/entities/profile/model/Profile';

export interface IProfileRepository {
  find(): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
}
