# Anamnesis | 追忆

个人数字花园，使用 Astro、MDX 和 TypeScript 构建。

## Local development

```powershell
npm install
npm run dev
```

`npm run build` 会执行类型检查、生成静态站点并建立 Pagefind 搜索索引。生产发布由 `.github/workflows/deploy-pages.yml` 在 `main` 推送后完成。

## Optional counters

站点默认使用 Vercount 的公开事件端点，也可通过 `PUBLIC_VERCOUNT_ENDPOINT`（兼容旧拼写 `PUBLIC_VERCOUT_ENDPOINT`）覆盖。端点接收 JSON `POST` 请求：

```json
{ "url": "https://bilbillm.github.io/articles/example/", "isNewUv": true }
```

响应需要在根对象或 `data` 中提供 `site_pv`、`site_uv` 和 `page_pv`。浏览器启用 Do Not Track 时不会发出请求；请求失败或响应无效时，计数器保持隐藏，不影响阅读。
