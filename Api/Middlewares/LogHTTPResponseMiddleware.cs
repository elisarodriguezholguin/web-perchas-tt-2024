namespace ProyectoBaseNetCore.Middlewares
{
    public static class LogHTTPResponseMiddlewareExtentions
    {
        public static IApplicationBuilder UseLoggerResponseHTTP(this IApplicationBuilder app) => app.UseMiddleware<LogHTTPResponseMiddleware>();
    }

    public class LogHTTPResponseMiddleware
    {
        private readonly RequestDelegate next;

        public LogHTTPResponseMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var originalBodyResponse = context.Response.Body;
            await next(context);
            context.Response.Body = originalBodyResponse;
        }
    }
}