import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';


exports.handler = async (event: APIGatewayProxyEvent) => {
  const ses = new AWS.SES();

  const recipients = ['printwala021@gmail.com', 'shayanamaralie@gmail.com']; // Add your email recipients here
  const subject = 'Pakar email';
  const message = 'Aik sath sb ko bhejy ga me';

  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: 'wasifnazeer11@gmail.com', // Replace with your sender email address
  };

  try {
    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending emails', error }),
    };
  }
};
