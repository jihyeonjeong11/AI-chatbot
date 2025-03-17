import { createServerAction } from "zsa";
import { createRouteHandlersForAction } from "zsa-openapi";

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode("<p>One</p>");
  await sleep(200);
  yield encoder.encode("<p>Two</p>");
  await sleep(200);
  yield encoder.encode("<p>Three</p>");
}

 const action = createServerAction().handler(async () => {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);

  return new Response(stream);
});

export const { GET } = createRouteHandlersForAction(action);
