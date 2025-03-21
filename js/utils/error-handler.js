export class ErrorHandler {
  static handle(error, context) {
    console.error(`Error in ${context}:`, error);

    // Log to service (in production)
    if (process.env.NODE_ENV === "production") {
      // Add your error logging service here
    }

    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
    };
  }
}
