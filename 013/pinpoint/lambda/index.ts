// email_handler.ts

import { Context } from 'aws-lambda';
import { Pinpoint } from 'aws-sdk';

export async function handler(event: any, context: Context) {
  const pinpointAppId = process.env.PINPOINT_APPLICATION_ID;
  const emailIdentity = process.env.EMAIL_IDENTITY;

  if (!pinpointAppId || !emailIdentity) {
    throw new Error('PINPOINT_APPLICATION_ID or EMAIL_IDENTITY environment variables are not set.');
  }

  // Create Pinpoint client
  const pinpointClient = new Pinpoint();

  // Define the message
  const message = {
    ApplicationId: pinpointAppId,
    MessageRequest: {
      Addresses: {
        [emailIdentity]: {
          ChannelType: 'EMAIL',
        },
      },
      MessageConfiguration: {
        EmailMessage: {
          SimpleEmail: {
            Subject: {
              Data: 'Test Subject',
              Charset: 'UTF-8',
            },
            Body: {
              Text: {
                Data: 'Hello, this is a test email from Lambda!',
                Charset: 'UTF-8',
              },
            },
          },
        },
      },
    },
  };

  // Send email using Pinpoint
  await pinpointClient.sendMessages(message).promise();

  console.log('Email sent successfully.');

  return {
    statusCode: 200,
    body: JSON.stringify('Email sent successfully!'),
  };
}
