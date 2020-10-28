import http from "./wx-request.js";
export default class {
  async getUser() {
    var msg = await http.post("/test/hello", null);
    debugger;
    return msg;
  }
}