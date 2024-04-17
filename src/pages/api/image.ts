import type { APIRoute, AstroConfig, ImageTransform } from "astro";
import { BE_ENDPOINT } from "@/constants/ApiConstant";

const service = {
  getURL(options: ImageTransform, imageConfig?: AstroConfig["image"]) {
    return (
      BE_ENDPOINT +
      `/${options.src}?q=${options.quality}&w=${options.width}&h=${options.height}`
    );
  },
};

export const get: APIRoute = async ({ url }) => {
  const urlSearchParams = new URLSearchParams(url.search);
  const src = urlSearchParams.get("src") ?? "";
  const quality = urlSearchParams.get("quality");
  const width = urlSearchParams.get("width");
  const height = urlSearchParams.get("height");

  try {
    const res = await fetch(
      service.getURL({
        src,
        quality: Number(quality),
        width: Number(width),
        height: Number(height),
      })
    );
    const newRes = new Response(res.body, res);
    newRes.headers.set("Cache-Control", "max-age=31536000");
    return newRes;
  } catch (error) {
    return new Response(src, { status: 404 });
  }
};
