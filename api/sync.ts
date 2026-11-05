import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({
      error: 'DATABASE_URL environment variable is not configured on the server.',
    });
  }

  const sql = neon(databaseUrl);

  try {
    // Ensure table exists on first run
    await sql`
      CREATE TABLE IF NOT EXISTS user_sync (
        email VARCHAR(255) PRIMARY KEY,
        last_read JSONB NOT NULL,
        bookmarks JSONB NOT NULL DEFAULT '[]'::jsonb,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // Handle GET: Fetch user cloud state
    if (req.method === 'GET') {
      const emailParam = (req.query?.email as string)?.trim().toLowerCase();
      if (!emailParam || !emailParam.includes('@')) {
        return res.status(400).json({ error: 'A valid email address is required.' });
      }

      const rows = await sql`
        SELECT email, last_read, bookmarks, settings, updated_at
        FROM user_sync
        WHERE email = ${emailParam}
      `;

      if (rows.length === 0) {
        return res.status(200).json({ exists: false });
      }

      const row = rows[0];
      return res.status(200).json({
        exists: true,
        data: {
          email: row.email,
          lastRead: row.last_read,
          bookmarks: row.bookmarks,
          settings: row.settings,
          updatedAt: row.updated_at,
        },
      });
    }

    // Handle POST: Upsert user state (save/override)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const email = body?.email?.trim().toLowerCase();
      const lastRead = body?.lastRead;
      const bookmarks = body?.bookmarks || [];
      const settings = body?.settings || {};

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'A valid email address is required.' });
      }

      if (!lastRead || typeof lastRead.surah !== 'number' || typeof lastRead.aya !== 'number') {
        return res.status(400).json({ error: 'Valid lastRead progress is required.' });
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

      const row = rows[0];
      return res.status(200).json({
        success: true,
        data: {
          email: row.email,
          lastRead: row.last_read,
          bookmarks: row.bookmarks,
          settings: row.settings,
          updatedAt: row.updated_at,
        },
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Neon Sync API Error:', err);
    return res.status(500).json({
      error: err.message || 'Internal database error during synchronization.',
    });
  }
}
