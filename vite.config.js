import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fails a production build that would deploy a site nobody can sign in to.
//
// .env.local is gitignored, so it never reaches Netlify — the values have to be
// set in the Netlify dashboard instead. Forget that and the build still
// succeeds, deploys cleanly, and every visitor hits a login screen that cannot
// work. That failure is invisible until someone tries to use the site.
//
// Dev is left alone: a fresh clone with no .env.local should still start, and
// the OTP flow falls back to an on-screen code there.
const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']

function requireEnvForBuild(mode) {
  return {
    name: 'mediverse:require-env-for-build',
    apply: 'build',
    config() {
      const env = loadEnv(mode, process.cwd(), '')
      // Demo builds sign in with an on-screen code and need no backend.
      if (env.VITE_DEMO_OTP === 'true') return
      const missing = REQUIRED.filter((k) => !env[k])
      if (missing.length) {
        throw new Error(
          `\nProduction build blocked — missing: ${missing.join(', ')}\n` +
            `Sign-in needs these. Set them under Netlify > Site configuration >\n` +
            `Environment variables, then redeploy. Values are in your .env.local.\n`,
        )
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), requireEnvForBuild(mode)],
}))
