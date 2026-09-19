import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from '../config.js';
import { logger } from './logger.js';

export function initFirebaseAdmin() {
  if (getApps().length > 0) return;

  try {
    if (config.firebase.serviceAccountPath) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(config.firebase.serviceAccountPath);
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp({ projectId: config.firebase.projectId || 'demo' });
    }
    logger.info('Firebase Admin initialized');
  } catch (err) {
    logger.warn({ err }, 'Firebase Admin init failed (dev mode)');
  }
}

export { getAuth };
