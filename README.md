# Prisma REST API - Learning Project

This project is designed to help students learn backend development using modern technologies. It's a REST API built with TypeScript, Prisma ORM, and Hono framework.

## 🚀 Tech Stack

- **TypeScript** - For type-safe code
- **Prisma** - Modern ORM for database operations
- **Hono** - Fast, lightweight web framework
- **Node.js** - JavaScript runtime
- **SQLite** - Database (configured through Prisma)
- **OpenAPI** - API documentation and validation
- **CORS** - Cross-Origin Resource Sharing support
- **Secure Headers** - Enhanced security headers

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- SQLite database

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/prisma-rest-api.git
cd prisma-rest-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your database

- Create a SQLite database
- Update the `DATABASE_URL` in your `.env` file with your database credentials (you can check the `.env.example` file for the format)

### 4. Initialize the database

```bash
npm run prisma:push
```

## 🏃‍♂️ Running the Project

### Development mode

```bash
npm run dev
```

### Build and run in production

```bash
npm run build
npm start
```

## 📁 Project Structure

```bash
src/
├── controllers/    # Business logic handlers
├── routes/         # API route definitions
├── services/       # Business logic and data access
├── libs/          # Shared utilities and helpers
└── index.ts       # Application entry point
```

## 📝 Creating New Endpoints

When creating a new feature, you'll need to create files in multiple directories following the project's architecture. Here's a complete example of creating a user management feature:

1. First, create a service in `src/services/userService.ts`:

```typescript
// src/services/userService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
```

### 2. Create a controller in `src/controllers/userController.ts`

```typescript
// src/controllers/userController.ts
import { Context } from 'hono';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(c: Context) {
    try {
      const users = await this.userService.getAllUsers();
      return c.json(users);
    } catch (error) {
      return c.json({ error: 'Failed to fetch users' }, 500);
    }
  }

  async getUserById(c: Context) {
    try {
      const id = c.req.param('id');
      const user = await this.userService.getUserById(id);
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      return c.json(user);
    } catch (error) {
      return c.json({ error: 'Failed to fetch user' }, 500);
    }
  }

  async createUser(c: Context) {
    try {
      const data = await c.req.json();
      const user = await this.userService.createUser(data);
      return c.json(user, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create user' }, 500);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.param('id');
      const data = await c.req.json();
      const user = await this.userService.updateUser(id, data);
      return c.json(user);
    } catch (error) {
      return c.json({ error: 'Failed to update user' }, 500);
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.param('id');
      await this.userService.deleteUser(id);
      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      return c.json({ error: 'Failed to delete user' }, 500);
    }
  }
}
```

### 3. Create a route in `src/routes/userRoutes.ts`

```typescript
// src/routes/userRoutes.ts
import { Hono } from 'hono';
import { UserController } from '../controllers/userController';

const userRouter = new Hono();
const userController = new UserController();

// GET /api/users
userRouter.get('/', (c) => userController.getAllUsers(c));

// GET /api/users/:id
userRouter.get('/:id', (c) => userController.getUserById(c));

// POST /api/users
userRouter.post('/', (c) => userController.createUser(c));

// PUT /api/users/:id
userRouter.put('/:id', (c) => userController.updateUser(c));

// DELETE /api/users/:id
userRouter.delete('/:id', (c) => userController.deleteUser(c));

export default userRouter;
```

### 4. Finally, register the route in `src/index.ts`

```typescript
import userRouter from './routes/userRoutes';
app.route('/api/users', userRouter);
```

This structure follows the separation of concerns principle:

- **Services**: Handle business logic and database operations
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and connect them to controllers

The flow of a request is:

1. Request comes to a route
2. Route calls the appropriate controller method
3. Controller uses the service to perform business logic
4. Service interacts with the database through Prisma
5. Response flows back through the same chain

## 🗄️ Database Models and Schemas

The project uses Prisma as its ORM, and all database models are defined in the `prisma/schema.prisma` file. Here's how to work with models:

### Creating New Models

1. Open `prisma/schema.prisma` and add your new model. Here's an example:

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]   // Relation to Post model
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Model Features

- **Fields**: Define columns with types and modifiers
- **Relations**: Define relationships between models
- **Modifiers**: Use `@id`, `@unique`, `@default`, etc.
- **Timestamps**: Use `@default(now())` and `@updatedAt`

### Updating the Database

After modifying the schema, you need to update the database:

1. Generate the Prisma Client:

```bash
npm run prisma:generate
```

### 2. Push the changes to the database

```bash
npm run prisma:push
```

Or, if you want to create a migration:

```bash
npm run prisma:migrate dev --name your_migration_name
```

> [!NOTE] > `prisma migrate` is Prisma’s CLI tool used to manage and apply database schema changes in a structured and version-controlled way. So it will create a new migration file and apply it to the database, keeping your local database in sync with the schema and creating a backup of the previous state of the database to be able to rollback if needed. you can read more about it [here](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### Using Models in Your Code

After generating the client, you can use the models in your services:

```typescript
// src/services/userService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: { email: string; name?: string; password: string }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password, // Remember to hash passwords!
      },
    });
  }

  async getUserWithPosts(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true, // Include related posts
      },
    });
  }
}
```

### Best Practices

1. **Type Safety**: Use TypeScript types generated by Prisma
2. **Relations**: Define clear relationships between models
3. **Indexes**: Add indexes for frequently queried fields
4. **Validation**: Use Prisma's built-in validation features
5. **Migrations**: Use migrations for production deployments

### Common Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:migrate dev` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio for database management

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Run the built project
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:studio` - Open Prisma Studio for database management

## 🔒 Security Features

- CORS configuration with environment-based origins
- Secure headers implementation
- Environment variable configuration
- Health check endpoint for monitoring

## 📚 Learning Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Hono Documentation](https://hono.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.
