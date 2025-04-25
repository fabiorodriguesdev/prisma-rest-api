import { Context } from 'hono';
import { UserService } from '@services/userService';

const userService = new UserService();

export class UserController {
  async getUsers(c: Context) {
    try {
      const users = await userService.getAllUsers();

      return c.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);

      return c.json({ error: 'Failed to fetch users' }, 500);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = Number(c.req.param('id'));
      const user = await userService.getUserById(id);

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      return c.json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return c.json({ error: 'Failed to fetch user' }, 500);
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const user = await userService.createUser(body);

      return c.json({ user }, 201);
    } catch (error) {
      console.error('Error creating user:', error);

      return c.json({ error: 'Failed to create user' }, 500);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = Number(c.req.param('id'));
      const body = await c.req.json();
      const user = await userService.updateUser(id, body);

      return c.json({ user });
    } catch (error) {
      console.error('Error updating user:', error);

      return c.json({ error: 'Failed to update user' }, 500);
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = Number(c.req.param('id'));
      await userService.deleteUser(id);

      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);

      return c.json({ error: 'Failed to delete user' }, 500);
    }
  }
}
