# Security

[official source](https://expressjs.com/en/advanced/best-practice-security.html)

-   version express is >=4
-   tls : note that in dev the certificate is auto-signed and will raise a warning from any decent browser
-   use helmet
-   reduce fingerprinting (x-powered-by, 404 and other error handler)
-   cors: self-explanatory
-   cookies : not concerned
-   prevent brute-force : see rate-limiter
-   audit dependencies : run npm audit
-   other : not used for now (ex snyk testing, sqlmap, ...)
