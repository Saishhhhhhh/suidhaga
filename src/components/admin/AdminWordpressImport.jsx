import React, { useState } from 'react';
import { Globe, FileSpreadsheet, RefreshCw, CheckCircle, AlertCircle, HelpCircle, ArrowRight, Sparkles, Upload } from 'lucide-react';

export default function AdminWordpressImport({ token, onProductUpdated }) {
  const [activeTab, setActiveTab] = useState('api'); // 'api' | 'csv' | 'seed' | 'guide'

  // API State
  const [siteUrl, setSiteUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [perPage, setPerPage] = useState(50);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  // CSV State
  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);

  // Seed State
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  // 1. Direct WooCommerce API Import
  const handleApiImport = async (e) => {
    e.preventDefault();
    if (!siteUrl.trim()) return;

    setApiLoading(true);
    setApiResult(null);

    try {
      const res = await fetch('/api/import/wordpress-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteUrl, consumerKey, consumerSecret, perPage }),
      });

      const data = await res.json();
      setApiResult(data);
      if (data.success && onProductUpdated) onProductUpdated();
    } catch (err) {
      setApiResult({ success: false, message: 'Failed to contact WordPress importer endpoint' });
    } finally {
      setApiLoading(false);
    }
  };

  // 2. CSV Import
  const handleCsvImport = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    setCsvLoading(true);
    setCsvResult(null);

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const res = await fetch('/api/import/wordpress-csv', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setCsvResult(data);
      if (data.success && onProductUpdated) onProductUpdated();
    } catch (err) {
      setCsvResult({ success: false, message: 'Failed to upload and parse CSV file' });
    } finally {
      setCsvLoading(false);
    }
  };

  // 3. One-Click Demo Seed
  const handleSeed = async () => {

    setSeedLoading(true);
    setSeedResult(null);

    try {
      const res = await fetch('/api/import/seed-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSeedResult(data);
      if (data.success && onProductUpdated) onProductUpdated();
    } catch (err) {
      setSeedResult({ success: false, message: 'Failed to seed catalogue' });
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="font-display maroon-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          Import Products from WordPress / WooCommerce
        </h2>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem' }}>
          Seamlessly bring your existing product catalogue from your WordPress or WooCommerce store into MongoDB.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #dcd1c6', paddingBottom: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('api')}
          className={activeTab === 'api' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
        >
          <Globe size={16} />
          <span>Direct WordPress API Sync</span>
        </button>

        <button
          onClick={() => setActiveTab('csv')}
          className={activeTab === 'csv' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
        >
          <FileSpreadsheet size={16} />
          <span>WooCommerce CSV Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('seed')}
          className={activeTab === 'seed' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
        >
          <Sparkles size={16} />
          <span>Curated Sui-Dhaga Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={activeTab === 'guide' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
        >
          <HelpCircle size={16} />
          <span>Step-by-Step Export Guide</span>
        </button>
      </div>

      {/* TAB 1: DIRECT API */}
      {activeTab === 'api' && (
        <div className="card-luxury" style={{ padding: '2rem', maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Globe size={24} color="var(--maroon-800)" />
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Live WordPress / WooCommerce REST API Sync
            </h3>
          </div>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Enter your WordPress URL and optional WooCommerce REST API credentials. Products, pricing, images, categories, and stock will automatically be fetched and saved to MongoDB.
          </p>

          <form onSubmit={handleApiImport}>
            <div className="form-group">
              <label className="form-label">WordPress Site URL *</label>
              <input
                type="url"
                required
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://yourwordpresssite.com"
                className="form-input"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                e.g. <code>https://suidhaga.in</code> or <code>https://example.com</code>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">WooCommerce Consumer Key (Optional)</label>
                <input
                  type="text"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxx"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">WooCommerce Consumer Secret (Optional)</label>
                <input
                  type="password"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxx"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Products to Fetch per Batch</label>
              <input
                type="number"
                min={1}
                max={100}
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="form-input"
                style={{ maxWidth: '140px' }}
              />
            </div>

            <button
              type="submit"
              disabled={apiLoading}
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.8rem', marginTop: '0.5rem' }}
            >
              <RefreshCw size={17} className={apiLoading ? 'animate-spin' : ''} />
              <span>{apiLoading ? 'Connecting to WordPress...' : 'Connect & Import to MongoDB'}</span>
            </button>
          </form>

          {apiResult && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: apiResult.success ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${apiResult.success ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: apiResult.success ? '#16a34a' : '#dc2626' }}>
                {apiResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{apiResult.message}</span>
              </div>
              {apiResult.importedCount !== undefined && (
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-dark)' }}>
                  Total Imported / Updated: <strong>{apiResult.importedCount}</strong> products.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CSV UPLOAD */}
      {activeTab === 'csv' && (
        <div className="card-luxury" style={{ padding: '2rem', maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <FileSpreadsheet size={24} color="var(--maroon-800)" />
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Upload WooCommerce Export CSV File
            </h3>
          </div>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Export your products from WooCommerce as CSV (via <em>WP Admin &gt; Products &gt; Export</em>), then upload the file here. The system parses title, price, descriptions, images, categories, and stock quantity directly into MongoDB.
          </p>

          <form onSubmit={handleCsvImport}>
            <div
              style={{
                border: '2px dashed #c4b5a8',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--ivory-surface)',
                cursor: 'pointer',
                marginBottom: '1.5rem',
              }}
              onClick={() => document.getElementById('csv-file-input').click()}
            >
              <Upload size={38} color="var(--maroon-800)" style={{ margin: '0 auto 0.8rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                {csvFile ? csvFile.name : 'Click to select WooCommerce products.csv file'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Supports standard WooCommerce CSV format with headers: Name, Price, Images, Categories, etc.
              </div>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => setCsvFile(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              disabled={csvLoading || !csvFile}
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.8rem' }}
            >
              <Upload size={17} />
              <span>{csvLoading ? 'Parsing & Saving to MongoDB...' : 'Process & Import CSV'}</span>
            </button>
          </form>

          {csvResult && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: csvResult.success ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${csvResult.success ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: csvResult.success ? '#16a34a' : '#dc2626' }}>
                {csvResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{csvResult.message}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEED DEMO */}
      {activeTab === 'seed' && (
        <div className="card-luxury" style={{ padding: '2rem', maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Sparkles size={24} color="#d4af37" />
            <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Curated Sui-Dhaga Ethnic Catalog
            </h3>
          </div>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Instantly populate your MongoDB database with Sui-Dhaga's 7 signature Indian ethnic wear pieces (Regal Maroon Velvet Gown, Noor Anarkali, Zeenat Emerald Kurta, Meher Blush Lehenga, Jashn Sharara, Roohani Organza Saree, and Sitara Wine Cape Set) complete with high-resolution imagery and sizes.
          </p>

          <button
            onClick={handleSeed}
            disabled={seedLoading}
            className="btn btn-gold btn-lg"
          >
            <Sparkles size={18} />
            <span>{seedLoading ? 'Seeding MongoDB Atlas...' : 'Seed Signature Sui-Dhaga Collection'}</span>
          </button>

          {seedResult && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.2rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: seedResult.success ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${seedResult.success ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: seedResult.success ? '#16a34a' : '#dc2626' }}>
                {seedResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{seedResult.message}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STEP-BY-STEP GUIDE */}
      {activeTab === 'guide' && (
        <div className="card-luxury" style={{ padding: '2rem', maxWidth: '850px' }}>
          <h3 className="font-display maroon-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            How to Export Products From WordPress / WooCommerce
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--maroon-800)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Method 1: Exporting as CSV (Fastest & Easiest)</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.5 }}>
                  1. Log into your WordPress Dashboard (<code>yourdomain.com/wp-admin</code>).<br />
                  2. Navigate to <strong>Products &gt; All Products</strong>.<br />
                  3. Click the <strong>Export</strong> button at the very top of the page.<br />
                  4. In the export popup, select <em>Export all columns</em> and <em>Export all products</em>.<br />
                  5. Click <strong>Generate CSV</strong> and download the file.<br />
                  6. Switch to the <strong>WooCommerce CSV Upload</strong> tab above and drag & drop the file!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--gold-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Method 2: Generating WooCommerce REST API Keys</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: 1.5 }}>
                  1. In WP Admin, go to <strong>WooCommerce &gt; Settings &gt; Advanced &gt; REST API</strong>.<br />
                  2. Click <strong>Add Key</strong>.<br />
                  3. Enter a description like <em>"Sui Dhaga Sync"</em> and set permissions to <strong>Read</strong>.<br />
                  4. Click <strong>Generate API Key</strong>.<br />
                  5. Copy the <strong>Consumer Key</strong> (starts with <code>ck_...</code>) and <strong>Consumer Secret</strong> (starts with <code>cs_...</code>).<br />
                  6. Paste them in the <strong>Direct WordPress API Sync</strong> tab and click Import!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
