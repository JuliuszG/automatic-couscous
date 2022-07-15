import { json } from "@remix-run/node";
import HttpStatusCode from "./utils/enums/httpStatusCodes";

export class Responses {
    private constructor() {}
    static BAD_REQUEST(data: unknown) {
        return json(data, { status: HttpStatusCode.BAD_REQUEST });
    }
}
