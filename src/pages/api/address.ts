import type { APIRoute } from "astro";

import {
  ADDRESS_OWNER_ENDPOINT,
  LANDING_ENDPOINT,
} from "../../constants/ApiConstant";

export const POST: APIRoute = async ({ url, cookies, request, redirect }) => {
  const body = await request.json();
  try {
    const authToken = cookies.get("token")?.value;
    const response = await fetch(
      LANDING_ENDPOINT + ADDRESS_OWNER_ENDPOINT + url.search,
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      cookies.delete("token", { path: "/" });
      return redirect("/login", 302);
    }

    if (data.error || data.statusCode) {
      return new Response(JSON.stringify(null), {
        status: 400,
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(null), {
      status: 200,
    });
  }
};
