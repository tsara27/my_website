// Scoped styles for the printable report / PDF export.
// Everything is prefixed with .report-root so it can be injected into the main page without leaking.
const REPORT_CSS = `
  .report-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; margin: 20px; line-height: 1.4; font-size: 13px; }
  .report-root .header { border-bottom: 2px solid #e11488; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
  .report-root .title { font-size: 24px; font-weight: 800; color: #111; letter-spacing: -0.5px; }
  .report-root .title span { color: #e11488; }
  .report-root .sub { color: #6b7280; font-size: 12px; }
  .report-root .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
  .report-root .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #fafafa; }
  .report-root .card-title { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
  .report-root .card-val { font-size: 18px; font-weight: 800; color: #111; font-family: monospace; }
  .report-root .card-val.accent { color: #e11488; }
  .report-root table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
  .report-root th, .report-root td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; }
  .report-root th { background: #f3f4f6; font-weight: 600; text-transform: uppercase; font-size: 10px; color: #4b5563; }
  .report-root .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
  .report-root .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; display: flex; justify-content: space-between; }
`;
