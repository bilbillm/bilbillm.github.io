# Lumoren public websites

`lumoren/` is the maintained, buildless source for https://lumoren.cn/. It retains the original sunset image and editorial palette, lists four deployed projects, links actual blog articles and contains small open-source project entries. `site.js` handles themes, accessible mobile navigation and restrained motion with reduced-motion support. The public homepage needs no login.

The static blog remains at https://blog.lumoren.cn/. This update corrects the generated theme description and GitHub profile links. When regenerating the blog from Hexo, preserve those values in its source theme configuration as well.

## Server publication

The existing Caddy container reads `/home/admin/blog-site` as `/srv-blog`. Publish homepage assets to `/home/admin/blog-site/lumoren/`, then replace its index document. Preserve other blog files. Publish only the changed generated blog HTML documents when updating metadata. The server applies no-cache headers.

The generic Authelia shell under `lumoren/auth/` is served only by the existing authentication host's Caddy routes; its relative API/static paths remain handled by the original pinned Authelia service. It contains no passwords or session secrets. The login portal is https://auth.admin.wmuwall.lumoren.cn/.

Public: homepage, blog, campus wall and association site. Private: Convert, resource dashboard and existing admin gateways. Study keeps its independent access behavior and is described as a temporary competition project.

Deploying the Caddy/Authelia configuration is a separate private server operation. Runtime configuration, password hashes, credentials, cookies, databases and backups must not enter this repository. See `/srv/lumoren-access/README.md` on the server for the active deployment and rollback record.
