import type { StoreNode, Store, SetStoreFunction } from "solid-js/store";
import {
  ContrastLevelType,
  SimpleDynamicScheme,
  VariantType,
} from "./schemes";
import { getMaterialColor } from './basic'
import { Accessor, createEffect, createMemo, createRenderEffect, createSignal, Signal } from "solid-js";
import { createStore } from "solid-js/store";

type Props = {
  source: Accessor<string | number>, // hex, rgba or http
  variant?: Accessor<VariantType>,
  contrastLevel?: Accessor<ContrastLevelType>,
  isDark?: Accessor<boolean>,
  crossOrigin?: Accessor<string> // only for image inputs
}

export function createColor(props: Props) {
  const {source, variant, contrastLevel, isDark, crossOrigin} = props;
  const [status, setStatus] = createSignal<'' | "error" | "loading" | "done">('', { name: "count" })
  const [scheme, setScheme] = createStore<SimpleDynamicScheme | {}>({});


  const options = createMemo(() => {
    return {
      variant: variant && variant(),
      contrastLevel: contrastLevel && contrastLevel(),
      isDark: isDark && isDark(),
      crossOrigin: crossOrigin && crossOrigin(),
    }
  })

  const getColor = async () => {
    setStatus("loading")
    const schema = await getMaterialColor(source(), options())
    if(schema === null) {
      setStatus("error")
    } else {
      setScheme(schema)
      setStatus("done")
    }
  }

  createEffect(() => getColor(), [source, options])

  return [scheme, status] as const;
}
