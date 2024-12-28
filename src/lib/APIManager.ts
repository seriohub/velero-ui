'use client';
import * as dotenv from 'dotenv';
import { env } from 'next-runtime-env';

// load enviroments variables from file .env
dotenv.config();

interface APIManagerConfigInterface {
  name: string;
  url: string;
  ws: string;
}

function APIManager(): APIManagerConfigInterface[] {
  const configs: APIManagerConfigInterface[] = [];

  let name = env(`NEXT_PUBLIC_VELERO_API_NAME_1`) || '<cluster name not set>';
  let url = env(`NEXT_PUBLIC_VELERO_API_URL_1`);
  let ws = env(`NEXT_PUBLIC_VELERO_API_WS_1`);

  if (name && url && ws) {
    configs.push({ name, url, ws });
  }

  name = env(`NEXT_PUBLIC_VELERO_API_NAME_2`) || '<cluster name not set>';
  url = env(`NEXT_PUBLIC_VELERO_API_URL_2`);
  ws = env(`NEXT_PUBLIC_VELERO_API_WS_2`);

  if (name && url && ws) {
    configs.push({ name, url, ws });
  }

  if (configs.length == 0) {
    const name = env(`NEXT_PUBLIC_VELERO_API_NAME`) || '<cluster name not set>';
    const url = env(`NEXT_PUBLIC_VELERO_API_URL`);
    const ws = env(`NEXT_PUBLIC_VELERO_API_WS`);
    if (name && url && ws) {
      configs.push({ name, url, ws });
    }
  }

  return configs;
}

export { APIManager };
export type { APIManagerConfigInterface as ServerApiConfig };
