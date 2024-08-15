import { createSignal, Component, For } from "solid-js";
import { createColor } from "./createColor";
import { ContrastLevelType, VariantType } from "./schemes";

const Playground: Component = () => {
  const [color, setColor] = createSignal("#FFDE3F");
  const [variant, setVariant] = createSignal<VariantType>("tonal_spot");
  const [isDark, setDark] = createSignal(false);
  const [contrastLevel, setContrastLevel] =
    createSignal<ContrastLevelType>("default");

  const [scheme, state] = createColor({
    source: color,
    variant,
    isDark,
    contrastLevel,
  });

  return (
    <div>
      <div>{state()}</div>
      <div
        style={{
          display: "flex",
          gap: '10px',
          'margin-bottom': '20px',
        }}
      >
        <input
          type="color"
          value={color()}
          onChange={(e) => setColor(e.target.value)}
        />

        <select
          value={isDark() ? "dark" : "light"}
          onChange={(e) => setDark(e.target.value === "dark")}
        >
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>

        <select
          value={variant()}
          onChange={(e) => setVariant(e.target.value as VariantType)}
        >
          <option value="neutral">neutral</option>
          <option value="monochrome">monochrome</option>
          <option value="tonal_spot">tonal_spot</option>
          <option value="vibrant">vibrant</option>
          <option value="expressive">expressive</option>
          <option value="fidelity">fidelity</option>
          <option value="content">content</option>
          <option value="rainbow">rainbow</option>
          <option value="fruit_salad">fruit_salad</option>
          <option value="image_fidelity">image_fidelity</option>
        </select>

        <select
          value={contrastLevel()}
          onChange={(e) =>
            setContrastLevel(e.target.value as ContrastLevelType)
          }
        >
          <option value="default">default</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="reduced">reduced</option>
        </select>
      </div>
      <For each={Object.entries(scheme)} fallback={<div>Loading...</div>}>
        {([key, value]: [string, string]) => <div style={{ display: "flex", gap: '10px', 'margin-top': '5px' }}>
          <span>{key}:</span>
          <span
            style={{
              display: "block",
              border: `1px solid #000`,
              width: '100px',
              height: '20px',
              background: value,
            }}
          />
          <span>{value as string}</span>
        </div>}
      </For>
    </div>
  );
}

export default Playground;
