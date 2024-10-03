import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository{
  constructor(table){super(table);}
  /* async getAll(columnsArray){
    try {
      const results = await super.getAll(columnsArray);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id, columnsArray){
    try {
      const result = await super.getById(id, columnsArray);
      return result;
    } catch (error) {
      throw error;
    }
  }  */
}

export default UserRepository;