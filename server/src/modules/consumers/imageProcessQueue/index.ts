import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  ReceiveMessageCommandInput,
  DeleteMessageCommandInput,
  Message,
} from '@aws-sdk/client-sqs';
import { sqsClient } from '../../../config/aws';
import config from '../../../config/config';
import { wallpaperService } from '../../wallpaper';

const queueUrl = config.aws.sqs.imageProcessorQueueUrl;

const handleMessage = async (message: Message): Promise<void> => {
  try {
    if (message.Body) {
      console.log('Processing message:', message.Body);
      // Process the message
      await wallpaperService.createWallpaper({ ...JSON.parse(message.Body), type: 'wallpaper' });

      // Delete the message after processing
      const deleteParams: DeleteMessageCommandInput = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle as string,
      };
      await sqsClient.send(new DeleteMessageCommand(deleteParams));
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};

const pollMessages = async (): Promise<void> => {
  try {
    const params: ReceiveMessageCommandInput = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };

    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    if (data.Messages) {
      for (const message of data.Messages) {
        await handleMessage(message);
      }
    }
  } catch (error) {
    console.error('Error receiving messages:', error);
  }
};

const startPolling = (): void => {
  console.log('Starting image-processor-queue consumer 🔁...');
  setInterval(pollMessages, 10000);
};

startPolling();
