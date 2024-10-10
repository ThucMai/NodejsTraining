import fs from 'fs';
import path from 'path';
const swaggerJsDoc = require('swagger-jsdoc');

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Nodejs Training API",
            version: "1.0.0",
            description: "API for creating and managing users",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
        ],
    },
    apis: [path.join(__dirname, '../src/routes/*.ts')],
};

// Generate swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Write swagger JSON to a file
const swaggerFilePath = path.join(__dirname, '../logs/swagger_output.json');
fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerDocs, null, 2));
