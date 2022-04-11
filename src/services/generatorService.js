import http from "../../http-common";

class GeneratorService {
  generate(data) {
    return http.post("/generate", data);
  }

  generateMultiple(data) {
    return http.post("/generate/multiple", data);
  }
}

export default new GeneratorService();
