'use strict';

process.env['pubsub-topic'] = 'TESTTOPIC';

const { stub } = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const processor = require('../src/processor');

const context = {
  eventId: '5b83b6c4-0910-4a5e-9d73-1921123ac6ca-0',
  eventType: 'providers/cloud.firestore/eventTypes/document.update',
  notSupported: {},
  params: { providerId: '10001', staffMemberUid: 'TEST-STAFF-UID' },
  resource:
    'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001/staff/TEST-STAFF-UID',
  timestamp: '2019-10-25T14:48:48.021215Z'
};

describe('staff-request-accepted-notification-publisher: unit tests', () => {
  let topic;

  before(() => {
    topic = {
      publish: stub().resolves()
    };
  });

  afterEach(() => {
    topic.publish.resetHistory();
  });

  it('should publish a message to pubsub', () => {
    const data = {
      value: {
        fields: {
          providerId: { stringValue: '101' },
          businessName: { stringValue: 'TEST-BUSINESS-NAME' },
          requestorUid: { stringValue: 'TEST-REQUESTOR-UID' },
          requestedStaffMemberEmail: { stringValue: 'test@test.com' },
          status: { stringValue: 'ACCEPTED' }
        }
      },
      oldValue: {
        fields: {
          status: { stringValue: 'NEW' }
        }
      }
    };

    const notification = {
      providerId: '10001',
      businessName: 'TEST-BUSINESS-NAME',
      requestorUid: 'TEST-REQUESTOR-UID',
      staffMemberUid: 'TEST-STAFF-UID',
      requestedStaffMemberEmail: 'test@test.com'
    };

    expect(processor(data, context, topic)).to.be.fulfilled.then(() => {
      expect(topic.publish.called).to.be.true;
      expect(
        topic.publish.calledWith(Buffer.from(JSON.stringify(notification)))
      ).to.be.true;
    });
  });

  it('should not publish a message is status is not proper', () => {
    const data = {
      value: {
        fields: {
          providerId: { stringValue: '101' },
          businessName: { stringValue: 'TEST-BUSINESS-NAME' },
          requestorUid: { stringValue: 'TEST-REQUESTOR-UID' },
          requestedStaffMemberEmail: { stringValue: 'test@test.com' },
          status: { stringValue: 'NEW' }
        }
      },
      oldValue: {}
    };

    expect(processor(data, context, topic)).to.be.fulfilled.then(() => {
      expect(topic.publish.called).to.be.false;
    });
  });
});
