import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import user from "./user/index.mock";
import system from './system/index.mock'
import notice from "./notice/index.mock";

const mockModules = [...user, ...system, ...notice];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
