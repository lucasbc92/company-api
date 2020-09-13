/* eslint-disable class-methods-use-this */
class UsersController {
  async index(request, response) {
    return response.json('Users listed.');
  }

  async select(request, response) {
    return response.json('User selected.');
  }

  async create(request, response) {
    return response.json('User created.');
  }

  async update(request, response) {
    return response.json('User updated.');
  }

  async delete(request, response) {
    return response.json('User deleted.');
  }
}

module.exports = UsersController;
