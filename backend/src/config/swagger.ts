const errorResponse = {
  description: "Request failed",
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["error"],
        properties: { error: { type: "string", example: "You must be signed in" } },
      },
    },
  },
};

const secured = (summary: string, tags: string[], responses = {}) => ({
  summary,
  tags,
  security: [{ cookieAuth: [] }],
  responses: {
    "200": { description: "Successful response" },
    "401": errorResponse,
    "403": errorResponse,
    ...responses,
  },
});

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "FaydaRent Backend API",
    version: "1.0.0",
    description:
      "REST API for the FaydaRent house and apartment rental system. Use the Authorize button to provide the hrs_session cookie.",
  },
  servers: [{ url: "http://localhost:3001", description: "Local development server" }],
  tags: [
    { name: "Health", description: "Service health and readiness" },
    { name: "Authentication", description: "Registration, login and session management" },
    { name: "Properties", description: "Property listings and moderation" },
    { name: "Applications", description: "Rental applications" },
    { name: "Leases", description: "Lease management" },
    { name: "Payments", description: "Rent payment ledger" },
    { name: "Maintenance", description: "Maintenance requests" },
    { name: "Notifications", description: "In-app notifications" },
    { name: "Dashboard", description: "Role-aware dashboards" },
    { name: "Admin", description: "Administrator operations" },
    { name: "Audit", description: "Administrator audit log" },
    { name: "Public", description: "Public landing-page data" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "hrs_session",
        description: "HTTP-only session cookie returned by the login endpoint.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["error"],
        properties: { error: { type: "string" } },
      },
      Health: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          service: { type: "string", example: "faydarent-backend" },
          database: { type: "string", example: "up" },
          env: { type: "string", example: "development" },
          uptimeSeconds: { type: "integer", example: 120 },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      AuditLog: {
        type: "object",
        properties: {
          id: { type: "string", example: "cm audit123" },
          actorId: { type: "string", nullable: true },
          action: { type: "string", example: "PROPERTY_APPROVED" },
          entity: { type: "string", example: "Property" },
          entityId: { type: "string", nullable: true },
          metadata: { type: "string", nullable: true, example: "{\"reason\":\"Verified\"}" },
          ipAddress: { type: "string", nullable: true, example: "127.0.0.1" },
          userAgent: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Check service and database health",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Service health",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Health" } } },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Log in and set the session cookie",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@rental.et" },
                  password: { type: "string", format: "password", example: "Admin@123" },
                },
              },
              "/api/fayda/verify": {
                post: {
                  summary: "Verify a Fayda identification number",
                  tags: ["Authentication"],
                  requestBody: {
                    required: true,
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          required: ["fin", "consent"],
                          properties: {
                            fin: { type: "string", minLength: 6, example: "AB1234567" },
                            consent: { type: "boolean", enum: [true], example: true },
                          },
                        },
                        "/api/authorizations/me": {
                          get: secured("Get current user permissions", ["Authentication"]),
                        },
                        "/api/verification/fayda": {
                          post: {
                            summary: "Verify Fayda identity details",
                            tags: ["Authentication"],
                            requestBody: {
                              required: true,
                              content: {
                                "application/json": {
                                  schema: {
                                    type: "object",
                                    required: ["fin", "consent"],
                                    properties: {
                                      fin: { type: "string", minLength: 6, example: "AB1234567" },
                                      consent: { type: "boolean", enum: [true], example: true },
                                    },
                                  },
                                },
                              },
                            },
                            responses: { "200": { description: "Verified Fayda identity details" } },
                          },
                        },
                        "/api/verification/status": {
                          get: secured("Get current user verification status", ["Authentication"]),
                        },
                      },
                    },
                  },
                  responses: {
                    "200": { description: "Fayda claims and account status" },
                    "400": { description: "Invalid FIN or missing consent" },
                    "401": { description: "Fayda verification failed" },
                  },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Authenticated; sets hrs_session cookie" }, "400": errorResponse },
      },
    },
    "/api/auth/logout": {
      post: { summary: "Clear the session cookie", tags: ["Authentication"], responses: { "200": { description: "Logged out" } } },
    },
    "/api/auth/me": {
      get: secured("Get the current account", ["Authentication"]),
    },
    "/api/properties": {
      get: { summary: "Search property listings", tags: ["Properties"], responses: { "200": { description: "Property list" } } },
      post: secured("Create a property listing", ["Properties"]),
    },
    "/api/applications": {
      get: secured("List rental applications", ["Applications"]),
      post: secured("Submit a rental application", ["Applications"]),
    },
    "/api/leases": {
      get: secured("List leases for the current role", ["Leases"]),
    },
    "/api/payments": {
      get: secured("List lease payments", ["Payments"]),
      post: secured("Record a payment", ["Payments"]),
    },
    "/api/maintenance": {
      get: secured("List maintenance requests", ["Maintenance"]),
      post: secured("Create a maintenance request", ["Maintenance"]),
    },
    "/api/notifications": {
      get: secured("List notifications", ["Notifications"]),
    },
    "/api/dashboard": {
      get: secured("Get the role-aware dashboard", ["Dashboard"]),
    },
    "/api/admin/reports": {
      get: secured("Get administrator reports", ["Admin"]),
    },
    "/api/admin/users": {
      get: secured("List users", ["Admin"]),
      put: secured("Update a user account", ["Admin"]),
    },
    "/api/admin/audit": {
      get: {
        ...secured("List audit events", ["Audit"]),
        parameters: [
          { name: "action", in: "query", schema: { type: "string" }, description: "Filter by action" },
          { name: "entity", in: "query", schema: { type: "string" }, description: "Filter by entity type" },
          { name: "actorId", in: "query", schema: { type: "string" }, description: "Filter by actor ID" },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        responses: {
          "200": {
            description: "Paginated audit events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/AuditLog" } },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        pageSize: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/public/stats": {
      get: { summary: "Get public landing-page counters", tags: ["Public"], responses: { "200": { description: "Public statistics" } } },
    },
    "/api/contact": {
      post: {
        summary: "Submit a contact message",
        tags: ["Public"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "subject", "message"],
                properties: {
                  name: { type: "string", example: "Abebe Kebede" },
                  email: { type: "string", format: "email", example: "abebe@example.com" },
                  phone: { type: "string", example: "+251911234567" },
                  subject: { type: "string", example: "Question about a property" },
                  message: { type: "string", example: "I would like more information about this listing." },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Contact message received",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": errorResponse,
        },
      },
    },
    "/api/results": {
      get: {
        summary: "Get public results overview",
        tags: ["Public"],
        responses: {
          "200": {
            description: "Public property listings and non-sensitive summary counts",
          },
        },
      },
    },
    "/api/admin/results": {
      get: {
        ...secured("Get full combined results overview", ["Admin"]),
        responses: {
          "200": {
            description: "Properties, rental applications, contact messages and summary counts",
          },
        },
      },
    },
    "/api/news": {
      get: {
        summary: "List published news articles",
        tags: ["Public"],
        responses: { "200": { description: "Published news articles" } },
      },
    },
    "/api/news/{slug}": {
      get: {
        summary: "Get a published news article",
        tags: ["Public"],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Published news article" },
          "404": { description: "News article not found" },
        },
      },
    },
    "/api/admin/news": {
      get: secured("List all news articles", ["Admin"]),
      post: secured("Create a news article", ["Admin"], {
        "201": { description: "News article created" },
      }),
    },
    "/api/admin/news/{id}": {
      put: secured("Update a news article", ["Admin"]),
      delete: {
        ...secured("Delete a news article", ["Admin"]),
        responses: { "204": { description: "News article deleted" } },
      },
    },
    "/api/properties/{propertyId}/gallery": {
      get: {
        summary: "List photos in a property gallery",
        tags: ["Properties"],
        parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Property gallery photos" } },
      },
      post: {
        ...secured("Add a photo to a property gallery", ["Properties"]),
        parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "201": { description: "Photo added" } },
      },
    },
    "/api/properties/{propertyId}/gallery/reorder": {
      put: {
        ...secured("Reorder property gallery photos", ["Properties"]),
        parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Gallery reordered" } },
      },
    },
    "/api/properties/{propertyId}/gallery/{photoId}": {
      delete: {
        ...secured("Delete a property gallery photo", ["Properties"]),
        parameters: [
          { name: "propertyId", in: "path", required: true, schema: { type: "string" } },
          { name: "photoId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "204": { description: "Photo deleted" } },
      },
    },
  },
} as const;
