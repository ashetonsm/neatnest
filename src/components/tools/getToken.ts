import { useAuth0 } from '@auth0/auth0-vue';

export async function getToken() {
    const { getAccessTokenSilently } = useAuth0();
    try {
        const options = {
            authorizationParams:
            {
                scope: 'openid profile email',
                audience: import.meta.env.VITE_AUDIENCE_URL
            }
        };
        return await getAccessTokenSilently(options);
    } catch (error: any) {
        console.error(error);
    };
};