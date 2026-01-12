/**
 * Import  triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-s/v2/https");
 * const {onDocumentWritten} = require("firebase-s/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/s
 */

const {setGlobalOptions} = require("firebase-s");
const {onRequest} = require("firebase-s/https");
const logger = require("firebase-s/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per- limit. You can override the limit for each  using the
// `maxInstances` option in the 's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to s using the v1 API. V1
// s should each use s.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each  can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first s
// https://firebase.google.com/docs/s/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
