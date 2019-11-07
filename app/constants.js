export const MICROSOFT_URI = `${SSO_ADDRESS}/${SSO_TENANT_ID}/oauth2/authorize` +
                    `?client_id=${SSO_CLIENT_ID}` +
                    '&response_type=code' +
                    `&redirect_uri=${SSO_REDIRECT_URL}` +
                    '&response_mode=query';
