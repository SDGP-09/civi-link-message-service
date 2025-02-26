// src/utils/eureka.registration.ts
import { Eureka } from 'eureka-js-client';

export function registerWithEureka(eurekaHost: string, eurekaPort: number, appPort: number) {
    // Create a Eureka client instance
    const client = new Eureka({
        instance: {
            app: 'message-service',         // The name to register under
            instanceId: `message-service:${appPort}`,
            hostName: 'localhost',          // or your actual hostname
            ipAddr: '127.0.0.1',
            port: {
                '$': appPort,
                '@enabled': true,
            },
            vipAddress: 'message-service',  // optional VIP name
            statusPageUrl: `http://localhost:${appPort}/info`,  // optional
            healthCheckUrl: `http://localhost:${appPort}/health`, // optional
        },
        eureka: {
            host: eurekaHost,
            port: eurekaPort,
            servicePath: '/eureka/apps/',
        },
    });

    // Optional: set log level to debug for troubleshooting
    client.logger.level('debug');

    // Start Eureka registration
    client.start((error) => {
        console.log(error || 'Eureka registration complete');
    });
}