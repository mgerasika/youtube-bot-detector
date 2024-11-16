import os from 'os';

export function getLocalIpv4(): string  {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        if (interfaces) {
            for (const iface of interfaces) {
                // Check for IPv4 and non-internal (non-loopback) interfaces
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    }

    return ''; // Return null if no IPv4 address is found
}

