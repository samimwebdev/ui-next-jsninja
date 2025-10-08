// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_PUBLIC_DSN,

    beforeSend(event) {
      //block from different domain, only allow specific domains
      const allowedDomains = [
        'javascript-ninja.com',
        'www.javascript-ninja.com',
        'https://javascript-ninja.com',
        'https://www.javascript-ninja.com',
      ]
      const url = event.request?.url
      if (url) {
        const urlObj = new URL(url)
        if (!allowedDomains.includes(urlObj.hostname)) {
          return null // Drop the event
        }
      }
      return event
    },

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 0.1,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  })
}
