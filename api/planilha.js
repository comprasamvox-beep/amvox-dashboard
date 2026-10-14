// Busca a planilha Compras_Nacionais_Amvox_2026.xlsx no OneDrive (link de compartilhamento)
// e entrega ao dashboard. O link fica na variável de ambiente ONEDRIVE_URL (Vercel > Settings > Environment Variables).
module.exports = async (req, res) => {
  const link = (process.env.ONEDRIVE_URL || '').trim();
  if (!link) {
    res.status(500).send('Variável ONEDRIVE_URL não configurada no Vercel.');
    return;
  }
  const tentativas = [];
  try {
    const u = new URL(link);
    if (/sharepoint\.com$/i.test(u.hostname)) {           // OneDrive corporativo (Microsoft 365)
      u.searchParams.set('download', '1');
      tentativas.push(u.toString());
    }
    const b64 = Buffer.from(link).toString('base64').replace(/=+$/, '').replace(/\//g, '_').replace(/\+/g, '-');
    tentativas.push('https://api.onedrive.com/v1.0/shares/u!' + b64 + '/root/content'); // OneDrive pessoal
    if (!/sharepoint\.com$/i.test(u.hostname)) { u.searchParams.set('download', '1'); tentativas.push(u.toString()); }
  } catch (e) {
    res.status(500).send('ONEDRIVE_URL inválida.');
    return;
  }
  const erros = [];
  for (const url of tentativas) {
    try {
      const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 amvox-dashboard' } });
      if (!r.ok) { erros.push(r.status); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 4 || buf[0] !== 0x50 || buf[1] !== 0x4b) { erros.push('não é xlsx (link exige login?)'); continue; }
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      const lm = r.headers.get('last-modified');
      if (lm) res.setHeader('X-Atualizado-Em', lm);
      res.status(200).send(buf);
      return;
    } catch (e) { erros.push(e.message); }
  }
  res.status(502).send('Não foi possível baixar a planilha do OneDrive: ' + erros.join(' | '));
};
