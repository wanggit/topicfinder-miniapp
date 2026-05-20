# topicfinder-miniapp — Agent Notes

## Commands

```bash
npm run dev:weapp   # taro build --type weapp --watch
npm run dev:h5      # taro build --type h5 --watch (for development)
npm run build:weapp # production build for WeChat Mini Program
npm run build:h5    # production build for H5
npm test            # vitest run
npm run test:watch  # vitest — watch mode
```

## Architecture

- `src/app.config.ts` — 6 Tab pages (Dashboard, Learning, Report, WrongNotes, Leaderboard, Profile)
- `src/app.tsx` — App entry component
- `src/pages/*/index.tsx` — Page components (壳，显示标题)
- `src/pages/*/index.config.ts` — Per-page config (navigation title)
- `src/utils/api.ts` — `createApiClient(options)` — returns `{ get, post, put, delete }`. Uses browser `fetch`. Supports JWT Bearer token.
- `tests/api.test.ts` — 4 tests for API client (GET, POST, Authorization header, error handling)
- `config/` — Taro build configuration (weapp + h5 platforms)
- `project.config.json` — WeChat Mini Program project config

## Conventions

- Taro 4.x with React framework, webpack5 compiler
- Brand colors: #764ba2 / #667eea
- All UI text in Chinese (zh-CN)
- Test seam: `createApiClient()` accepts `{ baseURL, token }` — no `vi.mock()` needed
