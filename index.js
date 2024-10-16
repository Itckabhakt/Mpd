const { createServer } = require("http");
const https = require("https");
const url = require("url");

const proxyServer = createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const targetUrl = parsedUrl.query.id;

  if (!targetUrl || !targetUrl.startsWith("http")) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid or missing 'id' parameter.");
    return;
  }

  const options = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
      "Referer": "https://mpd-six.vercel.app/",
      "Origin": "https://mpd-six.vercel.app/"
    },
  };

  https.get(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    });
    proxyRes.pipe(res);
  }).on("error", (e) => {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("An error occurred: " + e.message);
  });
});

module.exports = proxyServer;
