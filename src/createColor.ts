import {
  ContrastLevelType,
  SimpleDynamicScheme,
  VariantType,
} from "./schemes";
import { getMaterialColor } from './basic'
import { Accessor, createMemo, createResource } from "solid-js";

type Props = {
  source: Accessor<string | number>, // hex, rgba or http
  variant?: Accessor<VariantType>,
  contrastLevel?: Accessor<ContrastLevelType>,
  isDark?: Accessor<boolean>,
  crossOrigin?: Accessor<string> // only for image inputs
}

export function createColor(props: Props) {
  const {source, variant, contrastLevel, isDark, crossOrigin} = props;

  const options = createMemo(() => {
    return {
      variant: variant && variant(),
      contrastLevel: contrastLevel && contrastLevel(),
      isDark: isDark && isDark(),
      crossOrigin: crossOrigin && crossOrigin(),
    }
  })

  const variation = createMemo(() => {
    return {options: options(), source: source()}
  })

  const getColor = async (value: any) => {
    const schema = await getMaterialColor(value.source, value.options)
    if(schema === null) {
      return {}
    } else {
      return schema
    }
  }

  const [resorce] = createResource<any, SimpleDynamicScheme | {}>(variation, getColor)

  const status = createMemo(() => {
    if(resorce.loading) return 'loading'
    else if (resorce.error) return 'error'
    else return 'success'
  })

  return [resorce, status] as const;
}
