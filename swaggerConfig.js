const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Spesifikasi OpenAPI (gunakan versi yang sesuai)
    info: {
      title: "Nama Aplikasi Anda",
      version: "1.0.0",
      description: "Deskripsi Aplikasi Anda",
    },
  },
  apis: ["./routes/*.js"], // Daftar file dengan komentar JSDoc
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
