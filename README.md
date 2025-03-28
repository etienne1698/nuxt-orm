# NuxtORM

NuxtORM is a lightweight and efficient ORM library for Nuxt 3 that simplifies data normalization and relationship management using Nuxt's `useState` composable. It provides a structured way to handle entities and associations while keeping state management seamless and reactive.

## Installation

Install NuxtORM via npm:

```sh
npm install nuxt-orm
```

Add this to your nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ["nuxt-orm"],
  nuxtOrm: {
    defaultDatabase: {
      prefix: "",
    },
  },
});
```

## Usage

### Defining Models

Create your models in the `models/` directory.

#### models/Pet.ts

```ts
import { Model } from "nuxt-orm";

export class Pet extends Model {
  static override entity = "pets";

  static override relations(): Record<string, Relation<any>> {
    return { user: Relation.belongsTo(User, "user_id") };
  }

  declare id: string;
  declare name: string;
  declare user_id: string;

  declare user?: User;
}
```

#### models/User.ts

```ts
export class User extends Model {
  static override entity = "User";

  static override relations(): Record<string, Relation<any>> {
    return {
      pets: Relation.hasMany(Pet, "user_id"),
    };
  }

  declare id: string;
  declare firstname: string;
  declare lastname: string;

  get fullName() {
    return `${this.firstname} ${this.lastname}`.trim();
  }
}
```

### Using It in a Component

#### Example Code

```vue
<script setup lang="ts">
import { Pet } from "./models/Pet";
import { User } from "./models/User";

const petRepo = useRepo(Pet);
const userRepo = useRepo(User);

if (import.meta.server) {
  const firstUserID = crypto.randomUUID();
  userRepo.save({
    id: firstUserID,
    firstname: "Etienne",
    pets: [{ id: crypto.randomUUID(), user_id: firstUserID }],
  });
}

function addUser() {
  userRepo.save({ id: crypto.randomUUID() });
}

function addPet() {
  petRepo.save({ id: crypto.randomUUID() });
}

const pets = computed(() => petRepo.query().with("user").get());
</script>
```

## ✅ TODO
- Relation :
  - hasManyBy
  - hasManyThrough
  - belongsToMany (with pivot)
- composite key
- update/delete
- update/delete by query
