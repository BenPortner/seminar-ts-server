declare const port: string | number;
declare const origin: string[];
declare const adminUIAuthOptions: boolean | {
    type: "basic";
    username: string;
    password: string;
};
declare const privateKeyPath: string | undefined;
declare const certificatePath: string | undefined;
export { port, origin, privateKeyPath, certificatePath, adminUIAuthOptions };
