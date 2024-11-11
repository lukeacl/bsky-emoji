import { createSignal, createEffect, onMount, For } from "solid-js";

function App() {
  const [data, setData] = createSignal({});
  const [all, setAll] = createSignal("");

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

  const fetchAll = async () => {
    const result = await fetch("https://bsky-emoji-api.lukeacl.com/all");
    const text = await result.text();
    setAll(text);
  };

  onMount(async () => {
    await fetchFresh();
    connect();
    setInterval(async () => {
      await fetchAll();
    }, 5000);
    await fetchAll();
  });

  const emojiRow = (title, emoji) => (
    <>
      <span class="font-semibold mt-4 mb-1">{title}</span>
      <div class="flex flex-row justify-center bg-sky-100 rounded-lg">
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
    <>
      <span class="background">{all()}</span>
      <span class="background-cover"></span>
      <div class="flex flex-col items-center px-5 py-5">
        <span class="font-semibold text-2xl">Bluesky Emoji</span>

        {emojiRow("One Minute", data().oneMinute)}

        {emojiRow("One Hour", data().oneHour)}

        {emojiRow("One Day", data().oneDay)}

        {emojiRow("All Time", data().all)}

        <span class="font-light text-s opacity-75 mt-6">
          💕{" "}
          <a href="https://bsky.app/profile/lukeacl.com" target="_blank">
            @lukeacl.com
          </a>
        </span>
        <span class="font-extralight text-xs opacity-50 mt-1">
          {data().size} - {(data().emoji * 1).toLocaleString()} Emoji Counted
        </span>
      </div>
    </>
  );
}

export default App;
