import { createSignal, createEffect, onMount, For } from "solid-js";

function App() {
  const [data, setData] = createSignal({});

  const connect = () => {
    const ws = new WebSocket("https://bsky-emoji-api.lukeacl.com");
    ws.addEventListener("open", (event) => {});
    ws.addEventListener("close", (event) => {
      setTimeout(() => {
        connect();
      }, 1000);
    });
    ws.addEventListener("error", (event) => {
      ws.close();
      setTimeout(() => {
        connect();
      }, 1000);
    });
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setData(data);
    });
  };

  const fetchFresh = async () => {
    const result = await fetch("https://bsky-emoji-api.lukeacl.com");
    const json = await result.json();
    setData(json);
  };

  onMount(async () => {
    await fetchFresh();
    connect();
  });

  const emojiRow = (title, emoji) => (
    <>
      <span class="font-semibold mt-4 mb-1">{title}</span>
      <div class="flex flex-row justify-center bg-gray-100 rounded-lg">
        <For each={emoji}>{(emoji, i) => emojiRowItem(emoji, i)}</For>
      </div>
    </>
  );

  const emojiRowItem = (emoji, i) => (
    <span class="flex flex-col items-center px-1 py-1 aspect-square">
      <span class="text-2xl">{emoji.emoji}</span>
      <span class="font-light text-xs opacity-50">
        {emoji.count.toLocaleString()}
      </span>
    </span>
  );

  return (
    <div class="flex flex-col items-center px-5 py-5">
      <span class="font-semibold text-2xl">Bluesky Emoji</span>

      {emojiRow("One Minute", data().oneMinute)}

      {emojiRow("One Hour", data().oneHour)}

      {emojiRow("One Day", data().oneDay)}

      {emojiRow("All Time", data().all)}

      <span class="font-light text-s opacity-75 mt-4">
        💕{" "}
        <a href="https://bsky.app/profile/lukeacl.com" target="_blank">
          @lukeacl.com
        </a>
      </span>
      <span class="font-extralight text-xs opacity-25 mt-1">
        {data().size} - {(data().rows * 1).toLocaleString()} Rows
      </span>
    </div>
  );
}

export default App;
