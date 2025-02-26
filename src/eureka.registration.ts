import { Eureka } from 'eureka-js-client';

export function registerWithEureka(eurekaHost: string, eurekaPort: number, port: number) {
    const client = new Eureka({
        instance: {
            app: 'civilink-massenger',
            instanceId: `civilink-massenger-${port}`,
            hostName: 'civilink-massenger-service.development.svc.cluster.local',
            ipAddr: '127.0.0.1',
            statusPageUrl: `http://civilink-massenger-service.development.svc.cluster.local:${port}/actuator/info`,
            healthCheckUrl: `http://civilink-massenger-service.development.svc.cluster.local:${port}/actuator/health`,
            homePageUrl: `http://civilink-massenger-service.development.svc.cluster.local:${port}`,
            port: {
                $: port,
                '@enabled': true,
            },
            vipAddress: 'civilink-massenger',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: eurekaHost,
            port: eurekaPort,
            servicePath: '/eureka/apps/',
        },
    });

    client.start((error) => {
        if (error) {
            console.error('Eureka registration failed:', error);
        } else {
            console.log('Successfully registered with Eureka');
        }
    });
}
