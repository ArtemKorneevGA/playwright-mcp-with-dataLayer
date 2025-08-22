/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { z } from "zod";

import { defineTabTool } from "./tool.js";

import type * as playwright from "playwright";

const getDataLayer = defineTabTool({
  capability: "core",
  schema: {
    name: "browser_get_datalayer",
    title: "Get javascript variable dataLayer",
    description:
      "Returns the contents of window.dataLayer or null if it does not exist",
    inputSchema: z.object({}),
    type: "readOnly",
  },

  handle: async (tab, params, response) => {
    response.setIncludeSnapshot();

    let locator: playwright.Locator | undefined;

    await tab.waitForCompletion(async () => {
      // const receiver = locator ?? (tab.page as any);
      const result = await tab.page.evaluate(() => {
        return (window as typeof window & { dataLayer?: unknown }).dataLayer || null;
      });
      // const result = await receiver._evaluateFunction(() => {
      //   return window.dataLayer || null;
      // }, {});
      response.addResult(JSON.stringify(result, null, 2) || "undefined");
    });
  },
});

export default [getDataLayer];
