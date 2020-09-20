import { sleep } from '../common/sleep';

export const hello = async (event, context) => {
  await sleep(1000);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! Your function executed successfully (with delay)`,
    }),
  };
};