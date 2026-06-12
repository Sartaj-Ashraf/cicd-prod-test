import { UAParser } from "ua-parser-js";

const parseDevice = (userAgent: string) => {
  const parser = new (UAParser as any)(userAgent);

  return `${parser.getBrowser().name} on ${parser.getOS().name}`;
};
export default parseDevice;