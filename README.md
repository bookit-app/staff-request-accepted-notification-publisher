[![Coverage Status](https://coveralls.io/repos/github/bookit-app/staff-request-accepted-notification-publisher/badge.svg?branch=master)](https://coveralls.io/github/bookit-app/staff-request-accepted-notification-publisher?branch=master)

# staff-request-accepted-notification-publisher

Generates notifications to a PubSub topic when staff member request changes are detected with status == ACCEPTED for a Service Provider. This will allow services to be notified of changes so that they can make necessary adjustments to any dependent information.

## Processing

This function hooks to the update event trigger raised by firestore. When the function is triggered it will extract the information about the changes and generate a PubSub message similar to the below:

```json
{
  "providerId": "TEST-PROVIDER",
  "businessName": "TEST-BUSINESS-NAME",
  "requestorUid": "TEST-REQUESTOR",
  "staffMemberUid": "TEST-UID",
  "requestedStaffMemberEmail": "test@test.com"
}
```

## Environment

The function expects some information to be provided within the environment in order to function. The attributes are defined below:

```yaml
pubsub-topic: '<NAME OF THE PUBSUB TOPIC>'
app-log-level: '<DEFAULT LOG LEVEL>'
NODE_ENV: 'production'
```

## Deployment

This is deployed on GCP as a Cloud Function linked to a firestore trigger. The deployment defined within the [cloudbuild.yaml](./cloudbuild.yaml). The deployment expects to find an encrypted file within this repository which contains the environment information that will be associated with the deployed function. The file is decrypted based on encryption keys managed in GCP KMS.
