import { Postgrest, Query, Repository } from "../index";

import { Group } from "./group";

const query = new Query();
query.addFilter(`id=eq.b603f011-c9b0-401f-a214-7f23601a1635`);
query.addSelect("*");
query.addRelation({
  childs: [{
    columns: ["*"],
    relationName: "permission",
    rename: "permissions",
  }],
  columns: ["*"],
  relationName: "group_permission",
  rename: "group_permissions",
});
query.addRelation({
  childs: [{
    columns: ["*"],
    relationName: "profile",
    rename: "profiles",
  }],
  columns: ["*"],
  relationName: "group_profile",
  rename: "group_profiles",
});

const test = async () => {
  const p = new Postgrest("http://localhost:4109");
  try {
    await p.connect();
    const groupsRepository = await Repository.createRepository<Group>(p, "group", Group);
    const groups = await groupsRepository.getAll(query);
    const group1 = groups[0];
    group1.properties.name = group1.properties.name + 1;
    const updatedGroup = await group1.update();
    console.dir(updatedGroup);
  } catch (err) {
    console.error(err);
  }
};

test();
