import { Action, ActionPanel, Grid } from "@raycast/api";
import { useState, useEffect } from "react";
import fetch from "node-fetch";

// It's easy to get a Giphy API key: https://developers.giphy.com/docs/api#quick-start-guide
// Get your own and don't steal mine, please.
const giphyAPIKey = "Cw3z0ImWiQZsmi6ZbPwzmfkmkhiMolqZ";

const GifItem = (item) => (
  <Grid.Item
    key={item.id}
    content={{ source: item.images.preview_gif.url }}
    title={item.title}
    actions={
      <ActionPanel title="Giphy GIF search">
        <Action.Paste content={item.images.original.url} />
        <Action.OpenInBrowser url={item.url} />
        <Action.CopyToClipboard title="Copy URL" content={item.images.original.url} />
      </ActionPanel>
    }
  />
);

const Command = () => {
  const [search, setSearch] = useState("cupcake");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length === 0) {
      setItems([]);
      return;
    }
    setLoading(true);
    // TODO: Use AbortController to cancel previous requests before starting a new one
    //       Also make sure to keep the loading state intact
    fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${giphyAPIKey}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search]);

  return (
    <Grid
      searchText={search}
      onSearchTextChange={setSearch}
      throttle={true}
      aspectRatio="1"
      columns={4}
      searchBarPlaceholder="Search Giphy..."
      isLoading={loading}
      navigationTitle="Giphy Search"
    >
      {items.map(GifItem)}
    </Grid>
  );
};

export default Command;
