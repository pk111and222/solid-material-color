import {
  hexFromArgb,
  argbFromHex,
  Hct,
} from "@material/material-color-utilities";
import {
  buildDynamicScheme,
  ContrastLevelType,
  ContrastLevelTypeMap,
  DYNAMIC_SCHEME_FIELDS,
  SimpleDynamicScheme,
  VariantType,
} from "./schemes";
import {
  isPreferColorSchemeDark,
  rgbaToHex,
  sourceColorFromImage,
} from "./utils";

const REGEX_URL =
  /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
const REGEX_RGBA = /^rgba?/i;

export async function createColorByImg(props: {
  source: string
  crossOrigin?: string
}) {
  const img = document.createElement("img");

  img.crossOrigin = props.crossOrigin ?? "anonymous";
  img.referrerPolicy = "no-referrer";
  img.src = props.source;
  try {
    const res = await sourceColorFromImage(img, 3);
    return {
      argSourceColor: res[0],
      dominants: res,
    }
  } catch (e) {
    console.error('error, in createImgColor')
    return {
      argSourceColor: undefined,
      dominants: [],
    }
  }
}

export async function getMaterialColor (
  source: string | number, // hex, rgba or http
  options: {
    variant?: VariantType;
    contrastLevel?: ContrastLevelType;
    isDark?: boolean;
    crossOrigin?: string; // only for image inputs
  },
): Promise<SimpleDynamicScheme | null> {
  let argbSourceColor: number | undefined = typeof source === "number" ? source : undefined;
  let dominants: number[] = []
  const variant: VariantType = options.variant ?? "fidelity"
  const contrastLevel: number = ContrastLevelTypeMap[options.contrastLevel ?? "default"]
  const isDark: boolean = options.isDark ?? isPreferColorSchemeDark()

  /** options format */
  // source is URL
  if (typeof source === 'string' && REGEX_URL.test(source)) {
    const color = await createColorByImg({source, crossOrigin: options.crossOrigin})
    argbSourceColor = color.argSourceColor
    dominants = color.dominants
  }

  let possibleHexColor = source;

  if (typeof source === 'string' && REGEX_RGBA.test(source)) {
    possibleHexColor = rgbaToHex(source);
  }

  // hex color
  if (typeof possibleHexColor === 'string' && possibleHexColor.startsWith("#")) {
    argbSourceColor = argbFromHex(possibleHexColor);
  }
  /** created Schema */ 
  if (argbSourceColor === undefined) {
    return null
  }

  const hct = Hct.fromInt(argbSourceColor!);

  const dynamicScheme = buildDynamicScheme(
    hct,
    variant,
    isDark,
    contrastLevel,
    dominants,
  );

  const newScheme = DYNAMIC_SCHEME_FIELDS.reduce((scheme, field) => {
    scheme[field as keyof SimpleDynamicScheme] = hexFromArgb(
      dynamicScheme[field as keyof SimpleDynamicScheme],
    );

    return scheme;
  }, {} as Partial<SimpleDynamicScheme>);

  return newScheme as SimpleDynamicScheme;
}

// Synchronization method，not allow http
export function getMaterialColorWithSync(
  source: string | number, // hex, rgba or http
  options: {
    variant?: VariantType;
    contrastLevel?: ContrastLevelType;
    isDark?: boolean;
    crossOrigin?: string; // only for image inputs
  },
): SimpleDynamicScheme | null {
  let argbSourceColor: number | undefined = typeof source === "number" ? source : undefined;
  let dominants: number[] = []
  const variant: VariantType = options.variant ?? "fidelity"
  const contrastLevel: number = ContrastLevelTypeMap[options.contrastLevel ?? "default"]
  const isDark: boolean = options.isDark ?? isPreferColorSchemeDark()

  /** options format */

  let possibleHexColor = source;

  if (typeof source === 'string' && REGEX_RGBA.test(source)) {
    possibleHexColor = rgbaToHex(source);
  }

  // hex color
  if (typeof possibleHexColor === 'string' && possibleHexColor.startsWith("#")) {
    argbSourceColor = argbFromHex(possibleHexColor);
  }
  /** created Schema */ 
  if (argbSourceColor === undefined) {
    return null
  }

  const hct = Hct.fromInt(argbSourceColor!);

  const dynamicScheme = buildDynamicScheme(
    hct,
    variant,
    isDark,
    contrastLevel,
    dominants,
  );

  const newScheme = DYNAMIC_SCHEME_FIELDS.reduce((scheme, field) => {
    scheme[field as keyof SimpleDynamicScheme] = hexFromArgb(
      dynamicScheme[field as keyof SimpleDynamicScheme],
    );

    return scheme;
  }, {} as Partial<SimpleDynamicScheme>);

  return newScheme as SimpleDynamicScheme;

}
