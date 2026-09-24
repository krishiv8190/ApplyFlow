import { useEffect, useState } from 'react';

import { getGmailAuthorizationUrl, getGmailStatus, syncGmailApplications } from '../../api/gmail';
import { useApplications } from '../applications/ApplicationContext';
import { useAuth } from '../auth/useAuth';
import { useTheme } from '../theme/useTheme';

export function SettingsPage() {
  const { user } = useAuth();
  const { loadApplications } = useApplications();
  const { theme, toggleTheme } = useTheme();

  const [isConnecting, setIsConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [loadingGmailStatus, setLoadingGmailStatus] = useState(true);

  const [error, setError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    async function loadGmailStatus() {
      try {
        const status = await getGmailStatus();

        setGmailConnected(status.connected);
        setGmailEmail(status.email);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load Gmail status.');
      } finally {
        setLoadingGmailStatus(false);
      }
    }

    loadGmailStatus();
  }, []);

  async function handleConnectGmail() {
    setError('');
    setSyncMessage('');
    setIsConnecting(true);

    try {
      const authorizationUrl = await getGmailAuthorizationUrl();

      window.location.href = authorizationUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect Gmail.');

      setIsConnecting(false);
    }
  }

  async function handleSyncGmail() {
    setError('');
    setSyncMessage('');
    setSyncing(true);

    try {
      const results = await syncGmailApplications();

      await loadApplications();

      const created = results.filter((result) => result.action === 'created').length;

      const updated = results.filter((result) => result.action === 'updated').length;

      const skipped = results.filter((result) => result.action === 'skipped').length;

      setSyncMessage(`Sync complete: ${created} created, ${updated} updated, ${skipped} skipped.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sync Gmail.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-slate-800 pb-8">
        <p className="text-sm font-medium text-indigo-300">SETTINGS</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Account settings</h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Manage your ApplyFlow account and integrations.
        </p>
      </header>

      {/* Gmail integration */}
      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white">Gmail integration</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Connect Gmail so ApplyFlow can find job-related emails and automatically update your
          application pipeline.
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {loadingGmailStatus ? (
              <>
                <p className="text-sm font-medium text-slate-200">Checking Gmail connection...</p>

                <p className="mt-1 text-xs text-slate-500">Please wait.</p>
              </>
            ) : gmailConnected ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <p className="text-sm font-medium text-slate-200">Gmail connected</p>
                </div>

                <p className="mt-1 text-xs text-slate-500">{gmailEmail}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-200">Gmail not connected</p>

                <p className="mt-1 text-xs text-slate-500">
                  Connect a Gmail account to import applications.
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {!loadingGmailStatus && gmailConnected && (
              <button
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={syncing}
                onClick={handleSyncGmail}
                type="button"
              >
                {syncing ? 'Syncing...' : 'Sync Gmail'}
              </button>
            )}

            {!loadingGmailStatus && !gmailConnected && (
              <button
                className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isConnecting}
                onClick={handleConnectGmail}
                type="button"
              >
                {isConnecting ? 'Connecting...' : 'Connect Gmail'}
              </button>
            )}
          </div>
        </div>

        {syncMessage && <p className="mt-4 text-sm text-emerald-400">{syncMessage}</p>}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </section>

      {/* Appearance */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white">Appearance</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Choose how ApplyFlow looks on your device.
        </p>

        <div className="mt-5 flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-200">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {theme === 'dark'
                ? 'Using the dark ApplyFlow theme.'
                : 'Using the light ApplyFlow theme.'}
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            onClick={toggleTheme}
            type="button"
          >
            Switch to {theme === 'dark' ? 'light' : 'dark'}
          </button>
        </div>
      </section>

      {/* Account */}
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white">Account</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">Your ApplyFlow account information.</p>

        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">ApplyFlow account</p>

          <p className="mt-1 text-sm font-medium text-slate-200">{user?.email}</p>
        </div>
      </section>
    </div>
  );
}
