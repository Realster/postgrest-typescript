import { Model } from "../";

export interface IGroup {
  id: string;
  name: string;
  organization_id: string;
  parent_id: string;
  group_profiles?: [{
    profile_id: string;
    group_id: string;
    profiles?: [{
      id: string;
      user_id: string;
      organization_id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      current: boolean;
    }]
  }];
  group_permissions?: [{
    permission_id: string;
    group_id: string;
    permissions?: [{
      id: string;
      name: string;
      client_id: string;
    }]
  }];
}

export class Group extends Model<IGroup> {
  public async update() {
    const properties = Object.assign({}, this.properties);
    delete properties.group_permissions;
    delete properties.group_profiles;
    return super.update(properties);
  }
}
