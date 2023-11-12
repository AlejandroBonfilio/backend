class UserRepository {
    constructor(userDAO) {
      this.userDAO = userDAO;
    }
  
    async getById(id) {
      return this.userDAO.getById(id);
    }
  
    async create(userData) {
      return this.userDAO.create(userData);
    }
  
    async update(id, userData) {
      return this.userDAO.update(id, userData);
    }
  
    async delete(id) {
      return this.userDAO.delete(id);
    }
  
    
  }
  
  module.exports = UserRepository;