import { ObjectId } from "mongodb";
import { IResolvers } from "apollo-server-express";
import { Database, IListing } from "../lib/types";

export const resolvers: IResolvers = {
  Query: {
    listnings: async (
      _root: undefined,
      _args: any,
      { db }: { db: Database }
    ): Promise<IListing[]> => {
      return await db.listnings.find({}).toArray();
    }
  },
  Mutation: {
    deleteListning: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<IListing> => {
      const deleteRes = await db.listnings.findOneAndDelete({
        _id: new ObjectId(id)
      });

      if (!deleteRes.value) {
        throw new Error("failed to delete listing");
      }

      return deleteRes.value;
    }
  },
  Listning: {
    id: (listning: IListing): string => listning._id.toString()
  }
};
