import { useEffect, useState } from "react";
import { useActionCable, useChannel } from "react-use-action-cable-ts";

type ActionCableMessagePayload = {
  type: string;
  message: Record<string, unknown>;
}

const Home = () => {
  const [data, setData] = useState({
    type: "",
    message: {}
  });

  const { actionCable } = useActionCable(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_CONNECTION_URL}?token=notasecret`, {
      verbose: true
    }
  );

  const { subscribe, unsubscribe } =
    useChannel<ActionCableMessagePayload>(actionCable);

  useEffect(() => {
    subscribe(
      { channel: "MessagesChannel" },
      {
        received: (data) => {
          console.log("I received data!", data);
          setData(data);
        }
      }
    );
    return unsubscribe;
  }, [subscribe, unsubscribe]);

  return <code><pre>{JSON.stringify(data, null, 2)}</pre></code>;
};

export default Home;
