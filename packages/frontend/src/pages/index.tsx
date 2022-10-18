import { useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import { LedColor } from "../types";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useColor = () =>
  useSWR<{ color: LedColor }>("api/getColor", fetcher, {
    refreshInterval: 1000,
  });

const Container = ({ children }) => {
  const { data, error } = useColor();

  let color = "transparent";

  if (error) {
    color = "rgb(0, 0, 0)";
  }

  if (data) {
    color = `rgb(${data.color.red}, ${data.color.green}, ${data.color.blue})`;
  }

  return (
    <main
      className="transition-colors w-full h-full flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      {children}
    </main>
  );
};

const GlobalStyle = () => {
  return (
    <style global jsx>{`
      html,
      body,
      #__next {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
        background-color: black;
      }
    `}</style>
  );
};

const ColorPicker = () => {
  const [color, setColor] = useState("#000000");
  const [red, green, blue] = color
    .replace("#", "")
    .match(/.{1,2}/g)
    .map((c) => parseInt(c, 16));

  const intensity = red * 0.299 + green * 0.587 + blue * 0.114;

  const contrastingColor = intensity > 186 ? "#000000" : "#ffffff";

  return (
    <div className="flex align-center justify-center flex-col w-9/12 bg-white/50 rounded-md h-48 p-8 max-w-screen-sm shadow-md">
      <label htmlFor="color" className="block font-medium">
        Pick a color
      </label>
      <input
        type="color"
        id="color"
        name="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="block w-full rounded-md px-2 mb-1 bg-white/50"
      />

      <button
        onClick={async () => {
          await fetch("/api/setColor", {
            method: "POST",
            body: JSON.stringify({ red, green, blue }),
          });
        }}
        style={{
          backgroundColor: color,
          color: contrastingColor,
        }}
        className="rounded-md px-4 py-2 m-2 transition duration-500 ease select-none shadow-md"
      >
        Set Color
      </button>
    </div>
  );
};

export default function Index() {
  return (
    <Container>
      <Head>
        <title>Pick a color!</title>
      </Head>
      <GlobalStyle />
      <ColorPicker />
    </Container>
  );
}
