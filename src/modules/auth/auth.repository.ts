import User from "../users/users.entity";

const userRepository = {
  findUsername: async (username: string) => {
    return await User.findOne({ username })
  },
  findEmail: async (email: string) => {
    return await User.findOne({ email })
  },
  findUserOrFail: async (username: string, selectBy: (keyof User)[]) => {
    return await User.findOneOrFail({
        where: { username: username },
        select: [...selectBy],
    })
  }
};

export{ userRepository };