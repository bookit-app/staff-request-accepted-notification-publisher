'use strict';

const logger = require('./logger');
const { isEmpty } = require('lodash');

/**
 * Generates a PubSub notification with details
 * of the service provider staff member which was impacted. The following
 * information is placed into the notification
 *
 * {
 * "providerId": string,
 * "businessName": string,
 * "requestorUid": string,
 * "staffMemberUid": string,
 * "requestedStaffMemberEmail": string
 * }
 *
 * @param {*} data
 * @param {*} context
 * @returns {Promise<void>}
 */
module.exports = async (data, context, topic) => {
  const { params } = context;
  const oldStatus = getStatus(data.oldValue.fields);
  const newStatus = getStatus(data.value.fields);

  if (oldStatus !== newStatus && newStatus === 'ACCEPTED') {
    return generateNotification(params, data.value.fields, topic);
  }

  logger.info('Skipping notification generation as status is not correct');
};

function getStatus(fields) {
  if (isEmpty(fields) || isEmpty(fields.status)) {
    return '';
  }

  return fields.status.stringValue;
}

function generateNotification(params, fields, topic) {
  const notification = {
    providerId: fields.providerId.stringValue,
    businessName: fields.businessName.stringValue,
    requestorUid: fields.requestorUid.stringValue,
    staffMemberUid: fields.staffMemberUid.stringValue,
    requestedStaffMemberEmail: fields.requestedStaffMemberEmail.stringValue
  };

  logger.info(
    `Generating staff notification accepted event for ${JSON.stringify(
      notification
    )}`
  );

  // Generate pubsub notification
  return topic.publish(Buffer.from(JSON.stringify(notification)));
}
