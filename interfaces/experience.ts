export interface Experience {
    signInMethods: SignInMethods,
    signInMode: string,
    socialSignInConnectorTargets: string[]
}

export interface SignInMethods {
    email:string;
    sms:string;
    social:string;
    username:string;
}
