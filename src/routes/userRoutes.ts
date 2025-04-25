import { Hono } from 'hono';
import { UserController } from '../controllers/userController';

const userController = new UserController();
const userRouter = new Hono();

userRouter.get('/', (c) => userController.getUsers(c));
userRouter.get('/:id', (c) => userController.getUserById(c));
userRouter.post('/', (c) => userController.createUser(c));
userRouter.put('/:id', (c) => userController.updateUser(c));
userRouter.delete('/:id', (c) => userController.deleteUser(c));

export default userRouter;
