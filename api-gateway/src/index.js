import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request: ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error');
    },
  }));
app.use('/tasks', createProxyMiddleware({
    target: process.env.TASK_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request: ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error');
    },
  }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
