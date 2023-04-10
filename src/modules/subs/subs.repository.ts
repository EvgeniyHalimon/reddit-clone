import Sub from "./subs.entity";

const subsRepository = {
  findSubOfFail: async (name: string) => {
    return await Sub.findOneOrFail({ name: name })
  },
  isOwnSubOfFail: async (name: string) => {
    return await Sub.findOneOrFail({ where: { name: name } })
  },
  findSub: async (name: string) => {
    return await Sub.findOne({ where: { name: name } })
  },
};

export { subsRepository };