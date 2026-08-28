<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap — Girionix AI</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #07080f;
            color: #e2e8f0;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }
          .header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(0, 240, 255, 0.2);
          }
          h1 {
            font-size: 26px;
            color: #00f0ff;
            margin: 0 0 8px 0;
            font-weight: 700;
          }
          p {
            color: #94a3b8;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
          }
          .stats {
            margin-top: 12px;
            display: inline-block;
            background: rgba(0, 240, 255, 0.1);
            border: 1px solid rgba(0, 240, 255, 0.25);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            color: #00f0ff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #0d0f1d;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-top: 16px;
          }
          th {
            background: #121528;
            color: #38bdf8;
            text-align: left;
            padding: 12px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          td {
            padding: 12px 16px;
            font-size: 13px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            word-break: break-all;
          }
          tr:hover td {
            background: rgba(0, 240, 255, 0.04);
          }
          a {
            color: #00f0ff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
          }
          .freq {
            color: #cbd5e1;
            font-size: 12px;
            text-transform: capitalize;
          }
          .date {
            color: #64748b;
            font-size: 12px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ Girionix AI — XML Sitemap</h1>
            <p>This XML sitemap is indexed by Google, Bing, and other search engines to discover all URLs on <strong>https://girionix-ai.pages.dev/</strong>.</p>
            <div class="stats">
              Total Indexable URLs: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL / Location</th>
                <th style="width: 12%;">Priority</th>
                <th style="width: 13%;">Change Freq</th>
                <th style="width: 20%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="badge"><xsl:value-of select="sitemap:priority"/></span>
                  </td>
                  <td>
                    <span class="freq"><xsl:value-of select="sitemap:changefreq"/></span>
                  </td>
                  <td>
                    <span class="date"><xsl:value-of select="sitemap:lastmod"/></span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
