import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { neon } from '@neondatabase/serverless';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const dbUrl = env.DATABASE_URL || env.NEON_DATABASE_URL;

  return {
    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'favicon.png', 'apple-touch-icon.png'],
        manifest: {
          name: "Al-Qur'an al-Kareem",
          short_name: "Al-Qur'an",
          description: "Read, Listen and Study the Holy Qur'an with Authentic Uthmānī & IndoPak Scripts",
          theme_color: '#0d9488',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait-primary',
          icons: [
            {
              src: '/favicon.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
      {
        name: 'neon-sync-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith('/api/sync')) {
              return next();
            }

            res.setHeader('Content-Type', 'application/json');

            if (!dbUrl) {
              res.statusCode = 503;
              res.end(
                JSON.stringify({
                  error:
                    'DATABASE_URL is not set in local .env. Configure DATABASE_URL in web/.env to test sync locally.',
                })
              );
              return;
            }

            try {
              const sql = neon(dbUrl);
              await sql`
                CREATE TABLE IF NOT EXISTS user_sync (
                  email VARCHAR(255) PRIMARY KEY,
                  last_read JSONB NOT NULL,
                  bookmarks JSONB NOT NULL DEFAULT '[]'::jsonb,
                  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
              `;

              const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

              if (req.method === 'GET') {
                const email = parsedUrl.searchParams.get('email')?.trim().toLowerCase();
                if (!email) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Valid email is required.' }));
                  return;
                }

                const rows = await sql`
                  SELECT email, last_read, bookmarks, settings, updated_at
                  FROM user_sync
                  WHERE email = ${email}
                `;

                if (rows.length === 0) {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ exists: false }));
                  return;
                }

                const row = rows[0];
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    exists: true,
                    data: {
                      email: row.email,
                      lastRead: row.last_read,
                      bookmarks: row.bookmarks,
                      settings: row.settings,
                      updatedAt: row.updated_at,
                    },
                  })
                );
                return;
              }

              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', (chunk: any) => {
                  bodyStr += chunk;
                });
                req.on('end', async () => {
                  try {
                    const body = JSON.parse(bodyStr || '{}');
                    const email = body?.email?.trim().toLowerCase();
                    const lastRead = body?.lastRead;
                    const bookmarks = body?.bookmarks || [];
                    const settings = body?.settings || {};

                    if (!email) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ error: 'Valid email is required.' }));
                      return;
                    }

                    const rows = await sql`
                      INSERT INTO user_sync (email, last_read, bookmarks, settings, updated_at)
                      VALUES (
                        ${email},
                        ${JSON.stringify(lastRead)}::jsonb,
                        ${JSON.stringify(bookmarks)}::jsonb,
                        ${JSON.stringify(settings)}::jsonb,
                        NOW()
                      )
                      ON CONFLICT (email) DO UPDATE SET
                        last_read = EXCLUDED.last_read,
                        bookmarks = EXCLUDED.bookmarks,
                        settings = EXCLUDED.settings,
                        updated_at = NOW()
                      RETURNING email, last_read, bookmarks, settings, updated_at;
                    `;

                    res.statusCode = 200;
                    res.end(
                      JSON.stringify({
                        success: true,
                        data: {
                          email: rows[0].email,
                          lastRead: rows[0].last_read,
                          bookmarks: rows[0].bookmarks,
                          settings: rows[0].settings,
                          updatedAt: rows[0].updated_at,
                        },
                      })
                    );
                  } catch (e: any) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: e.message }));
                  }
                });
                return;
              }

              next();
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        },
      },
    ],
  };
});
