function grpc_text_headers(r) {
    if (r.headersIn["Content-Type"] == "application/grpc-web-text") {
        r.headersOut["content-type"] = "application/grpc-web-text";
        r.headersOut["Access-Control-Allow-Origin"] = "*";
    }
    if (r.method === "OPTIONS") {
        r.headersOut["Access-Control-Allow-Origin"] = "*";
        r.headersOut["Access-Control-Allow-Credentials"] = "true";
        r.headersOut["Access-Control-Allow-Methods"] = "POST, OPTIONS";
        r.headersOut["Access-Control-Allow-Headers"] = "*";
        r.headersOut["Access-Control-Max-Age"] = "1728000";
    }

}

function grpc_text_response(r, data, flags) {
    r.sendBuffer(data.toString("base64"), flags);
}

function grpc_text_content(r) {
   if (r.headersIn["Content-Type"] == "application/grpc-web-text") {
       let buff = Buffer.from(r.requestText, 'base64');
       buff.copy(r.requestBuffer);
       r.internalRedirect("@grpc-web");
   } else {
       r.internalRedirect("@grpc-backend");
   }
}

export default {grpc_text_content, grpc_text_headers, grpc_text_response};