# Convert Backend from JavaScript to TypeScript

The backend is an Express.js app with Mongoose, JWT auth, Cloudinary, and Resend integrations. Currently 13 `.js` files + 3 already-`.ts` files (`asyncHandler.ts`, `otpSend.ts`, `resend.ts`). The goal is to convert all remaining `.js` files to fully-typed `.ts`.

## Proposed Changes

### 1. Install Missing Type Declarations

```bash
bun add -D @types/bcrypt @types/cookie-parser @types/cors @types/jsonwebtoken @types/multer tsx
```

> [!NOTE]
> `tsx` replaces `nodemon` for dev mode — it natively runs `.ts` files with hot-reload via `tsx watch`. Alternatively we can keep `nodemon` + `ts-node-dev`, but `tsx` is simpler and faster.

---

### 2. Update Configuration Files

#### [MODIFY] [package.json](file:///home/nishank/dev/full/x/backend/package.json)
- Change `"main"` from `"server.js"` → `"dist/server.js"`
- Update scripts:
  - `"dev": "tsx watch ./src/server.ts"`
  - `"build": "tsc"`
  - `"start": "node ./dist/server.js"`

#### [MODIFY] [tsconfig.json](file:///home/nishank/dev/full/x/backend/tsconfig.json)
- Remove `"jsx": "react-jsx"` (not needed for backend)
- Add `"esModuleInterop": true` (needed for `import jwt from "jsonwebtoken"` etc.)
- Add `"include": ["src"]` and `"exclude": ["node_modules", "dist"]`

#### [MODIFY] [.gitignore](file:///home/nishank/dev/full/x/backend/.gitignore)
- Add `dist` to gitignore

---

### 3. Create Shared Type Definitions

#### [NEW] [types.ts](file:///home/nishank/dev/full/x/backend/src/types.ts)
- `IUser` interface matching the Mongoose user schema
- `IPost` interface matching the Mongoose post schema  
- `IOtp` interface matching the OTP schema
- `IComment` sub-interface for embedded comments
- Augment `Express.Request` to add `user` property (used by auth middleware)

---

### 4. Rename & Convert Constants

#### [RENAME+MODIFY] `constants.js` → [constants.ts](file:///home/nishank/dev/full/x/backend/constants.ts)
- Add `as const` or explicit type annotation

---

### 5. Convert Utility Files

#### [MODIFY] [apiError.ts](file:///home/nishank/dev/full/x/backend/src/utils/apiError.ts) (rename from `.js`)
- Add typed constructor parameters, typed class fields

#### [MODIFY] [apiResponse.ts](file:///home/nishank/dev/full/x/backend/src/utils/apiResponse.ts) (rename from `.js`)
- Add typed constructor, generic `data` field

#### [MODIFY] [otpGenerator.ts](file:///home/nishank/dev/full/x/backend/src/utils/otpGenerator.ts) (rename from `.js`)
- Add return type annotation

---

### 6. Convert Models

#### [MODIFY] [userModel.ts](file:///home/nishank/dev/full/x/backend/src/models/userModel.ts) (rename from `.js`)
- Type the schema with `IUser` interface, use `Schema<IUser>`
- Type the `isPasswordCorrect` method via `IUserMethods` interface

#### [MODIFY] [postModel.ts](file:///home/nishank/dev/full/x/backend/src/models/postModel.ts) (rename from `.js`)
- Type with `IPost` interface

#### [MODIFY] [otpModel.ts](file:///home/nishank/dev/full/x/backend/src/models/otpModel.ts) (rename from `.js`)
- Type with `IOtp` interface, type `isOtpCorrect` method

---

### 7. Convert Services

#### [MODIFY] [cloudinary.ts](file:///home/nishank/dev/full/x/backend/src/services/cloudinary.ts) (rename from `.js`)
- Type `uploadOnCloudinary` parameter and return type
- Type multer storage callbacks

#### `otpSend.ts` and `resend.ts` — already TypeScript, update import paths (remove `.js` extensions → `.js` stays for ESM resolution, which is correct)

---

### 8. Convert Middleware

#### [MODIFY] [authMiddleware.ts](file:///home/nishank/dev/full/x/backend/src/middlewares/authMiddleware.ts) (rename from `.js`)
- Type `req`, `res`, `next` with Express types
- Use the augmented `Request` type with `user`

---

### 9. Convert Controllers

#### [MODIFY] [auth.controller.ts](file:///home/nishank/dev/full/x/backend/src/controllers/auth.controller.ts) (rename from `.js`)
#### [MODIFY] [comment.controller.ts](file:///home/nishank/dev/full/x/backend/src/controllers/comment.controller.ts) (rename from `.js`)
#### [MODIFY] [feed.controller.ts](file:///home/nishank/dev/full/x/backend/src/controllers/feed.controller.ts) (rename from `.js`)
#### [MODIFY] [post.controller.ts](file:///home/nishank/dev/full/x/backend/src/controllers/post.controller.ts) (rename from `.js`)
#### [MODIFY] [user.controller.ts](file:///home/nishank/dev/full/x/backend/src/controllers/user.controller.ts) (rename from `.js`)

All controllers: add `Request`, `Response` types to handler signatures.

---

### 10. Convert Routes

#### [MODIFY] [auth.routes.ts](file:///home/nishank/dev/full/x/backend/src/routes/auth.routes.ts) (rename from `.js`)
#### [MODIFY] [feed.routes.ts](file:///home/nishank/dev/full/x/backend/src/routes/feed.routes.ts) (rename from `.js`)
#### [MODIFY] [post.routes.ts](file:///home/nishank/dev/full/x/backend/src/routes/post.routes.ts) (rename from `.js`)
#### [MODIFY] [user.routes.ts](file:///home/nishank/dev/full/x/backend/src/routes/user.routes.ts) (rename from `.js`)

Update import paths to `.js` extensions (required for ESM + NodeNext module resolution).

---

### 11. Convert Entry Points

#### [MODIFY] [app.ts](file:///home/nishank/dev/full/x/backend/src/app.ts) (rename from `.js`)
#### [MODIFY] [server.ts](file:///home/nishank/dev/full/x/backend/src/server.ts) (rename from `.js`)
#### [MODIFY] [db/index.ts](file:///home/nishank/dev/full/x/backend/src/db/index.ts) (rename from `.js`)

---

## Open Questions

> [!IMPORTANT]
> **Dev runner**: I plan to use `tsx watch` for development (replaces `nodemon`). It's the modern standard for running TS directly. Are you okay with this, or would you prefer to keep `nodemon` with `ts-node-dev`?

> [!NOTE]
> **Import extensions**: Since your tsconfig uses `"module": "nodenext"`, all relative imports must keep `.js` extensions (e.g., `import x from "./foo.js"`). This is correct ESM behavior — TypeScript resolves `.js` imports to `.ts` files at compile time.

## Verification Plan

### Automated
1. Run `npx tsc --noEmit` to verify the entire project compiles with zero errors
2. Run `bun run dev` to verify the server starts successfully
3. Test a basic API endpoint via `curl`

### Manual
- Verify all old `.js` files are deleted (no duplicates)
