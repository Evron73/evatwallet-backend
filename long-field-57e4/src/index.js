import { createServer } from "http";
import { createApp } from "../server.js";

export default {
  async fetch(request, env, ctx) {
    const app = createApp();

    return new Promise((resolve) => {
      const server = createServer((req, res) => app(req, res));
      req = new Request(request);
      res = {
        writeHead: (status, headers) => {
          res.status = status;
          res.headers = headers;
        },
        end: (body) => {
          resolve(
            new Response(body, {
              status: res.status || 200,
              headers: res.headers || {},
            })
          );
        },
      };
      server.emit("request", req, res);
    });
  },
};
