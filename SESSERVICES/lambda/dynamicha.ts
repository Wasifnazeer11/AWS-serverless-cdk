import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const ses = new AWS.SES();

  try {
    // Parse the request body to get recipient addresses
    const requestBody = JSON.parse(event.body || '');
    const recipients = requestBody.recipients || ['printwala021@gmail.com'];
    const subject = requestBody.subject || 'Kuch to likh leta';
    const message = requestBody.message || 'Body Pass kar ab dubara';

    // Check if recipients array is empty
    if (recipients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No recipients provided' }),
      };
    }

    // Prepare SES email sending parameters
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

    // Send the email
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


// curl -X POST -H "Content-Type: application/json" -d '{
//     "recipients": ["recipient1@example.com", "recipient2@example.com"],
//     "subject": "Custom Subject",
//     "message": "Custom Message"
//   }' https://your-api-gateway-url.execute-api.your-region.amazonaws.com/your-resource-path
  